import os
import xml.etree.ElementTree as ET

html = """
<!DOCTYPE html>
<html lang="en-US">
<head>
    <title> Mapa</title>
    <meta charset="utf-8">
    <style>
        img {
            max-width: 100%; 
            height: auto;
            display: block; 
            margin: 0 auto; 
        }
        .descricao, .titulo {
            width: 100%; 
            margin: 10px 0; 
        }
        .descricao {
            width: 100%; 
            margin: 10px 0; 
        }
    </style>
</head>
<body>
"""

template = """
<!DOCTYPE html>
<html lang="en-US">
<head>
    <title> Mapa</title>
    <meta charset="utf-8">
    <style>
        img {
            max-width: 100%; 
            height: auto;
            display: block; 
            margin: 0 auto; 
        }
        .descricao, .titulo {
            width: 100%; 
            margin: 10px 0; 
        }
        .descricao {
            width: 100%; 
            margin: 10px 0; 
        }
    </style>
</head>
<body>
"""

html += "<ul>"

listadeCidades = []
for filename in os.listdir("MapaRuas-materialBase/texto"):
    if filename.endswith(".xml"):
        tree = ET.parse(os.path.join("MapaRuas-materialBase/texto", filename))
        root = tree.getroot()
        descricao = ""

        rua_nome = root.find("./meta/nome").text
        listadeCidades.append(rua_nome)

        ficheiroCidade = open(f"html/{rua_nome}.html", "w")
        templateCidade = template
        templateCidade += f"<h1>{rua_nome}</h1>"
        
        # Descrição da rua
        for para_element in root.findall("./corpo/para"):
            texto_para = ET.tostring(para_element, encoding='unicode', method='text').strip()
            descricao += texto_para + " "

        templateCidade += f"<div class='descricao'><b>Descrição: </b>{descricao}</div>"

        # Imagens  
        for figura in root.findall("./corpo/figura"):
            img_path = figura.find("imagem").attrib["path"]
            legenda = figura.find("legenda").text
            templateCidade += f'<div style="margin-bottom: 10px;">'
            templateCidade += f'<img src="../MapaRuas-materialBase/imagem/{img_path}" alt="{legenda}" style="max-width: 50%;">'
            templateCidade += f'<p style="margin-top: 5px; text-align: center;">{legenda}</p>'
            templateCidade += '</div>'

        # Imagens atuais
        numero_rua = root.find("./meta/número").text
        images_atual_path = "MapaRuas-materialBase/atual"

        images_atual = [f for f in os.listdir(images_atual_path) if f.startswith(f"{numero_rua}-")]

        for i, img_name in enumerate(images_atual, start=1):
            legenda_atual = f"Imagem atual da rua: {rua_nome}"
            templateCidade += f'<div style="margin-bottom: 10px;">'
            templateCidade += f'<img src="../{images_atual_path}/{img_name}" alt="{legenda_atual}" style="max-width: 50%;">'
            templateCidade += f'<p style="margin-top: 5px; text-align: center;">{legenda_atual}</p>'
            templateCidade += '</div>'


        # Lista de casas
        templateCidade += f"<div class='descricao'><b class='titulo'>Lista de Casas: </b></div>"
        templateCidade += "<ul>"
        for casa in root.findall("./corpo/lista-casas/casa"):
            numero_casa = casa.find("número").text
    
            enfiteuta_element = casa.find("enfiteuta")
            enfiteuta = enfiteuta_element.text if enfiteuta_element is not None else "N/A"

            foro_element = casa.find("foro")
            foro = foro_element.text if foro_element is not None else "N/A"
    
            templateCidade += f"<li>Casa {numero_casa}: Enfiteuta - {enfiteuta}, Foro - {foro}</li>"

        templateCidade += "</ul>"
        

        templateCidade += "</body>"
        templateCidade += '<h6><a href="../mapa_sorted_link.html">Voltar </h6>'
        ficheiroCidade.write(templateCidade)
        ficheiroCidade.close()

html += "</ul>"

for elem in sorted(listadeCidades):
    html += f'<li><a href="html/{elem}.html">{elem}</a></li>'

html += "</ul>"
html += "</body>"

ficheiroHtml = open("mapa_sorted_link.html", "w", encoding="utf-8")
ficheiroHtml.write(html)
ficheiroHtml.close()