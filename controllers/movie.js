const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const paging = require('../utils/paging');
const url = require('url');

const pageSize = 20;

exports.getMoviesNetFlix = (req, res, next) => {
    const page = req.query.page || 1;

    Movie.fetchMoviesNetFlix(movies => {
        movies.sort(function(a, b) {
            return a.popularity - b.popularity;
        });

        const moviesSort = paging(movies, pageSize) ?? [];

        res.send({page: page, results: moviesSort[page - 1]});
    });
};

exports.getMoviesTrending = (req, res, next) => {
    const page = req.query.page || 1;

    Movie.fetchMovies(movies => {
        movies.sort(function(a, b) {
            return a.popularity - b.popularity;
        }).reverse();

        const moviesSort = paging(movies, pageSize) ?? [];

        res.send({page: page, results: moviesSort[page - 1]});
    });
};

exports.getMoviesRating = (req, res, next) => {
    const page = req.query.page || 1;

    Movie.fetchMovies(movies => {
        movies.sort(function(a, b) {
            return a.vote_average - b.vote_average;
        }).reverse();

        const moviesSort = paging(movies, pageSize) ?? [];

        res.send({page: page, results: moviesSort[page - 1]});
    });
};

exports.getMoviesByGenre = (req, res, next) => {
    const page = req.query.page || 1;
    let genre_id = req.query.genre_id || null;
    let isFound = false;

    //User send request genre_id = null
    if(genre_id === null){
        res.statusCode = 400;
        return res.send({message: "Not found gerne parram"});
    }

    genre_id = Number(genre_id);
    Movie.fetchGenres(genres => {
        genres.forEach(genre => {
            if(genre.id === genre_id){
                isFound = true;
            }
        })

        //User send request genre_id not include list genre
        if(!isFound){
            res.statusCode = 400;
            return res.send({message: "Not found that gerne id"});
        }

        Movie.fetchMovies(movies => {
            let listMovieGenre = [];
            movies.forEach(movie => {
                if(movie.genre_ids.includes(genre_id)){
                    listMovieGenre.push(movie);
                }
            });

            const moviesSort = paging(listMovieGenre, pageSize) ?? [];
            return res.send({page: page, results: moviesSort[page - 1]});
        });
    });

};

exports.getVideo = (req, res, next) => {
    const film_id = req.query.film_id || null;

    //User not send film_id
    if(film_id === null){
        res.statusCode = 400;
        return res.send({message: "Not found film_id parram"});
    }

    Movie.fetchVideos(videoList => {
        let videoMovies = [];
        let videoTrailers = [];

        //Find movie by film_id
        videoList.forEach(movie => {
            if(movie.id == film_id){
                videoMovies = movie.videos;
            }
        });

        //Not found movie by film_id
        if(videoMovies.length === 0){
            res.statusCode = 404;
            return res.send({message: "Not found video"});
        }

        //Create array video trailer by condition
        videoMovies.forEach(video => {
            if(video.official === true && video.site === "YouTube" && video.type === "Trailer"){
                videoTrailers.push(video);
            }
        });

        //Not found video by condition
        if(videoTrailers.length === 0){
            res.statusCode = 404;
            return res.send({message: "Not found video"});
        }

        //Sort video trailer by published_at
        videoTrailers.sort(function(a, b){
            return a.published_at - b.published_at;
        });

        res.send({results: videoTrailers[0]});
    });
};

exports.postMoviesSearch = (req, res, next) => {
    if(!req.query.keyword || req.query.keyword === ''){
        res.statusCode = 400;
        return res.send({error: "Not found keyword parram"});
    }

    const keyword = req.query.keyword.toLowerCase();
    const page = req.query.page || 1;
    let moviesSearch = [];

    Movie.fetchMovies(movies => {
        movies.forEach(movie => {
            if(movie.title.toLowerCase().includes(keyword) || movie.overview.toLowerCase().includes(keyword)){
                moviesSearch.push(movie);
            }
        });

        //Sort paging list movie
        const moviesSort = paging(moviesSearch, 25) ?? [];     
        if(moviesSort.length === 0){
            return res.send({page: page, results: moviesSort});
        }
        if(moviesSort.length > 0){
            return res.send({page: page, results: moviesSort[page - 1]});
        }
    });
};

exports.postMoviesSearchAdvanced = (req, res, next) => {
    const body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const searchInfo = JSON.parse(parsedBody);
        let searchGenre_id = null;
        let searchYear = null;

        if(searchInfo.keyword === ''){
            return res.send({message: 'Keyword missing'});
        }

        //Find Genre
        Genre.fetchGenres(genres => {
            genres.forEach(genre => {
                if(genre.name.toLowerCase() === searchInfo.genre.toLowerCase()){
                    searchGenre_id = genre.id;                   
                }
            });
        });
        
        let moviesSearch = [];
        const page = req.query.page || 1;
        Movie.fetchMovies(movies => {
            //Find by keyword
            movies.forEach(movie => {              
                if(movie.title.toLowerCase().includes(searchInfo.keyword) || movie.overview.toLowerCase().includes(searchInfo.keyword)){
                    moviesSearch.push(movie);
                }              
            });

            //Find by genre
            if(searchInfo.genre !== ''){             
                moviesSearch = moviesSearch.filter((movie) => {                   
                    return movie.genre_ids.includes(searchGenre_id);
                });
            }

            //Find by media_type
            if(searchInfo.mediaType !== 'all'){             
                moviesSearch = moviesSearch.filter((movie) => {                   
                    return movie.media_type.toLowerCase() === searchInfo.mediaType.toLowerCase(); 
                });
            }

            //Find by language
            if(searchInfo.language !== ''){             
                moviesSearch = moviesSearch.filter((movie) => {                   
                    return movie.original_language.toLowerCase().includes(searchInfo.language)
                });
            }

            //Find by year
            if(searchInfo.year !== ''){             
                moviesSearch = moviesSearch.filter((movie) => {
                    searchYear = new Date(movie.release_date).getFullYear();
                    return searchYear == searchInfo.year;
                });
            }
    
            //Sort paging list movie
            const moviesSort = paging(moviesSearch, 25) ?? [];
            if(moviesSort.length === 0){
                return res.send({page: page, results: moviesSort});
            }
            if(moviesSort.length > 0){
                return res.send({page: page, results: moviesSort[page - 1]});
            }
        });
    });
};