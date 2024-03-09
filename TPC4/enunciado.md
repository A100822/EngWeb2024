# Enunciado TPC4 


**Objetivo:** Criar uma servidor em python e interligar com HTML. Utilizar o w3.css. Utilisar o dataset de compositores musicais fornecido. 

-> Colocar o dataset no json-server;
-> Rotas importantes:
    - /compositores
    - /compositores/{id} (parametro que pode variar)
    - /compositores?periodo={periodo}
    - /periodos
    - /periodos/{id}


Implementar um serviço com as operações de CRUD sobre compositores e sobre períodos. 

**Etapas:** Criar um servidor que lê o dataset dos compositores. Devemos também criar um dicionario para os compositoes criando um id para cada um. Assim, devem ser fornecidos os dados do json server e devem ser criadas paginas html para os compositores e periodos. Cada ligação deve ser materializada num link que corresponde a uma nova chamada ao servidor. Ao selecionar um compositor ou um periodo deve ser possível visualizar os detalhes do mesmo. De seguida, deve ser possível editar ou apagar um elemento mas também criar um novo. 

**Resultados:** Conseguimos visualizar uma primeira página com a opção de consultar os compositores ou os periodos. Ao escolher uma das opção visualizamos uma lista com os diversos elementos existentes. Para além disso, temos a opção de consulta, de edição, remoção ou ainda de criação de um novo elemento (CRUD). 