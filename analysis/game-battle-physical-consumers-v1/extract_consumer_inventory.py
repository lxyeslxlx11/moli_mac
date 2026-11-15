#!/usr/bin/env python3
"""Mechanical source-text indexing only; no execution or semantic completion.

All offsets refer to the retained private decompiler text. This is not an
instruction decoder, control-flow recovery, reachability proof, or runtime
observation. Exact argument expressions remain unresolved unless the entire
argument is a literal integer (optionally wrapped in parentheses).
"""
from pathlib import Path
from bisect import bisect_right
from collections import Counter
import hashlib
import json
import re

R = Path(__file__).resolve().parents[2]
P = R / 'build/analysis/game-battle-physical-consumers-v1'
FILES = [
    ('0x40a120', R / 'build/analysis/game-battle-physical-family-v1/40a120-retained-pseudocode.txt'),
    ('0x424310', R / 'build/analysis/game-battle-physical-family-v1/424310-retained-pseudocode.txt'),
    ('0x4260b0', R / 'build/analysis/game-battle-runtime-v1/004260b0-derived-pseudocode.txt'),
]
LAYERS = [
    R / 'build/analysis/game-battle-moving-numeric-v1/functions-complete.json',
    R / 'build/analysis/game-battle-physical-family-v1/functions-added.json',
]
APPEND = {'0x434990': 2, '0x4349e0': 2}


def sha(b):
    return hashlib.sha256(b).hexdigest()


def info(p):
    b = p.read_bytes()
    return dict(path=str(p.relative_to(R)), bytes=len(b), sha256=sha(b))


def mask_literals_and_comments(text):
    """Blank non-code in place; preserve every newline and code-point offset."""
    out = list(text)
    i = 0
    while i < len(text):
        if text.startswith('//', i):
            end = text.find('\n', i + 2)
            if end < 0:
                end = len(text)
        elif text.startswith('/*', i):
            close = text.find('*/', i + 2)
            assert close >= 0, ('unterminated block comment', i)
            end = close + 2
        elif text[i] in ['"', "'"]:
            quote = text[i]
            end = i + 1
            while end < len(text):
                if text[end] == '\\':
                    end += 2
                elif text[end] == quote:
                    end += 1
                    break
                else:
                    end += 1
            else:
                raise AssertionError(('unterminated quoted token', i))
        else:
            i += 1
            continue
        for j in range(i, min(end, len(text))):
            if text[j] != '\n':
                out[j] = ' '
        i = end
    result = ''.join(out)
    assert len(result) == len(text)
    assert [i for i, c in enumerate(result) if c == '\n'] == [i for i, c in enumerate(text) if c == '\n']
    return result


def closing(mask, start, left='(', right=')'):
    assert mask[start] == left
    depth = 0
    for i in range(start, len(mask)):
        if mask[i] == left:
            depth += 1
        elif mask[i] == right:
            depth -= 1
            if depth == 0:
                return i
    raise AssertionError(('unbalanced delimiter', start, left, right))


def integer_argument(raw):
    expression = raw.strip()
    stripped = expression
    wrappers = 0
    while stripped.startswith('('):
        m = mask_literals_and_comments(stripped)
        if closing(m, 0) != len(stripped) - 1:
            break
        stripped = stripped[1:-1].strip()
        wrappers += 1
    match = re.fullmatch(r'([+-]?)\s*(0[xX][0-9a-fA-F]+|[0-9]+)([uUlL]*)', stripped)
    if not match:
        return dict(expression=expression, classification='unresolved_expression', literal_integer=None)
    sign, token, suffix = match.groups()
    if len(token) > 1 and token.startswith('0') and not token.lower().startswith('0x'):
        base = 8
    else:
        base = 16 if token.lower().startswith('0x') else 10
    value = int(token, base) * (-1 if sign == '-' else 1)
    return dict(expression=expression, classification='parenthesized_integer_literal' if wrappers else 'integer_literal',
                literal_integer=value, radix=base, suffix=suffix, unary_sign=sign or None,
                note='Lexical integer only; no signed32/type/cast normalization or branch inference')


