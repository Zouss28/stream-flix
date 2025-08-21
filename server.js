require('dotenv').config();
const express = require('express');
const cors = require('cors');
const next = require('next');
const app = express();
app.use(cors());
app.use(express.json());
const nextApp = next({ dev: true });
const handle = nextApp.getRequestHandler();
const tmdbApi = require('./routes/tmdbApi');

nextApp.prepare().then(() => {
  const app = express();

  // Example API route
  app.use('/api', tmdbApi);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json'
    },
    params: {
      api_key: process.env.TMDB_API_KEY
    }
  };

  // Serve Next.js pages for all other requests
  app.all('*splat', (req, res) => {
      return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server ready on http://0.0.0.0:${port}`);
  });
});
