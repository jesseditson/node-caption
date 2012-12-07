// Caption Generator
// ---
// generates captions.

// Dependencies

// Library Dependencies
var generate = require('./lib/generate')
  , download = require('./lib/download')
  , cleanup = require('./lib/cleanup')

// Path
// captions an image from a path.
var fromPath = module.exports.path = function(imagePath,options,callback){
  // options
  var caption = options.caption
    , bottomCaption = options.bottomCaption
    , outputFile = options.outputFile
  generate(imagePath, caption, {top : !!bottomCaption}, function(err,captioned,original){
    cleanup(outputFile,err,captioned,original,function(err,image){
      if(bottomCaption){
        generate(image,bottomCaption,{},function(err,captioned,original){
          cleanup(image,err,captioned,original,callback)
        })
      } else {
        callback(err,image)
      }
    })
  })
}

// Url
// captions an image from a URL.
var fromUrl = module.exports.url = function(imageUrl,options,callback){
  // options
  download(imageUrl,function(err,filename){
    if(err) return callback(err)
    fromPath(filename,options,callback)
  })
}