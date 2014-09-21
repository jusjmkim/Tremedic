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

var SlopeSchema = new mongoose.Schema({
  slope: {type: Number}
});

var Rotation = mongoose.model('Rotation', RotationSchema)
    , Slope = mongoose.model('Slope', SlopeSchema);

module.exports = {
  Rotation: Rotation,
  Slope: Slope
};