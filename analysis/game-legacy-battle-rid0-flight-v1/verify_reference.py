"""Continue the archived same-slot fixture with the original rider pointer."""
from hashlib import sha256
from importlib.util import module_from_spec, spec_from_file_location
import json
from pathlib import Path
import sys


sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
ORIGINAL = HERE.parent / 'game-battle-attached-rid-v1'
spec = spec_from_file_location('rid219', ORIGINAL / 'generate_vectors.py')
rid = module_from_spec(spec)
spec.loader.exec_module(rid)


def descending_with(owner, node):
    handoff = owner.rid
    return owner.state == 221 and handoff and handoff['rider'] is node and handoff['lastReadSlots'] == handoff['slots']


class FlightBody(rid.Body):
    def update(self):
        rider = self.links.get('rider')
        if not rider or not descending_with(self, rider) or self.w.bodies.get(rider['anchor']) is self:
            return super().update()
        assert rider['state'] == 1 and 'attachment' not in self.links
        # The registry carries B while the saved parent continues to own the rider.
        rider['flags'] = ((rider['flags'] & 0xffea7ffd) | 0x820000 |
                          (self.actor_flags & 0x118000) | (self.actor_flags & 0x40002)) & 0xffffffff
        rider['mask'], rider['maskValue'] = self.mask, self.mask_value


class FlightWorld(rid.World):
    def step_effect(self, node):
        if node['kind'] == 'rider' and descending_with(node['owner'], node):
            if node['parent']['deleted']:
                node['deleted'] = True
            return
        super().step_effect(node)


def main():
    original = ORIGINAL / 'original-vectors.json'
    raw = original.read_bytes()
    archive = json.loads(raw)
    old = next(trace for trace in archive['traces'] if trace['case']['name'] == 'same-a-b')
    assert old['boundary'] == {'frame': 105, 'code': 'LEGACY_BATTLE_ATTACHED_RID_CHILD_REMOVED'}
    animations, records, files = rid.fixtures()
    assert files == archive['files']
    rid.Body = FlightBody
    world = FlightWorld(animations, records, old['case'])
    initial = world.project_casting()
    assert initial == old['initial']
    states, rasters, completed = [], [], []
    visible = {'body', 'status', 'rider', 'attachment', 'indicator', 'status-skill-overlay', 'status-skill-field'}
    for index in range(700):
        world.step()
        frame = world.project_casting()
        states.append(rid.digest(frame))
        assert not any(node['animation']['graphicIndex'] == 0 and not node['deleted'] and
                       not node['actorFlags'] & 2 for node in frame['nodes'])
        if index < 4 or index % 43 == 0 or any(h['complete'] and not was for h, was in zip(world.handoffs, completed)):
            for selector in (0, 1):
                rasters.append(dict(frame=index + 1, selector=selector, **rid.render_reference(world, selector)))
        completed = [h['complete'] for h in world.handoffs]
        settled = all(not body.busy for body in world.bodies.values())
        if world.stopped or settled and all(node['kind'] in visible for node in world.nodes):
            break
    prefix = 103
    assert states[:prefix] == old['states'][:prefix] and states[prefix] != old['states'][prefix]
    assert settled and completed == [True]
    trace = dict(case=old['case'], initial=initial, states=states, rasters=rasters, boundary=None,
                 final=world.project_casting(), settled=settled, preserved_original_prefix_states=prefix)
    result = dict(schema='moli.attached-rid-flight-reference.stage267.v1',
                  base_original=dict(path=str(original.relative_to(ROOT)), sha256=sha256(raw).hexdigest()),
                  source_sha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
                  traces=[trace])
    (HERE / 'reference.json').write_text(json.dumps(result, separators=(',', ':')) + '\n')
    print(json.dumps(dict(states=len(states), rasters=len(rasters), prefix=prefix, settled=settled)))


if __name__ == '__main__':
    main()
