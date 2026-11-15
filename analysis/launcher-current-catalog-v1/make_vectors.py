"""Original catalog-container and byte-comparison vectors; no vendor material."""
import argparse
import json
import re
from pathlib import Path
from xml.etree import ElementTree as ET


def container(source, root_name, child_name, bare=False):
    if bare:
        source = re.sub(r'&(?!#[xX][0-9a-fA-F]+;|#[0-9]+;|[A-Za-z][A-Za-z0-9]*;)', '&amp;', source)
    root = ET.fromstring(source)
    return root.tag == root_name and any(child.tag == child_name for child in root)


def pattern(length, seed=7, patches=None):
    return {'length': length, 'seed': seed, 'patches': patches or []}


def expand(description):
    if description is None:
        return None
    data = bytearray((i * 37 + description['seed']) & 255 for i in range(description['length']))
    for index, value in description['patches']:
        data[index] = value
    return bytes(data)


def vectors():
    game = '<Gamelist><Games/></Gamelist>'
    region = '<Regionlist><Regions/></Regionlist>'
    cases = [
        ('empty-containers', game, region, False),
        ('unknown-fields', '<Gamelist><Games><Unknown/></Games></Gamelist>', region, False),
        ('root-text', '<Gamelist>text<Games/>tail</Gamelist>', region, False),
        ('comment-and-pi', '<?xml version="1.0"?><!--x--><Gamelist><?q a?><Games/></Gamelist>', region, False),
        ('duplicates-are-presence', '<Gamelist><Games/><Games/></Gamelist>', region, False),
        ('preceding-unrelated-child', '<Gamelist><Other/><Games/></Gamelist>', region, False),
        ('unknown-region-entries', game, '<Regionlist><Regions><Unknown/></Regions></Regionlist>', False),
        ('lowercase-root', '<gamelist><Games/></gamelist>', region, False),
        ('wrong-child-case', '<Gamelist><games/></Gamelist>', region, False),
        ('nested-game-container', '<Gamelist><Wrap><Games/></Wrap></Gamelist>', region, False),
        ('missing-game-container', '<Gamelist/>', region, False),
        ('wrong-region-root', game, '<RegionList><Regions/></RegionList>', False),
        ('wrong-region-child', game, '<Regionlist><regions/></Regionlist>', False),
        ('nested-region-container', game, '<Regionlist><Wrap><Regions/></Wrap></Regionlist>', False),
        ('both-wrong', '<Wrong/>', '<Wrong/>', False),
        ('cdata-is-text', '<Gamelist><![CDATA[<Games/>]]></Gamelist>', region, False),
        ('decoded-name-entity', '<Gamelist name="x&amp;y"><Games/></Gamelist>', region, False),
        ('bare-ampersand-enabled', '<Gamelist a="x&y"><Games/></Gamelist>', region, True),
        ('bare-ampersand-disabled', '<Gamelist a="x&y"><Games/></Gamelist>', region, False),
        ('unknown-entity', '<Gamelist a="&missing;"><Games/></Gamelist>', region, False),
        ('truncated', '<Gamelist><Games/>', region, False),
        ('bad-numeric-character', '<Gamelist a="&#0;"><Games/></Gamelist>', region, False),
        ('text-outside-root', 'x' + game, region, False),
        ('wrong-closing-name', '<Gamelist><Games/></Wrong>', region, False),
    ]
    xml = []
    for name, games, regions, bare in cases:
        row = {'name': name, 'gameListText': games, 'regionListText': regions, 'allowBareAmpersands': bare}
        try:
            g = container(games, 'Gamelist', 'Games', bare)
            r = container(regions, 'Regionlist', 'Regions', bare)
            row['expected'] = {'gameList': g, 'regionList': r, 'containersPresent': g and r}
        except ET.ParseError:
            row['expectedError'] = True
        xml.append(row)

    comparisons = []
    def add(name, oldg, oldr, newg, newr):
        values = [expand(v) for v in (oldg, oldr, newg, newr)]
        status = lambda old, new: 'unavailable' if old is None else 'identical' if old == new else 'different'
        g, r = status(values[0], values[2]), status(values[1], values[3])
        comparisons.append({'name': name, 'input': dict(zip(
            ['currentGameListBytes', 'currentRegionListBytes', 'gameListBytes', 'regionListBytes'],
            [oldg, oldr, newg, newr])), 'expected': {'gameList': g, 'regionList': r,
                'requiresReplacement': g != 'identical' or r != 'identical'}})
    for length in [0, 1, 2, 3, 4, 5, 4095, 4096, 4097, 8192, 8193]:
        original = pattern(length)
        add('equal-' + str(length), original, pattern(3), original, pattern(3))
        if length:
            changed = pattern(length, patches=[[length - 1, ((length - 1) * 37 + 7 + 1) & 255]])
            add('last-byte-' + str(length), original, pattern(3), changed, pattern(3))
    add('first-byte', pattern(8193), pattern(0), pattern(8193, patches=[[0, 8]]), pattern(0))
    add('chunk-boundary-byte', pattern(8193), pattern(4), pattern(8193, patches=[[4096, 8]]), pattern(4))
    add('different-length', pattern(4096), pattern(0), pattern(4097), pattern(0))
    add('region-only', pattern(10), pattern(10), pattern(10), pattern(10, seed=8))
    add('both-different', pattern(10), pattern(10), pattern(10, seed=8), pattern(9))
    add('both-unavailable', None, None, pattern(2), pattern(3))
    add('game-unavailable', None, pattern(3), pattern(2), pattern(3))
    add('region-unavailable', pattern(2), None, pattern(2), pattern(3))
    return {'schema': 'moli.original-current-catalog-vectors.v1',
        'oracle': 'Python3 ElementTree direct-child exact tag matching and bytes equality; original synthetic inputs only',
        'xml': xml, 'comparisons': comparisons}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    value = vectors()
    with args.output.open('x', encoding='utf-8') as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    print(json.dumps({'xml': len(value['xml']), 'comparisons': len(value['comparisons'])}))
