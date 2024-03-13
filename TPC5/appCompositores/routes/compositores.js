var express = require('express');
var router = express.Router();
var axios = require("axios");

/* GET compositores listing. */

router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores?_sort=nome')
    .then(resp => {
      var compositores = resp.data
      res.status(200).render("compositoresListPage", {"lCompositores" : compositores, "date" : d})
    })
    .catch(erro => {
      res.status(501).render("error", {"error" : erro})
    })
});

router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.status(200).render("compositoresFormPage", {"date" : d})
});

router.post('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var result = req.body
  axios.post("http://localhost:3000/compositores", result)
    .then(resp => {
      console.log(resp.data)
      res.status(201).redirect('/')
    })
    .catch(erro => {
      res.status(502).render("error", {"error" : erro})
    })
});


/* GET id compositores. */
router.get('/:idCompositor', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/compositores/' + req.params.idCompositor)
      .then(resp => {
        var compositor = resp.data
        res.status(200).render("compositorPage", {"compositor" : compositor, "date" : d})
      })
      .catch(erro => {
        res.status(503).render("error", {"error" : erro})
      })
});


router.get('/edit/:idCompositor', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/compositores/' + req.params.idCompositor)
    .then(resp => {
        var compositor = resp.data
        console.log(compositor)
        res.status(200).render("compositoresFormEditPage", {"compositor" : compositor, "date" : d})
    })
    .catch(erro => {
        res.status(504).render("error", {"error" : erro})
    })
});

router.get('/delete/:idCompositor', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/compositores/' + req.params.idCompositor)
    .then(resp => {
      var compositor = resp.data
      res.status(200).render("compositoresFormDeletePage", {"compositor" : compositor, "date" : d})
    })
    .catch(erro => {
        res.status(505).render("error", {"error" : erro})
    })
});

router.post('/edit/:idCompositor', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    var compositor = req.body
    console.log(req.params.idCompositor)
    axios.put('http://localhost:3000/compositores/' + req.params.idCompositor, compositor)
    .then(resp => {
        res.status(201).redirect('/')
    })
    .catch(erro => {
        res.status(506).render("error", {"error" : erro})
    })
});

router.post('/delete/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16);
  var idCompositor = req.params.idCompositor;
  axios.delete('http://localhost:3000/compositores/' + idCompositor)
  .then(resp => {
      res.status(201).redirect('/')
  })
  .catch(erro => {
      res.status(500).render("error", {"error" : erro}); 
  });
});


module.exports = router;
