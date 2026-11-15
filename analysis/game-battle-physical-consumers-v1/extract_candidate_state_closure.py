#!/usr/bin/env python3
"""Candidate envelope of explicit literal/alias/goto source-text edges only.

Unresolved values are a frontier, never an excuse to mark all states covered.
The result does not establish actual common-family reachability or closure.
"""
from pathlib import Path
from collections import Counter, deque
import hashlib
import importlib.util
import json
import re
import sys

sys.dont_write_bytecode = True
R = Path(__file__).resolve().parents[2]
P = R / 'build/analysis/game-battle-physical-consumers-v1'
spec = importlib.util.spec_from_file_location('mechanical_inventory', Path(__file__).with_name('extract_consumer_inventory.py'))
mechanical = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mechanical)


def info(p):
    b = p.read_bytes()
    return dict(path=str(p.relative_to(R)), bytes=len(b), sha256=hashlib.sha256(b).hexdigest())


def strip_outer(expression):
    text = expression.strip()
    while text.startswith('('):
        mask = mechanical.mask_literals_and_comments(text)
        if mechanical.closing(mask, 0) != len(mask) - 1:
            break
        text = text[1:-1].strip()
    return text


def opening(mask, end):
    assert mask[end] == ')'
    depth = 0
    for i in range(end, -1, -1):
        if mask[i] == ')':
            depth += 1
        elif mask[i] == '(':
            depth -= 1
            if depth == 0:
                return i
    raise AssertionError(('unbalanced reverse parenthesis', end))


def previous_code(mask, before):
    i = before - 1
    while i >= 0 and mask[i].isspace():
        i -= 1
    return i


def rhs_end(mask, start):
    p = b = c = 0
    for i in range(start, len(mask)):
        ch = mask[i]
        if ch in ';,' and p == b == c == 0:
            return i, ch
        if ch == '(':
            p += 1
        elif ch == ')':
            if p == 0:
                return i, ')'
            p -= 1
        elif ch == '[':
            b += 1
        elif ch == ']':
            if b == 0:
                return i, ']'
            b -= 1
        elif ch == '{':
            c += 1
        elif ch == '}':
            if c == 0:
                return i, '}'
            c -= 1
    raise AssertionError(('unterminated assignment expression', start))


def address_offset(address):
    text = strip_outer(address)
    mask = mechanical.mask_literals_and_comments(text)
    p = b = c = 0
    matches = []
    for i, ch in enumerate(mask):
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
        elif ch == '+' and p == b == c == 0:
            literal = mechanical.integer_argument(text[i + 1:])
            if literal['literal_integer'] == 44:
                matches.append(dict(base_expression=text[:i].strip(), offset_expression=text[i + 1:].strip(),
                                    offset_literal=44, identification='last_top_level_plus_literal44'))
    if matches:
        assert len(matches) == 1
        return matches[0]
    # Keep ambiguous/nested textual +44 occurrences visible; do not claim the
    # corresponding base or actual byte-address interpretation is established.
    if re.search(r'\+\s*(?:0[xX]0*2[cC]|44)[uUlL]*(?![\w])', mask):
        return dict(base_expression=None, offset_expression=None, offset_literal=44,
                    identification='nested_or_nonfinal_textual_plus44_unresolved_address')
    return None


def state_writes(source):
    rows = []
    operator_re = re.compile(r'(?<![=<>!])(?:<<=|>>=|[+\-*/%&|^]=|=(?!=))')
    for m in operator_re.finditer(source.mask):
        end_address = previous_code(source.mask, m.start())
        if end_address < 0 or source.mask[end_address] != ')':
            continue
        begin_address = opening(source.mask, end_address)
        end_cast = previous_code(source.mask, begin_address)
        if end_cast < 0 or source.mask[end_cast] != ')':
            continue
        begin_cast = opening(source.mask, end_cast)
        star = previous_code(source.mask, begin_cast)
        if star < 0 or source.mask[star] != '*':
            continue
        address = source.text[begin_address + 1:end_address]
        offset = address_offset(address)
        if offset is None:
            continue
        end, terminator = rhs_end(source.mask, m.end())
        expression = source.text[m.end():end].strip()
        literal = mechanical.integer_argument(expression)
        base = offset['base_expression']
        exact_param = base is not None and strip_outer(base) == 'param_1'
        simple_literal = (m.group() == '=' and literal['literal_integer'] is not None)
        rows.append(dict(operator=m.group(), lhs=source.text[star:m.start()].strip(),
                         address_expression=address.strip(), cast_text=source.text[begin_cast:end_cast + 1],
                         base_expression=base, base_is_exact_param_1=exact_param,
                         base_classification='exact_param_1' if exact_param else 'other_or_unresolved_expression',
                         base_aliasing_not_inferred=True, offset=offset,
                         RHS_expression=expression, RHS_literal_integer=literal['literal_integer'],
                         candidate_literal_state=literal['literal_integer'] if simple_literal else None,
                         unresolved=not simple_literal,
                         unresolved_reason=None if simple_literal else 'compound_assignment_or_nonliteral_RHS',
                         expression_terminator=terminator,
                         **source.location(star, end + (1 if terminator == ';' else 0))))
    return rows


