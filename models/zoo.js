var mongoose = require("mongoose");
var animal = require("./animal");

var zooSchema = new mongoose.Schema({
                    zooName: String,
                    zooLocation: String,
                    animals: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "animal"
                    }]
                  });


zooSchema.pre('remove', function(callback) {
    Book.remove({author_id: this._id}).exec();
    callback();
});

var zoo = mongoose.model("zoo", zooSchema);

module.exports = zoo;