var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')          
var static = require('./static.js')           

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}


var compositoresServer = http.createServer((req, res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                
                if(req.url == '/') {
                // Página inicial com opções
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                    res.write(templates.inicio(d))
                    res.end();
                }
                
                // GET /compositores --------------------------------------------------------------------
                else if  (req.url == '/compositores') {
                    axios.get('http://localhost:3000/compositores?_sort=nome')
                    .then(resp => {
                        var compositores = resp.data
                        res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"})
                        res.write(templates.compositoreslistPage(compositores, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {"Content-Type" : "text/html; charset=utf8"})
                        res.write("<p>Não foi possível obter a lista de compositores" + req.method + "</p>")
                        res.write("<p>" + erro + "</p>")
                        res.end()
                    })
                }

                // GET /compositores/:id --------------------------------------------------------------------
                else if (/\/compositores\/(C)[0-9]+$/i.test(req.url)) {
                    var partes = req.url.split('/')
                    compoId = partes[partes.length - 1] 
                    axios.get('http://localhost:3000/compositores/' + compoId)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        console.log("Dados do compositor:", resposta.data);
                        res.end(templates.compositoresConsultPage(resposta.data,d))
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                } 
                
                // GET /compositores/registo --------------------------------------------------------------------
                else if (req.url == '/compositores/registo') {
                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"})
                    res.write(templates.compositoresFormPage(d))
                    res.end
                }

                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)) {
                    var partes = req.url.split('/')
                    compoId = partes[partes.length - 1] 
                    axios.get('http://localhost:3000/compositores/' + compoId)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        console.log("Dados do compositor:", resposta.data);
                        res.end(templates.compositoresFormEditPage(resposta.data,d))
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                } 

                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if (/\/compositores\/delete\/(C)[0-9]+$/i.test(req.url)) {
                    var partes = req.url.split('/')
                    compoId = partes[partes.length - 1] 
                    axios.get('http://localhost:3000/compositores/' + compoId)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        console.log("Dados do compositor:", resposta.data);
                        res.end(templates.compositoresDeletePage(resposta.data, d))
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                }

                //PERIODOS

                // GET /periodos --------------------------------------------------------------------
                else if (req.url == '/periodos')  {
                    axios.get('http://localhost:3000/periodos?_sort=nome')
                    .then(resp => {
                        console.log("cona")
                        var periodos = resp.data
                        res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"})
                        res.write(templates.periodoslistPage(periodos, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {"Content-Type" : "text/html; charset=utf8"})
                        res.write("<p>Não foi possível obter a lista de periodos" + req.method + "</p>")
                        res.write("<p>" + erro + "</p>")
                        res.end()
                    })
                }

                // GET /periodos/:id --------------------------------------------------------------------
                else if (/\/periodos\/(P)[0-9]+$/i.test(req.url)) {
                    var partes = req.url.split('/')
                    compoId = partes[partes.length - 1] 
                    axios.get('http://localhost:3000/compositores/' + compoId)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        console.log("Dados do compositor:", resposta.data);
                        res.end(templates.periodosConsultPage(resposta.data,d))
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                } 
                
                // GET /periodos/registo --------------------------------------------------------------------
                else if (req.url == '/periodos/registo') {
                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"})
                    res.write(templates.periodoFormPage(d))
                    res.end
                }

                // GET /periodos/edit/:id --------------------------------------------------------------------
                else if (/\/periodos\/edit\/(P)[0-9]+$/i.test(req.url)) {
                    var partes = req.url.split('/')
                    compoId = partes[partes.length - 1] 
                    axios.get('http://localhost:3000/periodos/' + compoId)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        console.log("Dados do periodo:", resposta.data);
                        res.end(templates.periodoFormEditPage(resposta.data,d))
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                } 

                // GET /periodos/delete/:id --------------------------------------------------------------------
                else if (/\/periodos\/delete\/(P)[0-9]+$/i.test(req.url)) {
                    var partes = req.url.split('/')
                    compoId = partes[partes.length - 1] 
                    axios.get('http://localhost:3000/periodos/' + compoId)
                    .then(resposta => {
                        res.writeHead(200, {'Content-Type': "text/html"})
                        console.log("Dados do periodo:", resposta.data);
                        res.end(templates.periodoDeletePage(resposta.data, d))
                    })
                    .catch( erro => {
                        res.writeHead(521, {'Content-Type': "text/html"})
                        res.end(templates.errorPage(erro, d))
                    })
                }

                // GET ? -> Lancar um erro
                else {
                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"})
                    res.write("<p>Método GET não sopurtado: " + req.method + "</p>")
                    res.write("<p><a href='/'>Return</a></p>")
                    res.end()
                }
                break
            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if (req.url == '/compositores/registo') {
                    collectRequestBodyData(req, result => {
                        if (result) {
                            axios.post("http://localhost:3000/compositores", result)
                            .then(resp => {
                                res.writeHead(201, {"Content-Type" : "text/html; charset=utf8"})
                                res.end("Registo inserido: " + JSON.stringify(resp.data) + "</p>")
                            })
                            .catch(erro => {
                                res.writeHead(503, {"Content-Type" : "text/html; charset=utf8"})
                                res.write("<p>Não foi possível inserir o registo</p>")
                                res.end("<p>" + erro + "</p>") 
                            })
                        } else {
                            res.writeHead(502, {"Content-Type" : "text/html; charset=utf8"})
                            res.write("<p>Não foi possível obter os dados do body" + req.method + "</p>")
                            res.end()
                        }
                    })
                }

                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if (/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if (result) {
                            const match = req.url.match(/\/compositores\/edit\/(C[0-9]+)$/i);
                            if (match) {
                                const compoId = match[1]; 
                                axios.put("http://localhost:3000/compositores/" + compoId, result)

                                .then(resp => {
                                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"});
                                    res.write("<h6><a href='/compositores'>Voltar</a></h6>");
                                    res.end("Compositor editado: " + JSON.stringify(resp.data) + "</p>");
                                })
                                .catch(erro => {
                                    res.writeHead(507, {"Content-Type" : "text/html; charset=utf8"});
                                    res.write("<p>Não foi possível editar o compositor</p>");
                                    res.end("<p>" + erro + "</p>");
                                });
                            } else {
                                res.writeHead(507, {"Content-Type" : "text/html; charset=utf8"});
                                res.write("<p>Não foi possível extrair o ID do compositor da URL</p>");
                                res.end();
                            }
                        } else {
                            res.writeHead(506, {"Content-Type" : "text/html; charset=utf8"});
                            res.write("<p>Não foi possível obter os dados do corpo da requisição</p>");
                            res.end();
                        }
                    });
                }

                // POST /compositores/delete/:id --------------------------------------------------------------------
                else if (/\/compositores\/delete\/(C[0-9]+)\?_method=DELETE$/i.test(req.url)) {
                    collectRequestBodyData(req, result => {
                        if (result) {
                            const match = req.url.match(/\/compositores\/delete\/(C[0-9]+)\?_method=DELETE$/i);
                            if (match) {
                                const compoId = match[1]; 
                                axios.delete("http://localhost:3000/compositores/" + compoId)
                                .then(resp => {
                                    console.log(resp.data);
                                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"});
                                    res.write("<h6><a href='/compositores'>Voltar</a></h6>");
                                    res.end("Compositor excluído: " + JSON.stringify(resp.data) + "</p>");
                                })
                                .catch(erro => {
                                    res.writeHead(507, {"Content-Type" : "text/html; charset=utf8"});
                                    res.write("<p>Não foi possível excluir o compositor</p>");
                                    res.end("<p>" + erro + "</p>");
                                });
                            } else {
                                res.writeHead(507, {"Content-Type" : "text/html; charset=utf8"});
                                res.write("<p>Não foi possível extrair o ID do compositor da URL</p>");
                                res.end();
                            }
                        } else {
                            res.writeHead(506, {"Content-Type" : "text/html; charset=utf8"});
                            res.write("<p>Não foi possível obter os dados do corpo da requisição</p>");
                            res.end();
                        }
                    });
                }

                //PERIODOS

                else if (req.url == '/periodos/registo') {
                    collectRequestBodyData(req, result => {
                        if (result) {
                            axios.post("http://localhost:3000/periodos", result)
                            .then(resp => {
                                res.writeHead(201, {"Content-Type" : "text/html; charset=utf8"})
                                res.end("Registo inserido: " + JSON.stringify(resp.data) + "</p>")
                            })
                            .catch(erro => {
                                res.writeHead(503, {"Content-Type" : "text/html; charset=utf8"})
                                res.write("<p>Não foi possível inserir o registo</p>")
                                res.end("<p>" + erro + "</p>")
                                res.end()
                            })
                        } else {
                            res.writeHead(502, {"Content-Type" : "text/html; charset=utf8"})
                            res.write("<p>Não foi possível obter os dados do body" + req.method + "</p>")
                            res.end()
                        }
                    })
                }

                // POST /periodos/edit/:id --------------------------------------------------------------------
                else if (/\/periodos\/edit\/(P)[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if (result) {
                            const match = req.url.match(/\/periodos\/edit\/(P[0-9]+)$/i);
                            if (match) {
                                const compoId = match[1]; 
                                axios.put("http://localhost:3000/periodos/" + compoId, result)

                                .then(resp => {
                                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"});
                                    res.write("<h6><a href='/periodos'>Voltar</a></h6>");
                                    res.end("periodo editado: " + JSON.stringify(resp.data) + "</p>");
                                })
                                .catch(erro => {
                                    res.writeHead(507, {"Content-Type" : "text/html; charset=utf8"});
                                    res.write("<p>Não foi possível editar o periodos</p>");
                                    res.end("<p>" + erro + "</p>");
                                });
                            } else {
                                res.writeHead(507, {"Content-Type" : "text/html; charset=utf8"});
                                res.write("<p>Não foi possível extrair o ID do periodos da URL</p>");
                                res.end();
                            }
                        } else {
                            res.writeHead(506, {"Content-Type" : "text/html; charset=utf8"});
                            res.write("<p>Não foi possível obter os dados do corpo da requisição</p>");
                            res.end();
                        }
                    });
                }

                // POST /periodos/delete/:id --------------------------------------------------------------------
                else if (/\/periodos\/delete\/(P[0-9]+)\?_method=DELETE$/i.test(req.url)) {
                    collectRequestBodyData(req, result => {
                        if (result) {
                            const match = req.url.match(/\/periodos\/delete\/(P[0-9]+)\?_method=DELETE$/i);
                            if (match) {
                                const compoId = match[1]; 
                                axios.delete("http://localhost:3000/periodos/" + compoId)
                                .then(resp => {
                                    console.log(resp.data);
                                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"});
                                    res.write("<h6><a href='/periodos'>Voltar</a></h6>");
                                    res.end("Compositor excluído: " + JSON.stringify(resp.data) + "</p>");
                                })
                                .catch(erro => {
                                    res.writeHead(507, {"Content-Type" : "text/html; charset=utf8"});
                                    res.write("<p>Não foi possível excluir o periodo</p>");
                                    res.end("<p>" + erro + "</p>");
                                });
                            } else {
                                res.writeHead(507, {"Content-Type" : "text/html; charset=utf8"});
                                res.write("<p>Não foi possível extrair o ID do periodo da URL</p>");
                                res.end();
                            }
                        } else {
                            res.writeHead(506, {"Content-Type" : "text/html; charset=utf8"});
                            res.write("<p>Não foi possível obter os dados do corpo da requisição</p>");
                            res.end();
                        }
                    });
                }
            

                // POST ? -> Lancar um erro
                else {
                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"})
                    res.write("<p>Método POST não sopurtado: " + req.method + "</p>")
                    res.write("<p><a href='/'>Return</a></p>")
                    res.end()
                }
                break
                
            default: 
                // Outros metodos nao sao suportados
                res.writeHead(200, {"Content-Type" : "text/html; charset=utf8"})
                res.write("<p>Método não sopurtado: " + req.method + "</p>")
                res.end()
                break
        }
    }
})

compositoresServer.listen(3040, ()=>{
    console.log("Servidor à escuta na porta 3040...")
})



