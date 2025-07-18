"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface VideoPlayerProps {
  src: string
  title: string
  onClose: () => void
}

export function VideoPlayer({ src, title, onClose }: VideoPlayerProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-80">
        <h2 className="text-white text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <iframe src={src} className="w-full h-full" allowFullScreen frameBorder="0" title={title} />
      </div>
    </div>
  )
}
