#!/usr/bin/env python3
"""Independent integer and material-table reference, written from the recorded x86 equations."""
import json
from pathlib import Path

def signed32(value):
    value &= 0xffffffff
    return value if value < 0x80000000 else value - 0x100000000

def trunc_div(value, denominator):
    return (abs(value) // denominator) * (-1 if value < 0 else 1)

costs = [(125, 8), (99, 7), (-125, 8), (125, -8), (2147483647, 2),
         (-2147483648, -1), (65537, 65537), (0, 2147483647)]
times = [0, 1, -1, -2, -3, 2147483647, -2147483648, 715827883]
cases = []
for i, ((multiplier, cost), word) in enumerate(zip(costs, times)):
    duration = signed32(signed32(41 % 6 + 5 + signed32(word * 3)) * 1000)
    now = 0xffffff00 if i % 2 else 1000
    deadline = (now + duration) & 0xffffffff
    cases.append(dict(multiplier=multiplier, recipeCost=cost, recipeTime=word,
                      cost=trunc_div(signed32(multiplier * cost), 100), now=now,
                      durationMilliseconds=duration, seconds=trunc_div(duration, 1000),
                      deadline=deadline, dueAtStart=now >= deadline))

# A separate six-cell table establishes association order independently of UI placement.
positions = [None] * 6
materials = [(100, 2), (200, 1), (-1, 0), (-1, 0), (-1, 0)]
fulfilled = [identifier < 0 for identifier, _ in materials]
steps = []
for target, bag, identifier, count, category in [(4,8,100,3,10),(1,9,200,0,10),(0,10,900,0,38)]:
    available = 1 if count == 0 else count
    group = next((i for i,(code,required) in enumerate(materials)
                  if not fulfilled[i] and code == identifier and required <= available), -1)
    assert group >= 0 or category in (25,38,39)
    if group >= 0:
        fulfilled[group] = True
    positions[target] = dict(slot=bag,group=group)
    steps.append(dict(position=target,slot=bag,expectedGroups=[None if p is None else p['group'] for p in positions],fulfilled=list(fulfilled)))
ordered = [p['slot'] for p in positions if p and p['group'] >= 0] + [p['slot'] for p in positions if p and p['group'] < 0]
data = dict(stage=303,origin='original independent Python arithmetic and material reference',
            numericCases=cases,materialSteps=steps,submission='|'.join(map(str,[700]+ordered)),
            poses=[dict(identifier=i,pose=p) for i,p in [(215,10),(216,9),(217,12),(218,12),(219,11),(220,9)]])
path = Path(__file__).with_name('original-vectors.json')
path.write_text(json.dumps(data,indent=2)+'\n')
print(json.dumps(dict(numeric_cases=len(cases),material_steps=len(steps),poses=len(data['poses']))))
