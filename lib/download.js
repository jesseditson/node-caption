// Download
// ---
// downloads an image from a url.

// Dependencies
var http = require('http')
  , https = require('https')
  , url = require('url')
  , fs = require('fs')
  , debug = require('debug')('caption:download')

var download = module.exports = function(imageUrl, filename, callback){
  // get extension
  var extension = imageUrl.match(/\.(\w+)$/)
  if(!extension) return callback(new Error("Url must end with a valid extension."))
  extension = extension[1]
  // filename param is optional
  if(!callback && typeof filename == 'function'){
    callback = filename
    // make up a file if filename is not passed
    filename = '/tmp/caption-' + Math.floor(Math.random(10000000)*10000000) + "." + extension
  }
  // parse the url
  var uri = url.parse(imageUrl)
    , host = uri.hostname
    , path = uri.pathname
    , req = http

  // use the proper library to make the request
  if(uri.protocol == "https:") req = https

  // Download the image.
  // TODO: use streams for this.
  debug('downloading image from %s/%s...', host, path)
  req.get({host : host, path : path}, function(res){
    var image = ''
    res.setEncoding('binary')
    res.on('data',function(chunk){
      image += chunk
    })
    res.on('end',function(){
      debug('completed download, saving to %s.', filename)
      // save the file
      fs.writeFile(filename, image, 'binary',function(err){
        if (!err) debug('saved image.')
        callback(err, filename)
      })
    })
  })
}