class Source:
    def __init__(self, procedure, path):
        self.procedure = procedure
        self.path = path
        raw = path.read_bytes()
        self.text = raw.decode('utf8')
        assert self.text.encode('utf8') == raw
        self.mask = mask_literals_and_comments(self.text)
        self.lines = [0] + [i + 1 for i, c in enumerate(self.text) if c == '\n']
        self.bytes_at = [0]
        for c in self.text:
            self.bytes_at.append(self.bytes_at[-1] + len(c.encode('utf8')))
        self.depth = []
        level = 0
        for c in self.mask:
            self.depth.append(level)
            if c == '{':
                level += 1
            elif c == '}':
                level -= 1
                assert level >= 0
        assert level == 0

    def location(self, start, end):
        return dict(source=str(self.path.relative_to(R)), function=self.procedure,
                    character_range=dict(start=start, end_exclusive=end),
                    UTF8_byte_range=dict(start=self.bytes_at[start], end_exclusive=self.bytes_at[end]),
                    start_line=bisect_right(self.lines, start),
                    end_line=bisect_right(self.lines, max(start, end - 1)),
                    sha256=sha(self.text[start:end].encode('utf8')))

    def direct_calls(self):
        rows = []
        for m in re.finditer(r'\bFUN_([0-9a-fA-F]{8})\s*\(', self.mask):
            start = m.start()
            paren = self.mask.index('(', m.start(), m.end())
            end = closing(self.mask, paren)
            tail = end + 1
            while tail < len(self.mask) and self.mask[tail].isspace():
                tail += 1
            if self.depth[start] == 0 and tail < len(self.mask) and self.mask[tail] == '{':
                continue  # Function definition, not a call.
            args = []
            at = paren + 1
            p = b = c = 0
            for i in range(paren + 1, end):
                ch = self.mask[i]
                if ch == '(':
                    p += 1
                elif ch == ')':
                    p -= 1
                elif ch == '[':
                    b += 1
                elif ch == ']':
                    b -= 1
                elif ch == '{':
                    c += 1
                elif ch == '}':
                    c -= 1
                elif ch == ',' and p == b == c == 0:
                    args.append(integer_argument(self.text[at:i]))
                    at = i + 1
                assert p >= 0 and b >= 0 and c >= 0
            assert p == b == c == 0
            if self.text[at:end].strip():
                args.append(integer_argument(self.text[at:end]))
            address = hex(int(m.group(1), 16))
            rows.append(dict(target=address, callee_text='FUN_' + m.group(1), arguments=args,
                             brace_depth=self.depth[start], **self.location(start, end + 1)))
        return rows


