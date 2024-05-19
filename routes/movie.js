const express = require('express');
const movieController = require('../controllers/movie');
const mediaTypeController = require('../controllers/mediaType');
const router = express.Router();

router.get('/movies/net-flix', movieController.getMoviesNetFlix);
router.get('/movies/trending', movieController.getMoviesTrending);
router.get('/movies/top-rate', movieController.getMoviesRating);
router.get('/movies/discover', movieController.getMoviesByGenre);
router.post('/movies/video', movieController.getVideo);
router.post('/movies/search', movieController.postMoviesSearch);
router.post('/movies/search-advanced', movieController.postMoviesSearchAdvanced);

router.get('/media-type', mediaTypeController.getMediaTypes);

module.exports = router;