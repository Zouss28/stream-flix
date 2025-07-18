"use client"

import { MediaCard } from "@/components/media-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MediaItem } from "@/lib/types"

interface MediaCarouselProps {
  items: MediaItem[]
  isLoading: boolean
  type: "movie" | "tv"
}

export function MediaCarousel({ items, isLoading, type }: MediaCarouselProps) {
  if (isLoading) {
    return (
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-none w-48">
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 mt-2" />
            <Skeleton className="h-3 w-1/2 mt-1" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {items.map((item) => (
        <div key={item.id} className="flex-none w-48">
          <MediaCard item={item} type={type} />
        </div>
      ))}
    </div>
  )
}
