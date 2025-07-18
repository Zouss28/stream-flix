"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { MediaCard } from "@/components/media-card"
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { searchMovies, searchTV } from "@/lib/api"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all")
  const [moviePage, setMoviePage] = useState(Number.parseInt(searchParams.get("moviePage") || "1"))
  const [tvPage, setTvPage] = useState(Number.parseInt(searchParams.get("tvPage") || "1"))
  const [pageSize, setPageSize] = useState(Number.parseInt(searchParams.get("pageSize") || "20"))

  const debouncedQuery = useDebounce(query, 500)

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedQuery) params.set("q", debouncedQuery)
    if (activeTab !== "all") params.set("tab", activeTab)
    if (moviePage !== 1) params.set("moviePage", moviePage.toString())
    if (tvPage !== 1) params.set("tvPage", tvPage.toString())
    if (pageSize !== 20) params.set("pageSize", pageSize.toString())

    const newUrl = params.toString() ? `/search?${params.toString()}` : "/search"
    router.replace(newUrl, { scroll: false })
  }, [debouncedQuery, activeTab, moviePage, tvPage, pageSize, router])

  const {
    data: movieResults,
    isLoading: loadingMovies,
    error: movieError,
  } = useQuery({
    queryKey: ["search-movies", debouncedQuery, moviePage, pageSize],
    queryFn: () => searchMovies(debouncedQuery, { page: moviePage, limit: pageSize }),
    enabled: !!debouncedQuery,
  })

  const {
    data: tvResults,
    isLoading: loadingTV,
    error: tvError,
  } = useQuery({
    queryKey: ["search-tv", debouncedQuery, tvPage, pageSize],
    queryFn: () => searchTV(debouncedQuery, { page: tvPage, limit: pageSize }),
    enabled: !!debouncedQuery,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset pages when searching
    setMoviePage(1)
    setTvPage(1)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number.parseInt(newPageSize))
    setMoviePage(1)
    setTvPage(1)
  }

  // Calculate totals and pagination info
  const movieTotal = movieResults?.total || 0
  const tvTotal = tvResults?.total || 0
  const allTotal = movieTotal + tvTotal

  const movieTotalPages = Math.ceil(movieTotal / pageSize)
  const tvTotalPages = Math.ceil(tvTotal / pageSize)

  const allResults = useMemo(() => {
    const movies = (movieResults?.items || []).map((item) => ({ ...item, type: "movie" as const }))
    const tvShows = (tvResults?.items || []).map((item) => ({ ...item, type: "tv" as const }))
    return [...movies, ...tvShows]
  }, [movieResults, tvResults])

  const renderPagination = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
    if (totalPages <= 1) return null

    const getVisiblePages = () => {
      const delta = 2
      const range = []
      const rangeWithDots = []

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i)
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...")
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages)
      } else {
        rangeWithDots.push(totalPages)
      }

      return rangeWithDots
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex space-x-1">
          {getVisiblePages().map((page, index) => (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={typeof page !== "number"}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderResultsInfo = (current: number, total: number, type: string) => {
    if (total === 0) return null

    const start = (current - 1) * pageSize + 1
    const end = Math.min(current * pageSize, total)

    return (
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total} {type}
      </p>
    )
  }

  const renderLoadingGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: pageSize }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-72 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 mt-2" />
          <Skeleton className="h-3 w-1/2 mt-1" />
        </div>
      ))}
    </div>
  )

  const renderError = (error: any, type: string) => (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">Failed to load {type}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  )

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies & TV shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loadingMovies || loadingTV}>
              {(loadingMovies || loadingTV) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Search
            </Button>
          </form>

          {/* Page Size Selector */}
          {debouncedQuery && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Results per page:</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {debouncedQuery ? (
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All ({allTotal})</TabsTrigger>
              <TabsTrigger value="movies">Movies ({movieTotal})</TabsTrigger>
              <TabsTrigger value="tv">TV Shows ({tvTotal})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-6">
                {renderResultsInfo(1, allTotal, "results")}

                {loadingMovies || loadingTV ? (
                  renderLoadingGrid()
                ) : movieError && tvError ? (
                  renderError(movieError, "results")
                ) : allResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {allResults.map((item) => (
                      <MediaCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No results found for "{debouncedQuery}"</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="movies">
              <div className="space-y-6">
                {renderResultsInfo(moviePage, movieTotal, "movies")}

                {loadingMovies ? (
                  renderLoadingGrid()
                ) : movieError ? (
                  renderError(movieError, "movies")
                ) : movieResults?.items.length ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {movieResults.items.map((item) => (
                        <MediaCard key={item.id} item={item} type="movie" />
                      ))}
                    </div>
                    {renderPagination(moviePage, movieTotalPages, setMoviePage)}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No movies found for "{debouncedQuery}"</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tv">
              <div className="space-y-6">
                {renderResultsInfo(tvPage, tvTotal, "TV shows")}

                {loadingTV ? (
                  renderLoadingGrid()
                ) : tvError ? (
                  renderError(tvError, "TV shows")
                ) : tvResults?.items.length ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {tvResults.items.map((item) => (
                        <MediaCard key={item.id} item={item} type="tv" />
                      ))}
                    </div>
                    {renderPagination(tvPage, tvTotalPages, setTvPage)}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No TV shows found for "{debouncedQuery}"</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center text-muted-foreground mt-12">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Search for your favorite movies and TV shows</p>
          </div>
        )}
      </div>
    </div>
  )
}
