var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/animal_app_with_zoo");

module.exports.animal = require("./animal");
module.exports.Zoo = require("./zoo");