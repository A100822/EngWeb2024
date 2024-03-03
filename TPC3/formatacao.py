import json

def read_json_file(file_path):
    data = []
    with open(file_path, "r") as f:
        for line in f:
            item = json.loads(line)
            data.append(item)
    return data

def format_movies(data):
    formatted_data = {"filmes": []}
    atores = {}
    atores_id = 1
    generos = {}
    generos_id = 1
    for item in data:
        formatted_item = {
            "id": item["_id"]["$oid"],
            "title": item["title"],
            "year": str(item["year"]), 
            "cast": [],
            "genres": []  
        }
        for actor in item.get("cast", []):
            if actor not in atores:
                atores[actor] = {
                    "id": f"a{atores_id}",
                    "nome": actor
                }
                atores_id += 1
            formatted_item["cast"].append(atores[actor]["id"])
        for genre in item.get("genres", []):
            if genre not in generos:
                generos[genre] = {
                    "id": f"g{generos_id}",
                    "designacao": genre
                }
                generos_id += 1
            formatted_item["genres"].append(generos[genre]["id"])
        formatted_data["filmes"].append(formatted_item)
    formatted_data["atores"] = list(atores.values())
    formatted_data["generos"] = list(generos.values())
    return formatted_data

data = read_json_file("filmes.json")
formatted_data = format_movies(data)

with open("dados_formatados.json", "w") as f:
    json.dump(formatted_data, f, indent=4)
