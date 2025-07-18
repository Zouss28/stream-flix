"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { MediaCard } from "@/components/media-card"
import { fetchMovies, getGenres } from "@/lib/api"
import type { Movie } from "@/lib/types"

export function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const itemsPerPage = 20

  const {
    data: moviesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movies", searchQuery, selectedGenre, selectedYear, sortBy, currentPage],
    queryFn: () =>
      fetchMovies({
        search: searchQuery,
        genre: selectedGenre,
        year: selectedYear,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      }),
  })

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  })

  const movies = moviesData?.items || []
  const totalPages = Math.ceil((moviesData?.total || 0) / itemsPerPage)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedGenre("all")
    setSelectedYear("all")
    setSortBy("newest")
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Unable to load movies</h2>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movies</h1>
        <p className="text-muted-foreground">Discover and stream your favorite movies</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres?.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="title">A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetFilters} className="flex-1 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                >
                  {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">{moviesData?.total || 0} movies found</p>
          {(searchQuery || selectedGenre !== "all" || selectedYear !== "all") && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
              {selectedGenre !== "all" && <Badge variant="secondary">Genre: {selectedGenre}</Badge>}
              {selectedYear !== "all" && <Badge variant="secondary">Year: {selectedYear}</Badge>}
            </div>
          )}
        </div>
      </div>

      {/* Movies Grid/List */}
      {isLoading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              : "space-y-4"
          }
        >
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div key={i} className={viewMode === "grid" ? "" : "flex space-x-4"}>
              <Skeleton className={viewMode === "grid" ? "h-72 w-full" : "h-32 w-24 flex-shrink-0"} />
              {viewMode === "list" && (
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                : "space-y-4"
            }
          >
            {movies.map((movie: Movie) => (
              <div key={movie.id}>
                {viewMode === "grid" ? <MediaCard item={movie} type="movie" /> : <MovieListItem movie={movie} />}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No movies found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={resetFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  )
}

function MovieListItem({ movie }: { movie: Movie }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <img
            src={movie.poster || "/placeholder.svg?height=120&width=80"}
            alt={movie.title}
            className="w-20 h-30 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
            <p className="text-muted-foreground text-sm">
              {movie.year} • {movie.duration}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genres.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{movie.description}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm ml-1">{movie.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
