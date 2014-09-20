var mongoose = require('mongoose');

var RotationSchema = new mongoose.Schema({
  rotation: {
    type: Number
  },
  timePoint: {
    type: Date,
    default: Date.now
  }
});

var Rotation = mongoose.model('Rotation', RotationSchema);

module.exports = {
  Rotation: Rotation
};