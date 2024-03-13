var express = require('express');
var router = express.Router();
var axios = require("axios");

/*Periodos*/

router.get('/', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/periodos?_sort=nome')
        .then(resp => {
        var periodos = resp.data
        res.status(200).render("periodosListPage", {"lPeriodos" : periodos, "date" : d})
        })
    .catch(erro => {
        res.status(501).render("error", {"error" : erro})
    })
});

router.get('/registo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    res.status(200).render("periodosFormPage", {"date" : d})
});

router.post('/registo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    var result = req.body
    axios.post("http://localhost:3000/periodos", result)
    .then(resp => {
        console.log(resp.data)
        res.status(201).redirect('/periodos')
    })
    .catch(erro => {
        res.status(502).render("error", {"error" : erro})
    })
});

router.get('/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/periodos/' + req.params.idPeriodo)
        .then(resp => {
        var periodo = resp.data
        res.status(200).render("periodosPage", {"periodo" : periodo, "date" : d})
        })
        .catch(erro => {
        res.status(503).render("error", {"error" : erro})
        })
});

router.get('/edit/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/periodos/' + req.params.idPeriodo)
    .then(resp => {
        var periodo = resp.data
        res.status(200).render("periodosFormEditPage", {"periodo" : periodo, "date" : d})
    })
    .catch(erro => {
        res.status(504).render("error", {"error" : erro})
    })
});

router.get('/delete/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/periodos/' + req.params.idPeriodo)
    .then(resp => {
        var periodo = resp.data
        res.status(200).render("periodosFormDeletePage", {"periodo" : periodo, "date" : d})
    })
    .catch(erro => {
        res.status(505).render("error", {"error" : erro})
    })
});

router.post('/edit/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    var periodo = req.body
    console.log(req.params.idPeriodo)
    axios.put('http://localhost:3000/periodos/' + req.params.idPeriodo, periodo)
    .then(resp => {
        res.status(201).redirect('/periodos')
    })
    .catch(erro => {
        res.status(506).render("error", {"error" : erro})
    })
});

router.post('/delete/:idPeriodo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16);
    var idPeriodo = req.params.idPeriodo;
    axios.delete('http://localhost:3000/periodos/' + idPeriodo)
    .then(resp => {
        res.status(201).redirect('/periodos')
    })
    .catch(erro => {
        res.status(500).render("error", {"error" : erro}); 
    });
});

module.exports = router;