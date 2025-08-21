const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

//GET trending movies from TMDB
router.get('/trending-movies', async (req, res) => {
    try {
    
    const response = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=' + process.env.TMDB_API_KEY);
    const data = await response.json();
    const movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: process.env.TMDB_IMAGE_URL + movie.poster_path,
      year: movie.release_date,
      rating: movie.vote_average,
      description: movie.overview,
      genres: ["Action", "Crime", "Drama"]
    }));
    res.json(movies);
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to fetch trending movies' });
    }
  });
  
  
  //GET trending tv shows from TMDB
  router.get('/trending-tv', async (req, res) => {
    try {
      const response = await fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US&api_key=' + process.env.TMDB_API_KEY);
      const data = await response.json();
      const tvShows = data.results.map(tvShow => ({
        id: tvShow.id,
        title: tvShow.name,
        poster: process.env.TMDB_IMAGE_URL + tvShow.poster_path,
        year: tvShow.first_air_date,
        rating: tvShow.vote_average,
        description: tvShow.overview,
        genres: ["Action", "Crime", "Drama"],
        seasons: 5,
        episodes: [
          { season: 1, episode: 1, title: "Pilot", duration: "58m" },
          { season: 1, episode: 2, title: "Cat's in the Bag...", duration: "48m" },
        ]
      }));
      res.json(tvShows);
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to fetch trending tv shows' });
    }
  });
  
  //GET latest movies from TMDB
  router.get('/upcoming-movies', async (req, res) => {
    try {
      const response = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&api_key=' + process.env.TMDB_API_KEY);
      const data = await response.json();
      const movies = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: process.env.TMDB_IMAGE_URL + movie.poster_path,
        year: movie.release_date,
        rating: movie.vote_average,
        description: movie.overview,
        genres: ["Action", "Crime", "Drama"]
      }));
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to fetch upcoming movies' });
    }
  });

router.get('/movie/:id', async (req, res) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?language=en-US&api_key=` + process.env.TMDB_API_KEY);
    const data = await response.json();

    const movie = {
        id: data.id,
        title: data.original_title,
        year: data.release_date,
        genres: ["Action", "Crime", "Drama"],
        rating: data.vote_average,
        poster: process.env.TMDB_IMAGE_URL + data.poster_path,
        description: data.overview,
        duration: "2h 32m",
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch movie details' });
  }
});


router.get('/tv/:id', async (req, res) => {
  try {
    // Fetch main TV show details
    const response = await fetch(`https://api.themoviedb.org/3/tv/${req.params.id}?language=en-US&api_key=` + process.env.TMDB_API_KEY);
    const data = await response.json();

    // Fetch all seasons' episodes
    const seasons = [];
    for (let seasonNum = 1; seasonNum <= data.number_of_seasons; seasonNum++) {
      const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${req.params.id}/season/${seasonNum}?language=en-US&api_key=` + process.env.TMDB_API_KEY);
      const seasonData = await seasonRes.json();
      if (seasonData.episodes && Array.isArray(seasonData.episodes)) {
        seasonData.episodes.forEach(episode => {
          seasons.push({
            season: episode.season_number,
            episode: episode.episode_number,
            title: episode.name,
            duration: (episode.runtime ? episode.runtime + "m" : "N/A")
          });
        });
      }
    }

    const tv = {
      id: data.id,
      title: data.name,
      year: data.first_air_date,
      genres: ["Crime", "Drama", "Thriller"],
      rating: data.vote_average,
      poster: process.env.TMDB_IMAGE_URL + data.poster_path,
      description: data.overview,
      seasons: data.number_of_seasons,
      episodes: seasons
    }
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch tv details' });
  }
});

//Get all movies from TMDB
router.get('/movies-list/:page', async (req, res) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${req.params.page}&api_key=` + process.env.TMDB_API_KEY);
    const data = await response.json();
    const movies = data.results.map(movie => ({
      id: movie.id, 
      title: movie.title,
      poster: process.env.TMDB_IMAGE_URL + movie.poster_path,
      year: movie.release_date,
      rating: movie.vote_average,
      description: movie.overview,
      genres: ["Action", "Crime", "Drama"]
    }));
    movies.push(data.total_results);
    res.json(movies);   
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch movies' });
  }
});

//Get all tv shows from TMDB
router.get('/tv-list/:page', async (req, res) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?language=en-US&page=${req.params.page}&api_key=` + process.env.TMDB_API_KEY);
    const data = await response.json();
    const tvShows = data.results.map(tvShow => ({
      id: tvShow.id,
      title: tvShow.name,
      poster: process.env.TMDB_IMAGE_URL + tvShow.poster_path,
      year: tvShow.first_air_date,
      rating: tvShow.vote_average,
      description: tvShow.overview,
      genres: ["Action", "Crime", "Drama"],
    }));
    tvShows.push(data.total_results);
    res.json(tvShows);   
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch tv shows' });
  }
});

router.get('/search-movies/:query/:page', async (req, res) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${req.params.query}&include_adult=false&language=en-US&page=${req.params.page}&api_key=` + process.env.TMDB_API_KEY );
    const data = await response.json();
    const results = data.results.map(movie => ({
      id: movie.id,
      title: movie.original_title,
      poster: process.env.TMDB_IMAGE_URL + movie.poster_path,
      year: movie.release_date,
      rating: movie.vote_average,
      description: movie.overview,
      genres: ["Action", "Crime", "Drama"]
    }));
    results.push(data.total_results);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch search results' });
  }
});

router.get('/search-tv/:query/:page', async (req, res) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${req.params.query}&include_adult=false&language=en-US&page=${req.params.page}&api_key=` + process.env.TMDB_API_KEY);
    const data = await response.json();
    const results = data.results.map(tvShow => ({
      id: tvShow.id,
      title: tvShow.name,   
      poster: process.env.TMDB_IMAGE_URL + tvShow.poster_path,
      year: tvShow.first_air_date,
      rating: tvShow.vote_average,
      description: tvShow.overview,
      genres: ["Action", "Crime", "Drama"]
    }));
    results.push(data.total_results);
    res.json(results);  
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch search results' });
  }
});

module.exports = router;