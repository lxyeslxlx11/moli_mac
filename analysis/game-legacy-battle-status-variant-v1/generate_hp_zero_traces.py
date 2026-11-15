"""Re-evaluate historical SKL86 using the verified action 43 write and random draw."""
from hashlib import sha256
import importlib.util
import json
from pathlib import Path
import sys


HERE = Path(__file__).resolve().parent
OLD = HERE.parent / 'game-battle-status-skills-v1'
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('status_skill_reference', OLD / 'generate_vectors.py')
model = importlib.util.module_from_spec(spec)
spec.loader.exec_module(model)


class CorrectedBody(model.Body):
    def body_step(self):
        if self.state == 43:
            self.w.random.next()
            self.vitals[0] = 0
            self.pop()
            return
        super().body_step()


def main():
    model.Body = CorrectedBody
    original = (OLD / 'original-vectors.json').read_bytes()
    animations, records, _ = model.fixtures()
    overrides = []
    persistent = {'body', 'rider', 'attachment', 'status', 'status-skill-overlay', 'status-skill-field'}
    for row in json.loads(original)['traces']:
        case = row['case']
        if case['category'] != 86:
            continue
        world = model.World(animations, records, case)
        states, rasters = [], []
        for index in range(1300):
            frame = world.step()
            states.append(model.digest(frame))
            if index < 7 or index % 31 == 0 or case.get('resource') == 100070 and index < 90:
                for selector in (0, 1):
                    rasters.append(dict(frame=index+1, selector=selector, **model.prior.render_reference(world, selector)))
            settled = all(body.detached or not body.busy for body in world.bodies.values())
            if settled and all(node['kind'] in persistent for node in world.nodes):
                break
        corrected = dict(case=case, states=states, rasters=rasters, settled=settled, final=frame)
        if corrected != row:
            overrides.append(corrected)
    assert len(overrides) == 13
    out = dict(original_sha256=sha256(original).hexdigest(), action=43, traces=overrides)
    (HERE / 'hp-zero-traces.json').write_text(json.dumps(out, separators=(',', ':')) + '\n')
    print('Re-evaluated', len(overrides), 'independent historical traces')


if __name__ == '__main__':
    main()
