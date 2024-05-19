const path = require('path');
const pathDirName = require('../utils/pathDirName');
const getFromFile = require('../utils/getFromFile');

//path dummy Data 
const pathMediaType = path.join(pathDirName, 'data', 'mediaTypeList.json');

//Class Media Type
module.exports = class User {
    static fetchMediaTypes(callback) {
        getFromFile(pathMediaType, callback);
    };
}
