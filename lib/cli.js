#!/usr/bin/env node

// Generate captions from the command line!
// ---

// Dependencies
var caption = require('../index')
  , existsSync = (require('fs').existsSync || require('path').existsSync)
  , debug = require('debug')('caption:cli')
  , args = require('minimist')(process.argv.slice(2), {
    'string': [ 'top-caption', 'bottom-caption', 'output' ],
    'alias': { 'c': 'bottom-caption', 't': 'top-caption', 'b': 'bottom-caption', 'o': 'output'}
  })

debug('invoked with args: %s', JSON.stringify(args))

// arguments
var imagePath = args._[0]
  , topCaption = args['top-caption'] || args['bottom-caption']
  , bottomCaption = args['top-caption'] ? args['bottom-caption'] : null
  , outputFile = args['output'] || false
  , isUrl = false

// print help if no arguments are provided.
if(!imagePath || !args['bottom-caption']){
  var usage = "Usage: \n"
  usage += "For a caption on the bottom of the image:\n"
  usage += "  caption <path to image or image url> -c \"caption text\" -o [ouput file]\n"
  usage += "For top and bottom captions (meme style):\n"
  usage += "  caption <path to image or image url> --top-caption \"top caption\" --bottom-caption \"bottom caption\" --output [ouput file]\n"
  return console.log(usage)
}

// find out if caption is a url or path
if(!existsSync(imagePath)) isUrl = true

// set up options
var options = {
  caption : topCaption,
  bottomCaption : bottomCaption,
  outputFile : outputFile
}
// do the captioning
caption[isUrl ? 'url' : 'path'](imagePath,options,function(err,imageFile){
  if(err) return console.error("Error captioning image: " + err.message)
  console.log("Completed captioning image: ",imageFile)
})