def body_cases(source):
    switch = re.search(r'^  switch\(', source.mask, re.M)
    assert switch is not None
    paren = source.mask.index('(', switch.start())
    after = closing(source.mask, paren) + 1
    open_brace = source.mask.index('{', after)
    assert not source.mask[after:open_brace].strip()
    end_brace = closing(source.mask, open_brace, '{', '}')
    wanted_depth = source.depth[open_brace] + 1
    labels = [m for m in re.finditer(r'^  (?:case\s+([^:\n]+)|default)\s*:', source.mask, re.M)
              if open_brace < m.start() < end_brace and source.depth[m.start()] == wanted_depth]
    all_at_depth = [m for m in re.finditer(r'^[ \t]*(?:case\s+([^:\n]+)|default)\s*:', source.mask, re.M)
                    if open_brace < m.start() < end_brace and source.depth[m.start()] == wanted_depth]
    assert len(labels) == len(all_at_depth), 'Unexpected top-level case indentation'
    groups = []
    rows = []
    pending = []
    out = P / 'consumer-case-text'
    out.mkdir(exist_ok=True)
    for i, m in enumerate(labels):
        end = labels[i + 1].start() if i + 1 < len(labels) else end_brace
        raw_label = source.text[m.start():m.end()].strip()
        label_text = m.group(1)
        literal = None if label_text is None else integer_argument(label_text)
        assert literal is None or literal['literal_integer'] is not None
        only_label = not source.mask[m.end():end].strip()
        row = dict(label=raw_label, value=None if literal is None else literal['literal_integer'],
                   pure_adjacent_alias=only_label,
                   raw_block=source.location(m.start(), end), label_location=source.location(m.start(), m.end()))
        rows.append(row)
        pending.append(row)
        if not only_label:
            group_id = 'body-case-group-' + str(len(groups)).zfill(3)
            start = pending[0]['raw_block']['character_range']['start']
            file = out / ('group-' + str(len(groups)).zfill(3) + '-case-' + str(row['value']) + '.txt')
            file.write_text(source.text[start:end])
            group = dict(id=group_id, labels=[r['label'] for r in pending], values=[r['value'] for r in pending],
                         adjacent_alias_values=[r['value'] for r in pending[:-1]],
                         implementation_label_value=row['value'],
                         complete_group=source.location(start, end), private_text=info(file))
            groups.append(group)
            for r in pending:
                r['complete_group_id'] = group_id
                r['implementation_label_value'] = row['value']
                r['complete_group_character_range'] = group['complete_group']['character_range']
            pending = []
    assert not pending, 'Trailing pure alias lacks an implementation block'
    assert len({r['value'] for r in rows}) == len(rows)
    named_labels = []
    for m in re.finditer(r'^([A-Za-z_$][A-Za-z0-9_$]*)\s*:', source.mask, re.M):
        if not open_brace < m.start() < end_brace:
            continue
        owner = next((g for g in groups if g['complete_group']['character_range']['start'] <= m.start() < g['complete_group']['character_range']['end_exclusive']), None)
        named_labels.append(dict(name=m.group(1), lexical_group_id=owner['id'] if owner else None,
                                 **source.location(m.start(), m.end())))
    label_names = {r['name'] for r in named_labels}
    gotos = []
    for m in re.finditer(r'\bgoto\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*;', source.mask):
        if not open_brace < m.start() < end_brace:
            continue
        owner = next((g for g in groups if g['complete_group']['character_range']['start'] <= m.start() < g['complete_group']['character_range']['end_exclusive']), None)
        gotos.append(dict(label=m.group(1), label_present_within_switch=m.group(1) in label_names,
                          lexical_group_id=owner['id'] if owner else None,
                          **source.location(m.start(), m.end())))
    return dict(switch=source.location(switch.start(), end_brace + 1), labels=rows,
                complete_adjacent_alias_groups=groups, named_labels=named_labels, gotos=gotos,
                tail_after_switch=source.location(end_brace + 1, len(source.text)),
                note='Only adjacent whitespace/comment-only aliases share a group. Goto and fallthrough semantics are not flattened; named labels and gotos retain their original source positions.')


