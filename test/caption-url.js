var caption = require('..')
var assert = require('assert')
var fs = require('fs')

var options = {caption : "Top", bottomCaption : "Bottom"}

describe('captioning from a URL', function() {
  this.timeout(Infinity)

  it ('should properly generate a file when calling caption.url', function(done) {
    caption.url('http://simonbisleygallery.com/art/biz00157.jpg', options, function(err, captionedImage){
      assert.ifError(err)
      assert(fs.existsSync(captionedImage))
      done()
    })
  })

})
