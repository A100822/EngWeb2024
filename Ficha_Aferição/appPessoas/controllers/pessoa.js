var mongoose = require('mongoose')
const { modelName } = require("../model/pessoa")
var Pessoa = require('../model/pessoa')

module.exports.list = () => {
    return Pessoa
        .find()
        .sort({nome: 1})
        .exec()
}
module.exports.insert = (pessoa) => {
    if((Pessoa.find({_id: pessoa._id}).exec()).length != 1){
        var newPessoa = new Pessoa(pessoa)
        return newPessoa.save()
    }
}

module.exports.delete = (id) => {
    Pessoa
        .find({_id: id})
        .deleteOne()
        .exec()
}

module.exports.update = (id, pessoa) => {
    return Pessoa
        .findByIdAndUpdate(id, pessoa, {new: true})
        .exec()
}