def main():
    inventory_path = P / 'consumer-inventory.json'
    inventory = json.loads(inventory_path.read_text())
    assert inventory['counts']['canonical_cache_entries'] == 728
    assert inventory['counts']['body_case_labels'] == 244
    assert inventory['source_closure_claim'] is False
    for row in inventory['source_files']:
        assert info(R / row['path']) == row
    body_source = mechanical.Source('0x40a120', R / inventory['source_files'][0]['path'])
    guard_sources = [mechanical.Source('0x' + name, R / 'build/analysis/game-battle-physical-family-v1' / (name + '-retained-pseudocode.txt'))
                     for name in ['423fa0', '4241f0']]
    groups = {g['id']: g for g in inventory['body_case_index']['complete_adjacent_alias_groups']}
    labels = {r['value']: r for r in inventory['body_case_index']['labels']}
    direct_targets = {r['address']: r for r in inventory['direct_targets']}
    label_groups = {r['name']: r['lexical_group_id'] for r in inventory['body_case_index']['named_labels']}

    def group_at(offset):
        return next((g['id'] for g in groups.values()
                     if g['complete_group']['character_range']['start'] <= offset
                     < g['complete_group']['character_range']['end_exclusive']), None)

    seed_calls = [dict(c, seed_origin='424310_literal_append') for c in inventory['action_append_calls']
                  if c['function'] == '0x424310']
    for guard in guard_sources:
        for call in guard.direct_calls():
            if call['target'] in mechanical.APPEND:
                arg = call['arguments'][mechanical.APPEND[call['target']]]
                seed_calls.append(dict(call, action_literal=arg['literal_integer'],
                                       action_expression=arg['expression'], seed_origin='guard_helper_literal_append'))
    confirmed_seeds = [15, 18, 23, 41, 16, 17, 20, 21, 22]
    seeds = [dict(kind='action_append_literal', state=c['action_literal'],
                  source=c['source'], function=c['function'], start_line=c['start_line'],
                  character_range=c['character_range'], action_expression=c['action_expression'],
                  origin=c['seed_origin']) for c in seed_calls if c['action_literal'] is not None]
    seeds.extend(dict(kind='caller_supplied_confirmed_seed', state=n,
                      origin='positive_variant_action_or_factory_allocation') for n in confirmed_seeds)
    unknown_seed_calls = [c for c in seed_calls if c['action_literal'] is None]
    writes = state_writes(body_source)
    all_groups = {}
    outside_group_writes = []
    for g in groups.values():
        all_groups[g['id']] = dict(id=g['id'], values=g['values'],
            adjacent_alias_values=g['adjacent_alias_values'], implementation_label_value=g['implementation_label_value'],
            complete_group=g['complete_group'], private_text=g['private_text'],
            literal_action_edges=[], state_writes=[], goto_edges=[], direct_calls=[])
    for call in inventory['direct_calls']:
        if call['function'] != '0x40a120':
            continue
        group_id = group_at(call['character_range']['start'])
        if group_id is not None:
            all_groups[group_id]['direct_calls'].append(call)
    for call in inventory['action_append_calls']:
        if call['function'] != '0x40a120':
            continue
        group_id = group_at(call['character_range']['start'])
        if group_id is not None:
            all_groups[group_id]['literal_action_edges'].append(dict(call,
                target_state=call['action_literal'], target_object_expression=call['arguments'][1]['expression'],
                target_object_is_exact_param_1=strip_outer(call['arguments'][1]['expression']) == 'param_1'))
    for row in writes:
        group_id = group_at(row['character_range']['start'])
        if group_id is None:
            outside_group_writes.append(row)
        else:
            all_groups[group_id]['state_writes'].append(row)
    for row in inventory['body_case_index']['gotos']:
        if row['lexical_group_id'] is not None:
            all_groups[row['lexical_group_id']]['goto_edges'].append(dict(row,
                target_group_id=label_groups.get(row['label'])))
    ordered_groups = list(groups)
    for i, group_id in enumerate(ordered_groups):
        row = all_groups[group_id]
        row['lexical_next_group_id'] = ordered_groups[i + 1] if i + 1 < len(ordered_groups) else None
        addresses = sorted({c['target'] for c in row['direct_calls']}, key=lambda x: int(x, 16))
        row['direct_targets'] = [dict(address=a,
            present_in_728_cache=direct_targets[a]['present_in_canonical_cache'],
            evidence_id=direct_targets[a]['evidence_id'],
            source_locations=[{k:c[k] for k in ['source','function','start_line','character_range']}
                              for c in row['direct_calls'] if c['target'] == a]) for a in addresses]
        row['uncached_direct_targets'] = [r for r in row['direct_targets'] if not r['present_in_728_cache']]

    pending = deque()
    candidate = set()
    discovery = []
    noncase = []

    def add_state(state, reason):
        label = labels.get(state)
        if label is None:
            noncase.append(dict(state=state, reason=reason))
            return
        add_group(label['complete_group_id'], dict(kind='state_to_adjacent_alias_group', state=state, source=reason))

    def add_group(group_id, reason):
        if group_id not in candidate:
            candidate.add(group_id)
            pending.append(group_id)
            discovery.append(dict(group_id=group_id, reason=reason))

    for seed in seeds:
        add_state(seed['state'], seed)
    while pending:
        group_id = pending.popleft()
        group = all_groups[group_id]
        for row in group['literal_action_edges']:
            if row['target_state'] is not None:
                add_state(row['target_state'], dict(kind='literal_action_append', from_group=group_id,
                    source=row['source'], start_line=row['start_line'], character_range=row['character_range']))
        for row in group['state_writes']:
            if row['candidate_literal_state'] is not None:
                add_state(row['candidate_literal_state'], dict(kind='literal_plus2c_state_write', from_group=group_id,
                    base_expression=row['base_expression'], base_is_exact_param_1=row['base_is_exact_param_1'],
                    offset_identification=row['offset']['identification'], source=row['source'],
                    start_line=row['start_line'], character_range=row['character_range']))
        for row in group['goto_edges']:
            if row['target_group_id'] is not None:
                add_group(row['target_group_id'], dict(kind='goto_label_group', from_group=group_id,
                    label=row['label'], source=row['source'], start_line=row['start_line'],
                    character_range=row['character_range']))
    candidate_groups = [row for g, row in all_groups.items() if g in candidate]
    candidate_states = sorted({n for g in candidate_groups for n in g['values']})
    unknown_actions = [dict(row, from_group=g['id']) for g in candidate_groups
                       for row in g['literal_action_edges'] if row['target_state'] is None]
    unknown_writes = [dict(row, from_group=g['id']) for g in candidate_groups
                      for row in g['state_writes'] if row['unresolved']]
    unknown_gotos = [dict(row, from_group=g['id']) for g in candidate_groups
                     for row in g['goto_edges'] if row['target_group_id'] is None]
    candidate_calls = [dict(row, from_group=g['id']) for g in candidate_groups for row in g['direct_calls']]
    absent = sorted({r['target'] for r in candidate_calls if not direct_targets[r['target']]['present_in_canonical_cache']},
                    key=lambda x: int(x, 16))
    uncached = [dict(address=a, cache_test='exact normalized key in retained728-entry cache',
                     source_locations=[{k:r[k] for k in ['from_group','source','function','start_line','character_range']}
                                       for r in candidate_calls if r['target'] == a]) for a in absent]
    counts = dict(seed_literal_occurrences=len(seeds), unique_seed_states=len({r['state'] for r in seeds}),
                  seed_action_calls_by_source=dict(Counter(c['function'] for c in seed_calls)),
                  unresolved_seed_action_calls=len(unknown_seed_calls),
                  candidate_cases=len(candidate_states), candidate_groups=len(candidate_groups),
                  all_indexed_cases=244, all_indexed_groups=193,
                  all_plus2c_state_writes=len(writes), outside_group_plus2c_state_writes=len(outside_group_writes),
                  candidate_literal_state_writes=sum(r['candidate_literal_state'] is not None for g in candidate_groups for r in g['state_writes']),
                  candidate_dynamic_state_writes=len(unknown_writes), candidate_dynamic_action_calls=len(unknown_actions),
                  candidate_unresolved_gotos=len(unknown_gotos), noncase_literal_edges=len(noncase),
                  candidate_direct_FUN_call_sites=len(candidate_calls),
                  candidate_direct_FUN_targets=len({r['target'] for r in candidate_calls}),
                  candidate_uncached_FUN_targets=len(uncached))
    out = dict(schema='moli.physical-candidate-state-closure-stage205.v1',
        authority='Mechanical candidate envelope only; not actual reachability, complete source closure, or runtime acceptance',
        inventory=info(inventory_path), source_sha256=inventory['source_sha256'],
        guard_source_files=[info(s.path) for s in guard_sources],
        seed_rules=['Every literal third argument of434990/4349e0 in424310.',
                    'Every literal third argument of434990/4349e0 in423fa0 and4241f0.',
                    'Caller-confirmed positive-variant actions15/18/23/41 and factory states16/17/20/21/22.',
                    'No other4260b0 literal action is a seed.'],
        edge_rules=['Adjacent alias group membership, including all labels of a reached group.',
                    'Literal third argument of434990/4349e0 inside a candidate group,including other-object arguments.',
                    'Simple literal RHS assigned through a dereferenced address with textual+44/+0x2c; parameter and other-object bases retained.',
                    'Goto label mapped to its physical containing group; general CFG/fallthrough and expression evaluation are not computed.'],
        assignment_parser_rules=['Mask strings/comments and preserve source offsets.',
            'Recognize casted dereference LHS and standalone assignment operators; comparisons are excluded.',
            'Prefer a final top-level+44 address term. Nested/nonfinal textual+44 remains explicitly ambiguous but is included as a candidate edge.',
            'A true base_is_exact_param_1 means the stripped expression is literally param_1; false does not prove distinct runtime ownership.',
            'Only plain= with a whole integer literal yields a candidate state; compound/dynamic RHS remains unknown.'],
        counts=counts, seeds=seeds, unresolved_seed_actions=unknown_seed_calls,
        candidate_states=candidate_states, candidate_group_ids=[g['id'] for g in candidate_groups],
        discovery=discovery, candidate_groups=candidate_groups,
        all_plus2c_state_writes=writes, outside_group_state_writes=outside_group_writes,
        unknown_frontier=dict(dynamic_actions=unknown_actions, dynamic_state_writes=unknown_writes,
                              unresolved_gotos=unknown_gotos, noncase_literal_edges=noncase),
        uncached_direct_helpers=uncached,
        limits=['This is a candidate upper-bound envelope over the specified explicit mechanical edges only.',
            'Dynamic frontiers remain unresolved; they are neither expanded to every state nor marked covered.',
            'Full-function source indices include unrelated handlers; candidate membership is not proof of common-family reachability.',
            'Literal state writes to other or ambiguous object bases may overapproximate the relevant body set.',
            'General non-alias fallthrough and CFG are not evaluated; lexical next-group metadata does not create a closure edge.',
            'Casts,variables,arithmetic,bitwise expressions and pointer aliasing are not evaluated.',
            'No native instruction decoding,REA call,original execution,or public source modification.'],
        true_reachability_claim=False, complete_closure_claim=False, unknowns_marked_covered=False,
        REA_calls=0, original_execution=0, public_files_modified=False)
    destination = P / 'candidate-state-closure.json'
    destination.write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(path=str(destination.relative_to(R)), **counts, uncached_helper_addresses=absent), ensure_ascii=False))


if __name__ == '__main__':
    main()
