# Stream-Flix

A modern streaming site for browsing, searching, and viewing information about movies and TV shows. Built with Next.js, Express, and TMDB API, it features a responsive UI, custom video player, and seamless integration of trending, upcoming, and popular media content.

---

## 🚀 Features

- Browse trending movies and TV shows
- View upcoming movie releases
- Detailed pages for movies and TV shows (with seasons/episodes)
- Powerful search for movies and TV shows
- Responsive, modern UI with Radix UI components
- Custom video player
- Dark/light theme support
- API integration with TMDB
- Fast client-side navigation (React Query)
- TypeScript for type safety
- Docker support for easy deployment

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Radix UI
- **Backend:** Express.js (custom server), Node.js
- **API:** TMDB (The Movie Database)
- **State/Data:** React Query
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **UI Components:** Radix UI, Lucide React
- **Other:** Docker, pnpm, dotenv

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd streaming-site
```

### 2. Install dependencies
> This project uses **pnpm** (recommended). You can also use npm or yarn.

#### Using pnpm:
```bash
pnpm install
```
#### Using npm:
```bash
npm install
```
#### Using yarn:
```bash
yarn install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
TMDB_API_KEY=your_tmdb_api_key
TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
PORT=3000
```

### 4. Run the development server
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

### 5. Build for production
```bash
pnpm build && pnpm start
# or
npm run build && npm run start
# or
yarn build && yarn start
```

---

## ⚙️ Environment Variables

The following environment variables are required:
- `TMDB_API_KEY` – Your TMDB API key
- `TMDB_IMAGE_URL` – Base URL for TMDB images (e.g., `https://image.tmdb.org/t/p/w500`)
- `PORT` – Port for the server (default: 3000)

**Example `.env` file:**
```env
TMDB_API_KEY=your_tmdb_api_key
TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
PORT=3000
```

---

## 🐳 Docker Usage

Build and run the app using Docker:
```bash
docker build -t stream-flix .
docker run -p 3000:3000 --env-file .env stream-flix
```

---

## 📁 Folder Structure Overview

```
streaming-site/
├── app/           # Next.js app directory (pages, layouts, routes)
├── components/    # Reusable React components (UI, pages, video player)
├── hooks/         # Custom React hooks
├── lib/           # API utilities, types, helpers
├── public/        # Static assets (images, icons)
├── routes/        # Express API routes (TMDB integration)
├── styles/        # Global and component styles (Tailwind)
├── server.js      # Custom Express server
├── Dockerfile     # Docker configuration
├── package.json   # Project metadata and scripts
└── ...
```

---

## 📡 API Routes Overview

All API routes are prefixed with `/api` and handled by Express (`routes/tmdbApi.js`).

- `GET /api/trending-movies` – Trending movies
- `GET /api/trending-tv` – Trending TV shows
- `GET /api/upcoming-movies` – Upcoming movies
- `GET /api/movie/:id` – Movie details
- `GET /api/tv/:id` – TV show details (with episodes)
- `GET /api/movies-list/:page` – Paginated movies list
- `GET /api/tv-list/:page` – Paginated TV shows list
- `GET /api/search-movies/:query/:page` – Search movies
- `GET /api/search-tv/:query/:page` – Search TV shows

---

## 🤝 Contributing

- Code style: [Next.js](https://nextjs.org/docs/basic-features/eslint) built-in linting (`pnpm lint`)
- Please use consistent formatting and run lint before submitting PRs.
- No Husky or pre-commit hooks detected.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) (default).
