const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost/noderest')
Promise = global.Promise

module.exports = mongoose