def main():
    assert P.is_dir()
    sources = [Source(*r) for r in FILES]
    cases = body_cases(sources[0])
    calls = [c for s in sources for c in s.direct_calls()]
    by_target = Counter(r['target'] for r in calls)
    cache = {}
    for path in LAYERS:
        current = json.loads(path.read_text())
        assert not set(cache).intersection(current)
        cache.update(current)
    assert len(cache) == 728
    helper_identities = [dict(address=a, evidence_id=cache[a]['id'], body=cache[a]['procedure']['body'],
                              action_argument_zero_based_index=i)
                         for a, i in APPEND.items()]
    action_calls = []
    for call in calls:
        if call['target'] not in APPEND:
            continue
        index = APPEND[call['target']]
        assert len(call['arguments']) > index
        action = call['arguments'][index]
        group = None
        if call['function'] == '0x40a120':
            at = call['character_range']['start']
            group = next((g for g in cases['complete_adjacent_alias_groups']
                          if g['complete_group']['character_range']['start'] <= at < g['complete_group']['character_range']['end_exclusive']), None)
        action_calls.append(dict(**call, action_argument_zero_based_index=index,
                                 action_literal=action['literal_integer'],
                                 action_expression=action['expression'],
                                 lexical_body_group_id=group['id'] if group else None))
    action_literals = Counter(c['action_literal'] for c in action_calls if c['action_literal'] is not None)
    targets = []
    for a, count in sorted(by_target.items(), key=lambda item: int(item[0], 16)):
        found = cache.get(a)
        candidates = []
        if found is None:
            for entry, dossier in cache.items():
                for bounds in dossier['procedure']['body'].get('ranges', []):
                    start, end = bounds.get('start', ''), bounds.get('end', '')
                    if (re.fullmatch(r'0x[0-9a-fA-F]+', start)
                            and re.fullmatch(r'0x[0-9a-fA-F]+', end)
                            and int(start, 16) <= int(a, 16) <= int(end, 16)):
                        candidates.append(dict(entry=entry, evidence_id=dossier['id'], range=bounds))
        targets.append(dict(address=a, calls=count, present_in_canonical_cache=found is not None,
                            evidence_id=found['id'] if found else None,
                            canonical_entry=found['procedure']['address'] if found else None,
                            body=found['procedure']['body'] if found else None,
                            body_range_containment_candidates=candidates,
                            caller_functions=sorted({c['function'] for c in calls if c['target'] == a})))
    action_groups = {r['value']: r['complete_group_id'] for r in cases['labels']}
    counts = dict(source_files=len(sources), body_case_labels=len(cases['labels']),
                  adjacent_alias_labels=sum(r['pure_adjacent_alias'] for r in cases['labels']),
                  complete_alias_groups=len(cases['complete_adjacent_alias_groups']),
                  named_labels=len(cases['named_labels']), goto_sites=len(cases['gotos']),
                  action_append_calls=len(action_calls),
                  action_append_calls_by_source=dict(Counter(c['function'] for c in action_calls)),
                  literal_action_calls=sum(c['action_literal'] is not None for c in action_calls),
                  unresolved_action_expressions=sum(c['action_literal'] is None for c in action_calls),
                  distinct_literal_actions=len(action_literals),
                  direct_FUN_call_sites=len(calls), distinct_direct_FUN_targets=len(targets),
                  canonical_cache_entries=728,
                  targets_present_in_cache=sum(r['present_in_canonical_cache'] for r in targets),
                  targets_absent_from_cache=sum(not r['present_in_canonical_cache'] for r in targets))
    out = dict(schema='moli.physical-consumer-mechanical-inventory-stage205.v1',
               authority='Mechanical index of existing private fixed37c4 decompiler text and retained canonical dossiers; no new REA call or original execution',
               source_sha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
               source_files=[info(s.path) for s in sources],
               canonical_cache_layers=[info(p) for p in LAYERS],
               input_obligations=info(R / 'analysis/game-battle-physical-family-v1/consumer-obligations.json'),
               counts=counts, parsing_rules=[
                   'Mask strings,character literals,line/block comments without changing character or newline offsets.',
                   'Locate the first exact two-space outer switch in40a120; require every top-level case at its brace depth to have the exact two-space indentation.',
                   'Ranges are start-inclusive,end-exclusive; both Unicode code-point and UTF8-byte ranges and one-based line locations are recorded.',
                   'Only adjacent cases with whitespace/comments alone form aliases; each label points to its complete adjacent-label group text/hash.',
                   'Named goto labels and goto sites remain separate lexical edges; do not infer runtime control flow or flatten shared tails.',
                   'FUN_XXXXXXXX followed by a balanced argument list is a direct textual call,excluding the top-level function definition.',
                   'Split arguments only at commas outside balanced parentheses/brackets/braces after masking comments/literals.',
                   'Only whole integer literal arguments,optionally parenthesized,receive lexical integer values; do not evaluate variables,casts,arithmetic,branch conditions or signed32 conversions.',
                   'Action helper classification is restricted to434990 and4349e0 and their third argument,anchored to existing retained helper dossiers.',
                   'All three entire source functions are indexed,not filtered to the common family. Main4260b0 and body40a120 include unrelated handlers; caller semantics must be scoped by the parent.',
               ], body_case_index=cases, action_helper_identities=helper_identities,
               action_append_calls=action_calls,
               literal_action_frequency=[dict(value=n, calls=count, body_case_group_id=action_groups.get(n))
                                         for n,count in sorted(action_literals.items())],
               unresolved_action_calls=[c for c in action_calls if c['action_literal'] is None],
               direct_calls=calls, direct_targets=targets,
               unknowns_and_limits=[
                   'No inferred value for variable or expression action arguments.',
                   'No inference that an indexed case is reachable for the common family.',
                   'No resolution of indirect calls or symbol-only intrinsics such as__ftol to native addresses.',
                   'Adjacent alias grouping does not flatten non-adjacent gotos or shared fallthrough tails.',
                   'Source aliases and supplied dossier body extents are observations,not original runtime execution.',
                   'A canonical cache hit does not prove complete native source or runtime equivalence.',
                   'Cache presence means an exact normalized key. Range-containment candidates are mechanical inclusive-range matches,not resolved containing procedures.',
               ], source_closure_claim=False, runtime_implementation_claim=False,
               REA_calls=0, original_execution=0, public_files_modified=False)
    dest = P / 'consumer-inventory.json'
    dest.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(path=str(dest.relative_to(R)),**counts),ensure_ascii=False))


if __name__ == '__main__':
    main()
