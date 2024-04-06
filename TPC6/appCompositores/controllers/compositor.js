var mongoose = require('mongoose')
const { modelName } = require("../model/compositor")
var Compositor = require('../model/compositor')

module.exports.list = () => {
    return Compositor
        .find()
        .sort({nome: 1})
        .exec()
}
module.exports.insert = (compositor) => {
    if((Compositor.find({_id: compositor._id}).exec()).length != 1){
        var newCompositor = new Compositor(compositor)
        return newCompositor.save()
    }
}

module.exports.delete = (id) => {
    Compositor
        .find({_id: id})
        .deleteOne()
        .exec()
}

module.exports.update = (id, compositor) => {
    return Compositor
        .findByIdAndUpdate(id, compositor, {new: true})
        .exec()
}


