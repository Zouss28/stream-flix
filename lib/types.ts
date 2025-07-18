export interface MediaItem {
  id: string
  title: string
  year: string
  genres: string[]
  rating: string
  poster: string
  description: string
}

export interface Movie extends MediaItem {
  duration: string
}

export interface TVShow extends MediaItem {
  seasons: number
  episodes?: Episode[]
}

export interface Episode {
  season: number
  episode: number
  title: string
  duration: string
}
