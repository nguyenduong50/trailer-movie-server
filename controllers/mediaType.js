const MediaType = require('../models/MediaType');

exports.getMediaTypes = (req, res) => {
    MediaType.fetchMediaTypes(mediaTypes => {
        res.send({results: mediaTypes});
    })
};