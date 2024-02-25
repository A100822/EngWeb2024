//http://localhost:2102
exports.myDateTime = () => {
    var d = new Date().toISOString().substring(0,16)
    return d
}

exports.myName = () => {
    return "Maya Gomes"
}

exports.turma = "EngWeb2024 :: TP3"