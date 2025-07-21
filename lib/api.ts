import type { Movie, TVShow } from "./types"

// Mock data - replace with actual API calls
const mockMovies: Movie[] = [
  {
    id: "1",
    title: "The Dark Knight",
    year: "2008",
    genres: ["Action", "Crime", "Drama"],
    rating: "9.0",
    poster: "/placeholder.svg?height=300&width=200",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    duration: "2h 32m",
  },
  {
    id: "2",
    title: "Inception",
    year: "2010",
    genres: ["Action", "Sci-Fi", "Thriller"],
    rating: "8.8",
    poster: "/placeholder.svg?height=300&width=200",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: "2h 28m",
  },
  // Add more mock movies...
]

const mockTVShows: TVShow[] = [
  {
    id: "1",
    title: "Breaking Bad",
    year: "2008",
    genres: ["Crime", "Drama", "Thriller"],
    rating: "9.5",
    poster: "/placeholder.svg?height=300&width=200",
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    seasons: 5,
    episodes: [
      { season: 1, episode: 1, title: "Pilot", duration: "58m" },
      { season: 1, episode: 2, title: "Cat's in the Bag...", duration: "48m" },
      // Add more episodes...
    ],
  },
  // Add more mock TV shows...
]

// API functions
export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`/api/trending-movies`);
  const data = await response.json();
  return data;
}

export const fetchTrendingTV = async (): Promise<TVShow[]> => {
  const response = await fetch(`/api/trending-tv`);
  const data = await response.json();
  return data;
}

export const fetchLatestReleases = async (): Promise<Movie[]> => {
  const response = await fetch(`/api/upcoming-movies`);
  const data = await response.json();
  return data;
}

export const fetchMovieDetails = async (id: string): Promise<Movie | null> => {
  const response = await fetch(`/api/movie/${id}`);
  const data = await response.json();
  return data;
}

export const fetchTVDetails = async (id: string): Promise<TVShow | null> => {
  const response = await fetch(`/api/tv/${id}`);
  const data = await response.json();
  return data;
}

export const searchMovies = async (
  query: string,
  options: { page?: number; limit?: number } = {},
): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`/api/search-movies/${query}/${options.page}`)
  const data = await response.json();

  const total = data[data.length - 1]
  data.pop(); 
  const page = options.page || 1
  const limit = options.limit || 20
  const items = data.slice(0, limit)
  const totalPages = Math.ceil(total / limit)

  return { items, total, page, limit,totalPages  }
}


export const searchTV = async (
  query: string,
  options: { page?: number; limit?: number } = {},
): Promise<PaginatedResponse<TVShow>> => {
  const response = await fetch(`/api/search-tv/${query}/${options.page}`)
  const data = await response.json();

  const total = data[data.length - 1]
  data.pop(); 
  const page = options.page || 1
  const limit = options.limit || 20
  const items = data.slice(0, limit)
  const totalPages = Math.ceil(total / limit)

  return { items, total, page, limit, totalPages }
}

export const getStreamingUrl = (
  id: string,
  type: "movie" | "tv",
  season?: number,
  episode?: number,
  language: "en" | "fr" = "en",
): string => {
  // This would integrate with Vidsrc or similar embed API
  const englishUrl = "https://vidsrc.to/embed"
  const frenchUrl = "https://frembed.top/api"

  if (language === "fr") {
    if (type === "movie") {
      return `${frenchUrl}/film.php?id=${id}`
    } else {
      return `${frenchUrl}/serie.php?id=${id}&sa=${season}&epi=${episode}`
    }
  } else {
    if (type === "movie") {
      return `${englishUrl}/movie/${id}`
    } else {
      return `${englishUrl}/tv/${id}/${season}/${episode}`
    }
  }
}

interface FetchOptions {
  search?: string
  genre?: string
  year?: string
  sortBy?: string
  page?: number
  limit?: number
}

export const fetchMovies = async (options: FetchOptions = {}) => {
  let response = await fetch(`/api/movies-list/${options.page}`)
  let filteredMovies = await response.json()

  // Apply search filter
  if (options.search) {
    filteredMovies = filteredMovies.filter((movie) => movie.title.toLowerCase().includes(options.search!.toLowerCase()))
  }

  // Apply genre filter
  if (options.genre && options.genre !== "all") {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.genres.some((genre) => genre.toLowerCase() === options.genre!.toLowerCase()),
    )
  }

  // Apply year filter
  if (options.year && options.year !== "all") {
    filteredMovies = filteredMovies.filter((movie) => movie.year === options.year)
  }

  // Apply sorting
  switch (options.sortBy) {
    case "oldest":
      filteredMovies.sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))
      break
    case "rating":
      filteredMovies.sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
      break
    case "title":
      filteredMovies.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "newest":
    default:
      filteredMovies.sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))
      break
  }

  const total = filteredMovies[filteredMovies.length - 1]
  const page = options.page || 1
  const limit = options.limit || 20
  const items = filteredMovies.slice(0, 20)

  return { items, total, page, limit }
}

export const fetchTVShows = async (options: FetchOptions = {}) => {
  let response = await fetch(`/api/tv-list/${options.page}`)
  let filteredShows = await response.json()

  // Apply search filter
  if (options.search) {
    filteredShows = filteredShows.filter((show) => show.title.toLowerCase().includes(options.search!.toLowerCase()))
  }

  // Apply genre filter
  if (options.genre && options.genre !== "all") {
    filteredShows = filteredShows.filter((show) =>
      show.genres.some((genre) => genre.toLowerCase() === options.genre!.toLowerCase()),
    )
  }

  // Apply year filter
  if (options.year && options.year !== "all") {
    filteredShows = filteredShows.filter((show) => show.year === options.year)
  }

  // Apply sorting
  switch (options.sortBy) {
    case "oldest":
      filteredShows.sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))
      break
    case "rating":
      filteredShows.sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
      break
    case "title":
      filteredShows.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "newest":
    default:
      filteredShows.sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))
      break
  }

  const total = filteredShows[filteredShows.length - 1]
  const page = options.page || 1
  const limit = options.limit || 20
  const items = filteredShows.slice(0, 20)

  return { items, total, page, limit }
}

export const getGenres = async (): Promise<string[]> => {
  const allGenres = new Set<string>()
  mockMovies.forEach((movie) => movie.genres.forEach((genre) => allGenres.add(genre)))
  mockTVShows.forEach((show) => show.genres.forEach((genre) => allGenres.add(genre)))

  return Array.from(allGenres).sort()
}