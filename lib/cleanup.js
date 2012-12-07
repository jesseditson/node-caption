// Cleanup
// ---
// cleans up after generation of a captioned image

// Dependencies
var fs = require('fs')
  , util = require('util')

// args are in this order so we can bind in the outputFile
var cleanup = module.exports = function(outputFile,err,captionedImage,originalImage,callback){
  // clean up if we've created a file, but don't fail here if the image doesn't exist.
  try {
    if(isUrl) fs.unlinkSync(originalImage)
  } catch(e){ }
  // return errors if we have them
  if(err) return callback(err)
  // move image if we have a destination
  if(outputFile){
    var is = fs.createReadStream(captionedImage)
      , os = fs.createWriteStream(outputFile)
    util.pump(is, os, function() {
      fs.unlinkSync(captionedImage)
      return callback(null,outputFile)
    })
  } else {
    callback(null,captionedImage)
  }
}