import json

json_file = 'visualizer/data/test.json'

new_data = {}

ans2idx = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
mod2MOD = {'audio': 'Audio', 'video': 'Video', 'pc': '3D', 'image': 'Image'}
qtype2question_type = {"mc_2": "MC2", "mc_3": "MC3", "mc_4": "MC4"}
with open(json_file, 'r') as f:
    data = json.load(f)
    for d in data:
        new_data[d['id']] = d
        new_data['pid'] = d['id']
        new_data[d['id']]['answer_type'] = mod2MOD[d['modalities'][ans2idx[d['answer']]]]
        new_data[d['id']]['selection_type'] = 'High Similarity' if d['selection_type']!='random' else 'Random'
        new_data[d['id']]['question_type'] = qtype2question_type[d['q_type']]
        for i in range(len(d['modalities'])):
            new_data[d['id']]['examples'][i]['modality'] =d['modalities'][i]
        

open('visualizer/data/data_public.js', 'w').write('test_data = ' + json.dumps(new_data, indent=4) + ';')