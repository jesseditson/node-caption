#!/usr/bin/env node

// Generate captions from the command line!
// ---

// Dependencies
var caption = require('../index')
  , existsSync = (require('fs').existsSync || require('path').existsSync)

// Sort out arguments
var args = []
  , preArg = true
process.argv.forEach(function(arg){
  if(arg.match(/\/caption$/)) return preArg = false
  if(preArg) return
  args.push(arg)
})

// print help if no arguments are provided.
if(!args.length){
  var usage = "Usage: \n"
  usage += "For a caption on the bottom of the image:\n"
  usage += "  caption <path to image or image url> \"caption text\" [ouput file]\n"
  usage += "For top and bottom captions (meme style):\n"
  usage += "  caption <path to image or image url> \"top caption\" \"bottom caption\" [ouput file]\n"
  return console.log(usage)
}

// arguments
var imagePath = args[0]
  , captionText = args[1]
  , outputFile = args[2] || false
  , bottomCaption = false
  , isUrl = false
// if there is more than one caption, make a top/bottom "meme style" caption.
if(args.length > 3){
  bottomCaption = args[2]
  outputFile = args[3] || false
}

// find out if caption is a url or path
if(!existsSync(imagePath)) isUrl = true

// set up options
var options = {
  caption : captionText,
  bottomCaption : bottomCaption,
  outputFile : outputFile
}
// do the captioning
caption[isUrl ? 'url' : 'path'](imagePath,options,function(err,imageFile){
  if(err) return console.error("Error captioning image: " + err.message)
  console.log("Completed captioning image: ",imageFile)
})