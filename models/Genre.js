const path = require('path');
const pathDirName = require('../utils/pathDirName');
const getFromFile = require('../utils/getFromFile');

//path dummy Data 
const pathGenre = path.join(pathDirName, 'data', 'genreList.json');

//Class User
module.exports = class Genre {
    static fetchGenres(callback) {
        getFromFile(pathGenre, callback);
    };
}