"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { MediaItem } from "@/lib/types"

interface MediaCardProps {
  item: MediaItem
  type: "movie" | "tv"
}

export function MediaCard({ item, type }: MediaCardProps) {
  const href = `/${type}/${item.id}`

  return (
    <Link href={href}>
      <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={item.poster || "/placeholder.svg?height=300&width=200"}
              alt={item.title}
              width={200}
              height={300}
              className="w-full h-72 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black bg-opacity-70 rounded px-2 py-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs">{item.rating}</span>
            </div>
          </div>

          <div className="p-3">
            <h3 className="font-semibold text-sm truncate">{item.title}</h3>
            <p className="text-muted-foreground text-xs">{item.year}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {item.genres.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
