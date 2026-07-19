'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MapPin, Calendar, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Puja {
  id: string
  title: string
  slug: string
  description: string | null
  date: Date | null
  images: string[]
  temple?: {
    name: string
    location: string
  } | null
  category?: {
    name: string
  } | null
}

export function HeroPujaSlider({ pujas }: { pujas: Puja[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (pujas.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pujas.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [pujas.length])

  if (!pujas || pujas.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-amber-200 shadow-2xl shadow-amber-500/10 bg-white flex items-center justify-center p-6 text-center text-slate-400">
        No active pujas available at this moment.
      </div>
    )
  }

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % pujas.length)
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + pujas.length) % pujas.length)
  }

  const currentPuja = pujas[currentIndex]
  const imageUrl = currentPuja.images?.[0] || 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=900'

  return (
    <div className="relative group aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden border-4 border-amber-200 shadow-2xl shadow-amber-500/10 bg-white select-none">
      
      {/* Dynamic slide link wrapping the entire banner */}
      <Link href={`/pujas/${currentPuja.slug}`} className="block h-full w-full relative">
        {/* Banner image */}
        <img
          src={imageUrl}
          alt={currentPuja.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* "SWIPE →" gesture badge */}
        <div className="absolute top-4 right-4 bg-orange-600/90 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full shadow backdrop-blur-sm animate-pulse">
          SWIPE →
        </div>

        {/* Content details at the bottom of the banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-4 text-white text-left">
          
          <div className="space-y-2">
            <Badge className="bg-orange-500 text-white font-bold text-[10px] uppercase border-none tracking-wide">
              {currentPuja.category?.name || 'विशेष अनुष्ठान'}
            </Badge>
            <h3 className="text-xl md:text-2xl font-black leading-tight text-white line-clamp-2">
              {currentPuja.title}
            </h3>
            {currentPuja.description && (
              <p className="text-xs text-slate-300 line-clamp-2">
                {currentPuja.description}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold text-slate-200 border-t border-white/10 pt-3">
            {currentPuja.temple && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-orange-500" />
                {currentPuja.temple.name}, {currentPuja.temple.location}
              </span>
            )}
            {currentPuja.date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-orange-500" />
                {new Date(currentPuja.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long' })}
              </span>
            )}
          </div>

          {/* Count Down Urgency Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Timer className="h-4 w-4 text-orange-500 animate-spin" />
              <span>बुकिंग समाप्त होने का समय:</span>
            </div>
            <span className="text-xs font-black text-orange-400 uppercase tracking-wider animate-pulse">
              जल्दी करें! Limited slots
            </span>
          </div>

          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black py-5 rounded-xl shadow-lg shadow-orange-500/20">
            पूजा पैकेज चुनें (Select Package) →
          </Button>

        </div>
      </Link>

      {/* Left/Right navigation arrows */}
      {pujas.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-orange-600/90 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-orange-600/90 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Bottom pagination indicators */}
      {pujas.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {pujas.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(idx)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-orange-500' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  )
}
