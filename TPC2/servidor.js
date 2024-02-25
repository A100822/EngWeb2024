var http = require('http');
var meta = require('./aux');
var url = require('url');
var axios = require('axios')

http.createServer((req, res) => {
    console.log(req.method + " " + req.url + " " + meta.myDateTime());

    var q = url.parse(req.url, true);
    
    if(q.pathname == "/"){
        // Página inicial com opções
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
        res.write("<h2>Escolha uma opção:</h2>");
        res.write("<ul>");
        res.write("<li><a href='/alunos'>Alunos</a></li>");
        res.write("<li><a href='/cursos'>Cursos</a></li>");
        res.write("<li><a href='/instrumentos'>Instrumentos</a></li>");
        res.write("</ul>");
        res.end();
    } else if (q.pathname === "/alunos") {
        // Lista de alunos da escola de música
        axios.get("http://localhost:3000/alunos")
        .then((resp) => {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            let lista = resp.data;
            res.write("<h2>Lista de Alunos</h2>");
            res.write("<ul>");
            for (let aluno of lista) {
                res.write("<li><a href='/alunos/" + encodeURIComponent(aluno.nome) + "'>" + aluno.nome + "</a></li>");
            }
            res.write("</ul>");
            res.write("<a href='/'>Voltar atrás</a>");
            res.end();
        }).catch(erro => {
            console.log("Erro: " + erro);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("Erro interno do servidor");
            res.end();
        });
    }else if (q.pathname.startsWith("/alunos/")) {
        // Informações de um aluno em específico
        var alunoNome = decodeURIComponent(q.pathname.substring(8)); 
        axios.get("http://localhost:3000/alunos?nome=" + alunoNome)
        .then((resp) => {
            let aluno = resp.data[0];
            if (aluno) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                res.write("<h2>Informações do Aluno</h2>");
                res.write("<p><strong>Nome:</strong> " + aluno.nome + "</p>");
                res.write("<p><strong>ID:</strong> " + aluno.id + "</p>");
                res.write("<p><strong>Data de Nascimento:</strong> " + aluno.dataNasc + "</p>");
                res.write("<p><strong>Curso:</strong> " + aluno.curso + "</p>");
                res.write("<p><strong>Ano do Curso:</strong> " + aluno.anoCurso + "</p>");
                res.write("<p><strong>Instrumento:</strong> " + aluno.instrumento + "</p>");
                res.write("<a href='/alunos'>Voltar à lista de alunos</a>");
                res.end();
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Aluno não encontrado");
                res.end();
            }
        }).catch(erro => {
            console.log("Erro: " + erro);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("Erro interno do servidor");
            res.end();
        });    
    } 
    else if (q.pathname === "/cursos") {
        // Lista de cursos existentes
        axios.get("http://localhost:3000/cursos")
        .then((resp) => {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            let cursos = resp.data;
            res.write("<h2>Lista de Cursos</h2>");
            res.write("<ul>");
            let cursosSemRepetidos = new Set();
            for (let curso of cursos) {
                cursosSemRepetidos.add(curso.designacao);
            }
            cursosSemRepetidos.forEach((curso) => {
                res.write("<li><a href='/cursos/" + encodeURIComponent(curso) + "'>" + curso + "</a></li>");
            });            
            res.write("</ul>");
            res.write("<a href='/'>Voltar atrás</a>");
            res.end();
        }).catch(erro => {
            console.log("Erro: " + erro);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("Erro interno do servidor");
            res.end();
        });
    }else if (q.pathname.startsWith("/cursos/")) {
        // Detalhes do curso
        const cursoNome = decodeURIComponent(q.pathname.substring(8));
        axios.get("http://localhost:3000/cursos?designacao=" + cursoNome)    
        .then((resp) => {
            const curso = resp.data[0];
            if (curso) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                res.write("<h2>Detalhes do Curso</h2>");
                res.write("<p><strong>Designação:</strong> " + curso.designacao + "</p>");
                res.write("<p><strong>Duração:</strong> " + curso.duracao + " meses</p>");
                res.write("<p><strong>Instrumento:</strong> " + curso.instrumento['#text'] + "</p>");
                res.write("<a href='/cursos'>Voltar à lista de cursos</a>");
                res.end();
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Curso não encontrado");
                res.end();
            }
        }).catch((erro) => {
            console.log("Erro: " + erro);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("Erro interno do servidor");
            res.end();
        });
    }else if (q.pathname === "/instrumentos") {
        // Lista de instrumentos existentes 
        axios.get("http://localhost:3000/instrumentos")
        .then((resp) => {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            let instrumentos = resp.data;
            res.write("<h2>Lista de Instrumentos</h2>");
            res.write("<ul>");
            let instrumentosSemRepetidos = new Set();
            for (let instrumento of instrumentos) {
                instrumentosSemRepetidos.add(instrumento['#text']);
            }
            instrumentosSemRepetidos.forEach((instrumento) => {
                res.write("<li><a href='/instrumentos/" + encodeURIComponent(instrumento) + "'>" + instrumento + "</a></li>");
            });            
            res.write("</ul>");
            res.write("<a href='/'>Voltar atrás</a>");
            res.end();
        }).catch(erro => {
            console.log("Erro: " + erro);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("Erro interno do servidor");
            res.end();
        });
    }else if (q.pathname.startsWith("/instrumentos/")) {
        // Detalhes do instrumento
        const instrumentoNome = decodeURIComponent(q.pathname.substring(14));
        axios.get("http://localhost:3000/instrumentos?#text=" + instrumentoNome)    
        .then((resp) => {
            const instrumento = resp.data[0];
            if (instrumento) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                res.write("<h2>Detalhes do Instrumento</h2>");
                res.write("<p><strong>Id:</strong> " + instrumento['id'] + "</p>");
                res.write("<p><strong>Nome:</strong> " + instrumento['#text'] + "</p>");
                res.write("<a href='/instrumentos'>Voltar à lista de instrumentos</a>");
                res.end();
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Instrumento não encontrado");
                res.end();
            }
        }).catch((erro) => {
            console.log("Erro: " + erro);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("Erro interno do servidor");
            res.end();
        });
    }else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write("Rota não encontrada");
        res.end();
    }

}).listen(2102);

console.log("Servidor à escuta na porta 2102...");
