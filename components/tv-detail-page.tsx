"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Play, Languages } from "lucide-react"
import Image from "next/image"
import { fetchTVDetails, getStreamingUrl } from "@/lib/api"
import { VideoPlayer } from "@/components/video-player"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface TVDetailPageProps {
  id: string
}

export function TVDetailPage({ id }: TVDetailPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "fr">("en")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize language from URL params or localStorage
  useEffect(() => {
    const urlLang = searchParams.get("lang") as "en" | "fr"
    const storedLang = localStorage.getItem("preferred-language") as "en" | "fr"

    if (urlLang && (urlLang === "en" || urlLang === "fr")) {
      setSelectedLanguage(urlLang)
    } else if (storedLang && (storedLang === "en" || storedLang === "fr")) {
      setSelectedLanguage(storedLang)
    }
  }, [searchParams])

  // Update URL and localStorage when language changes
  const handleLanguageChange = (language: "en" | "fr") => {
    if (!language) return

    setSelectedLanguage(language)
    localStorage.setItem("preferred-language", language)

    // Update URL without page reload
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", language)
    router.replace(`/tv/${id}?${params.toString()}`, { scroll: false })
  }

  const { data: tvShow, isLoading } = useQuery({
    queryKey: ["tv", id],
    queryFn: () => fetchTVDetails(id),
  })

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!tvShow) {
    return <div className="p-6">TV Show not found</div>
  }

  const episodesForSelectedSeason = tvShow.episodes?.filter((episode) => episode.season === selectedSeason) || []

  return (
    <div className="p-6">
      {isPlaying ? (
        <VideoPlayer
          src={getStreamingUrl(id, "tv", selectedSeason, selectedEpisode, selectedLanguage)}
          title={`${tvShow.title} - Season ${selectedSeason}, Episode ${selectedEpisode}`}
          onClose={() => setIsPlaying(false)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Image
              src={tvShow.poster || "/placeholder.svg?height=600&width=400"}
              alt={tvShow.title}
              width={400}
              height={600}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{tvShow.title}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <span>{tvShow.year}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{tvShow.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tvShow.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Language Selection */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Languages className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Audio Language</span>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={selectedLanguage}
                    onValueChange={handleLanguageChange}
                    className="bg-muted rounded-lg p-1"
                  >
                    <ToggleGroupItem
                      value="en"
                      aria-label="English"
                      className="data-[state=on]:bg-background data-[state=on]:text-foreground"
                    >
                      English
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="fr"
                      aria-label="French"
                      className="data-[state=on]:bg-background data-[state=on]:text-foreground"
                    >
                      Français
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Seasons</h3>
                <div
                  className="flex flex-wrap gap-2 max-w-full overflow-x-auto"
                  style={{
                    maxWidth: "100%",
                    overflowX: "auto",
                    flexWrap: "wrap",
                  }}
                >
                  {Array.from({ length: tvShow.seasons }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={selectedSeason === i + 1 ? "default" : "outline"}
                      onClick={() => {
                        setSelectedSeason(i + 1)
                        setSelectedEpisode(1) // Reset episode when season changes
                      }}
                      className="whitespace-nowrap"
                    >
                      Season {i + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Episodes</h3>
                <div className="flex flex-col space-y-2">
                  {episodesForSelectedSeason.map((episode) => (
                    <Button
                      key={`${episode.season}-${episode.episode}`}
                      variant={selectedEpisode === episode.episode ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedEpisode(episode.episode)}
                    >
                      {episode.episode}. {episode.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={handlePlay} size="lg" className="w-full sm:w-auto">
              <Play className="mr-2 h-5 w-5" />
              Play Now (S{selectedSeason}E{selectedEpisode}) ({selectedLanguage === "en" ? "English" : "Français"})
            </Button>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">{tvShow.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
