const http = require('http');
const fs = require('fs');
const url = require('url');
const axios = require('axios');

// Obter filmes por gênero
const obterFilmesPorGenero = (genero) => {
    return axios.get("http://localhost:3000/filmes")
        .then(dados => {
            const filmesDoGenero = dados.data.filter(filme => filme.genres.includes(genero));
            return filmesDoGenero;
        })
        .catch(erro => {
            throw new Error("Erro ao obter os filmes por gênero: " + erro);
        });
};

// Obter filmes por elenco
const obterFilmesPorElenco = (ator) => {
    return axios.get("http://localhost:3000/filmes")
        .then(dados => {
            const filmesDoElenco = dados.data.filter(filme => filme.cast.includes(ator));
            return filmesDoElenco;
        })
        .catch(erro => {
            throw new Error("Erro ao obter os filmes por elenco: " + erro);
        });
};

http.createServer((req, res) => {
    console.log(req.method + " " + req.url);

    var q = url.parse(req.url, true);

    if (q.pathname === "/") {
        // Página inicial com opções
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
        res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
        res.write("<h1>Escolha uma opção:</h1>");
        res.write("<ul>");
        res.write("<li><a href='/filmes'>Filmes</a></li>");
        res.write("<li><a href='/generos'>Gêneros</a></li>");
        res.write("<li><a href='/atores'>Atores</a></li>");
        res.write("</ul>");
        res.end();
    }  else if (q.pathname === "/generos") {
        // Lista de gêneros
        axios.get("http://localhost:3000/generos")
                .then(dados => {
                    const generos = dados.data.sort((a, b) => a.designacao.localeCompare(b.designacao));
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
                    res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
                    res.write("<h1>Todos os Gêneros</h1>");
                    res.write("<ul>");
                    generos.forEach(genero => {
                        res.write("<li><a href='/generos/" + genero.id + "'>" + genero.designacao + "</a></li>");
                    });
                    res.write("</ul>");
                    res.end();
                })
                .catch(erro => {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.write("Erro ao obter os generos: " + erro);
                    res.end();
                });
    } else if (q.pathname === "/atores") {
        // Lista de atores
        axios.get("http://localhost:3000/atores")
        .then(dados => {
            const atores = dados.data.sort((a, b) => a.id.localeCompare(b.id));
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
            res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
            res.write("<h1>Todos os atores</h1>");
            res.write("<ul>");
            atores.forEach(ator => {
                res.write("<li><a href='/atores/" + ator.id + "'>" + ator.nome + "</a></li>");
            });
            res.write("</ul>");
            res.end();
        })
        .catch(erro => {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("Erro ao obter os atores: " + erro);
            res.end();
        });
    } else if (q.pathname == "/filmes") {
        if (q.query.genre) {
            obterFilmesPorGenero(q.query.genre)
                .then(filmes => {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
                    res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
                    res.write("<h1>Filmes do Gênero: " + q.query.genre + "</h1>");
                    res.write("<ul>");
                    filmes.forEach(filme => {
                        res.write("<li><a href='/filmes/" + filme.id + "'>" + filme.title + "</a></li>");
                    });
                    res.write("</ul>");
                    res.write("<h6><a href='/filmes'>Voltar</a></h6>");
                    res.end();
                })
                .catch(erro => {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.write(erro.message);
                    res.end();
                });
        } else if (q.query.cast) {
            obterFilmesPorElenco(q.query.cast)
                .then(filmes => {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
                    res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
                    res.write("<h1>Filmes com o Ator/Atriz: " + q.query.cast + "</h1>");
                    res.write("<ul>");
                    filmes.forEach(filme => {
                        res.write("<li><a href='/filmes/" + filme.id + "'>" + filme.title + "</a></li>");
                    });
                    res.write("</ul>");
                    res.write("<h6><a href='/filmes'>Voltar</a></h6>");
                    res.end();
                })
                .catch(erro => {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.write(erro.message);
                    res.end();
                });
        } else {
            axios.get("http://localhost:3000/filmes")
                .then(dados => {
                    const filmes = dados.data.sort((a, b) => a.title.localeCompare(b.title));
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
                    res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
                    res.write("<h1>Todos os Filmes</h1>");
                    res.write("<ul>");
                    filmes.forEach(filme => {
                        res.write("<li><a href='/filmes/" + filme.id + "'>" + filme.title + "</a></li>");
                    });
                    res.write("</ul>");
                    res.end();
                })
                .catch(erro => {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.write("Erro ao obter os filmes: " + erro);
                    res.end();
                });
        }
    } else if (q.pathname.match(/\/filmes\/\w+/)) {
        let id = q.pathname.substring(8);
        axios.get("http://localhost:3000/filmes?id=" + id)
            .then(dados => {
                const filme = dados.data[0];
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
                res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
                res.write("<h1>" + filme.title + "</h1>");
                res.write("<p>Ano: " + filme.year + "</p>");

                res.write("<p>Elenco: ");
                Promise.all(filme.cast.map(atorId => {
                return axios.get("http://localhost:3000/atores?id=" + atorId)
                .then(resposta => {
                    const atorNome = resposta.data[0].nome;
                    res.write("<a href='/atores/" + atorId + "'>" + atorNome + "</a> ");
                });
                }))
                .then(() => {
                    res.write("</p>");
                    res.write("<p>Gêneros: ");
                    if (filme.genres && filme.genres.length > 0) {
                        Promise.all(filme.genres.map(generoID => {
                            return axios.get("http://localhost:3000/generos?id=" + generoID)
                            .then(resposta => {
                                const generoNome = resposta.data[0].designacao;
                                res.write("<a href='/generos/" + generoID + "'>" + generoNome + "</a> ");
                            });
                        }))
                        .then(() => {
                            res.write("</p>");
                            res.write("<h6><a href='/filmes'>Voltar</a></h6>");
                            res.end();
                        })
                        .catch(erro => {
                            console.log(erro);
                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.write("Erro ao obter os gêneros: " + erro);
                            res.end();
                        });
                    } else {
                        res.write("Nenhum gênero disponível</p>");
                        res.write("<h6><a href='/filmes'>Voltar</a></h6>");
                        res.end();
                    }           
                })
            })
            .catch(erro => {
                console.log(erro)
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write("Erro ao obter o filme: " + erro);
                res.end();
            });
    } else if (q.pathname.match(/\/atores\/\w+/)) {
            let id = q.pathname.substring(8);
            axios.get("http://localhost:3000/atores?id=" + id)
                .then(dados => {
                    const ator = dados.data[0];
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
                    res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
                    res.write("<h1>" + ator.nome + "</h1>");
                    res.write("<p>ID: " + ator.id + "</p>");
                    res.write("<h6><a href='/atores'>Voltar</a></h6>");
                    res.end();
                })
                .catch(erro => {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.write("Erro ao obter o filme: " + erro);
                    res.end();
                });
    } else if (q.pathname.match(/\/generos\/\w+/)) {
        let id = q.pathname.substring(9);
        axios.get("http://localhost:3000/generos?id=" + id)
            .then(dados => {
                const genero = dados.data[0];
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>");
                res.write("<header class='w3-container w3-teal'><h1>Índice</h1></header>");
                res.write("<h1>" + genero.designacao + "</h1>");
                res.write("<p>ID: " + genero.id + "</p>");
                res.write("<h6><a href='/generos'>Voltar</a></h6>");
                res.end();
            })
            .catch(erro => {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write("Erro ao obter o filme: " + erro);
                res.end();
            });
    }else if (q.pathname == "/w3.css") {
        fs.readFile('w3.css', (erro, dados) => {
            if (erro) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write("Erro ao ler o arquivo CSS: " + erro);
                res.end();
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(dados);
            res.end();
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write("Página não encontrada");
        res.end();
    }

}).listen(2702);

console.log("Servidor escutando na porta 2702...");
