// Generate
// ---
// generates a captioned image using passed path to an image and a string.

// Dependencies
// ---
var im = require('imagemagick')
  , path = require('path')
  , fs = require('fs')
  , child_process = require('child_process')
  , debug = require('debug')('caption:generate')

// Local Vars
var minHeight = process.env.CAPTION_MIN_HEIGHT || 100
var minWidth = process.env.CAPTION_MIN_WIDTH || 500
var im_exists = false

// imageMagick check
var check_for_im = function(callback){
  var im_pattern = /^Version: ImageMagick/
  child_process.exec('identify -version',function(err,stdout,stderr){
    if(!im_pattern.test(stdout)) return callback(new Error("ImageMagick not installed."))
    im_exists = true
    callback(null)
  })
}

// Le Meat
var generate = module.exports = function(imgPath,caption,options,callback){
  // make sure imagemagick exists
  if(!im_exists) {
    debug('checking for imagemagick...')
    return check_for_im(function(err){
      if(err) return callback(err)
      debug('imagmagick validated.')
      generate(imgPath,caption,options,callback)
    })
  }
  // options is optional
  if(!callback && typeof options == "function"){
    callback = options
    options = {}
  }
  // make sure image path is valid
  if(!(path.existsSync || fs.existsSync)(imgPath)) return callback(new Error("Invalid Path to image"))
  // enforce string type on caption
  if(typeof caption !== "string") return callback(new Error("Caption must be a string."))
  // set up options
  minHeight = options.minHeight || minHeight
  minWidth = options.minWidth || minWidth
  var outFile = imgPath.replace(/\.(\w+)$/,'-captioned.$1')
  // identify the image
  debug('identifying image...')
  im.identify(imgPath,function(err,features){
    if(err) return callback(err)
    var h = features.height < minHeight ? features.height : minHeight
      , w = features.width < minWidth ? features.width : minWidth
      // TODO: make these configurable?
      , args = [
          '-strokewidth','2',
          '-stroke','black',
          '-background','transparent',
          '-fill','white',
          '-gravity','center',
          '-size',w+'x'+h,
          "caption:"+unescape(caption),
          imgPath,
          '+swap',
          '-gravity',options.top ? 'north' : 'south',
          '-size',w+'x',
          '-composite',outFile
        ];
    debug('running imagemagick with args: %s', args.join(' '))
    im.convert(args, function(err){
      callback(err,outFile,imgPath)
    })
  })
}
