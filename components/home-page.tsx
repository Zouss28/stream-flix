"use client"

import { useQuery } from "@tanstack/react-query"
import { MediaCarousel } from "@/components/media-carousel"
import { fetchTrendingMovies, fetchTrendingTV, fetchLatestReleases } from "@/lib/api"

export function HomePage() {
  const { data: trendingMovies, isLoading: loadingMovies } = useQuery({
    queryKey: ["trending-movies"],
    queryFn: fetchTrendingMovies,
  })

  const { data: trendingTV, isLoading: loadingTV } = useQuery({
    queryKey: ["trending-tv"],
    queryFn: fetchTrendingTV,
  })

  const { data: latestReleases, isLoading: loadingLatest } = useQuery({
    queryKey: ["latest-releases"],
    queryFn: fetchLatestReleases,
  })

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <section className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div>
            <h1 className="text-5xl font-bold mb-4">Welcome to StreamFlix</h1>
            <p className="text-xl">Stream unlimited movies and TV shows</p>
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
        <MediaCarousel items={trendingMovies || []} isLoading={loadingMovies} type="movie" />
      </section>

      {/* Trending TV Shows */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
        <MediaCarousel items={trendingTV || []} isLoading={loadingTV} type="tv" />
      </section>

      {/* Latest Releases */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Releases</h2>
        <MediaCarousel items={latestReleases || []} isLoading={loadingLatest} type="movie" />
      </section>
    </div>
  )
}
