const path = require('path');
const pathDirName = require('../utils/pathDirName');
const getFromFile = require('../utils/getFromFile');

//path dummy Data 
const pathMovie = path.join(pathDirName, 'data', 'movieList.json');
const pathMovieNetFlix = path.join(pathDirName, 'data', 'movieNetFlix.json');
const pathGenre = path.join(pathDirName, 'data', 'genreList.json');
const pathVideoList = path.join(pathDirName, 'data', 'videoList.json');

//Class Movie
module.exports = class Movie {
    static fetchMovies(callback) {
        getFromFile(pathMovie, callback);
    };

    static fetchMoviesNetFlix(callback) {
        getFromFile(pathMovieNetFlix, callback);
    };

    static fetchGenres(callback) {
        getFromFile(pathGenre, callback);
    };

    static fetchVideos(callback) {
        getFromFile(pathVideoList, callback);
    };
}

