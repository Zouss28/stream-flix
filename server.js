require('dotenv').config();
const express = require('express');
const cors = require('cors');
const next = require('next');
const app = express();
app.use(cors());
app.use(express.json());
const nextApp = next({ dev: false });
const handle = nextApp.getRequestHandler();
const tmdbApi = require('./routes/tmdbApi');

nextApp.prepare().then(() => {
  const app = express();

  // Example API route
  app.use('/api', tmdbApi);

  // Serve Next.js pages for all other requests
  app.all('*splat', (req, res) => {
      return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server ready on http://0.0.0.0:${port}`);
  });
});
