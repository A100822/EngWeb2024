import json

def read_json_file(file_path):
    with open(file_path, "r") as f:
        item = json.load(f)
    return item

def format_data(data):
    formatted_data = {}
    periodos = {}
    p_id = 1
    for item in data['compositores']:
        periodo = item.get("periodo")
        if periodo is not None and periodo not in periodos:
            periodos[periodo] = {
                "id": f"P{p_id}",
                "nome": periodo
            }
            p_id += 1
        
    return list(periodos.values())

data = read_json_file("compositores.json")
data["periodos"] = format_data(data)

with open("dados.json", "w") as f:
    json.dump(data, f, indent=4)