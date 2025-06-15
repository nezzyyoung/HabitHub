
// class/uploads/PubliciteUpload.js
const IMAGES_DESTINATIONS = require("../../constants/IMAGES_DESTINATIONS")
const Upload = require("../Upload")
const path = require('path')

class PubliciteUpload extends Upload {
     constructor() {
          super()
          this.destinationPath = path.resolve('./') + path.sep + 'public' + IMAGES_DESTINATIONS.publicite
     }
}
module.exports = PubliciteUpload