"use client"

import { useState, useRef, useEffect } from "react"
import { Star, BookmarkPlus, ArrowRight } from "lucide-react"
import type { DiveSite } from "@/lib/types"
import type { LucideIcon } from "lucide-react"

interface SiteCarouselProps {
    sites: DiveSite[]
    onCardClick: (site: DiveSite) => void
    onClose: () => void
    getDifficultyIcon: (difficulty: string) => LucideIcon
    onIndexChange: (index: number) => void
}

export function SiteCarousel({ sites, onCardClick, onClose, getDifficultyIcon, onIndexChange }: SiteCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    // Track scroll position to update pagination dots
    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        const handleScroll = () => {
            const cardWidth = 300 + 16 // card width + gap
            const index = Math.round(container.scrollLeft / cardWidth)
            setActiveIndex(index)
            onIndexChange(index)
        }

        container.addEventListener("scroll", handleScroll, { passive: true })
        return () => container.removeEventListener("scroll", handleScroll)
    }, [onIndexChange])

    const scrollToIndex = (index: number) => {
        const container = scrollContainerRef.current
        if (!container) return
        const cardWidth = 300 + 16
        container.scrollTo({ left: index * cardWidth, behavior: "smooth" })
    }

    return (
        <div
            style={{
                position: "fixed",
                bottom: "100px",
                left: 0,
                right: 0,
                zIndex: 1000,
            }}
        >
            {/* Card scroll strip */}
            <div
                ref={scrollContainerRef}
                style={{
                    display: "flex",
                    gap: "16px",
                    padding: "12px 20px",
                    overflowX: "auto",
                    overflowY: "hidden",
                    WebkitOverflowScrolling: "touch",
                    scrollSnapType: "x mandatory",
                    scrollBehavior: "smooth",
                    // hide scrollbar
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                }}
            >
                {sites.map((site, index) => (
                    <CarouselCard
                        key={site.id}
                        site={site}
                        onViewDetails={() => {
                            onCardClick(site)
                            onClose()
                        }}
                        onAddToPlan={() => {
                            // Plan action — wired up later
                        }}
                    />
                ))}
            </div>

            {/* Pagination dots */}
            {sites.length > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "6px",
                        marginTop: "8px",
                    }}
                >
                    {sites.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            style={{
                                width: i === activeIndex ? "20px" : "6px",
                                height: "6px",
                                borderRadius: "3px",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                background: i === activeIndex ? "#1A2744" : "rgba(255,255,255,0.6)",
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Individual card ──────────────────────────────────────────────────────────

interface CarouselCardProps {
    site: DiveSite
    onViewDetails: () => void
    onAddToPlan: () => void
}

function CarouselCard({ site, onViewDetails, onAddToPlan }: CarouselCardProps) {
    const [hovered, setHovered] = useState(false)

    // Generate a deterministic-ish rating from site id
    const rating = ((site.id?.charCodeAt(0) ?? 70) % 15) / 10 + 4.0
    const ratingDisplay = Math.min(rating, 5.0).toFixed(1)

    // Dive count fallback
    const diveCount = (site as any).dive_count ?? (site as any).number_of_dives ?? "—"

    return (
        <div
            style={{
                minWidth: "300px",
                width: "320px",
                height: "200px",
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                scrollSnapAlign: "center",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: hovered ? "0 12px 32px rgba(0, 194, 215, 0.25)" : "0 4px 12px rgba(0, 194, 215, 0.1)",
                transition: "all 0.3s ease",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Background image */}
            <div
                style={{
                    backgroundImage: `url(${site.image_url || "https://xu5qaaigiohvkyk8.public.blob.vercel-storage.com/site-placeholder.png"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            />

            {/* Gradient overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
                }}
            />

            {/* Rating badge - top right */}
            <div
                style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(255, 215, 0, 0.9)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "20px",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "white",
                }}
            >
                <span>⭐</span>
                <span>{ratingDisplay}</span>
                <span style={{ fontSize: "11px", opacity: 0.9 }}>({diveCount})</span>
            </div>

            {/* Bottom content area */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "16px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                }}
            >
                {/* Site name & location */}
                <h3 style={{ color: "white", fontSize: "15px", fontWeight: "700", margin: "0 0 4px 0" }}>
                    {site.name}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: "0 0 8px 0" }}>
                    {site.location_name}
                </p>

                {/* Site info chips */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.2)", color: "white", padding: "3px 8px", borderRadius: "6px" }}>
                        {site.max_depth || "—"}m depth
                    </span>
                    <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.2)", color: "white", padding: "3px 8px", borderRadius: "6px" }}>
                        Excellent visibility
                    </span>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToPlan()
                        }}
                        style={{
                            flex: 1,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.4)",
                            background: "rgba(255, 255, 255, 0.15)",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
                        }}
                    >
                        ★ Add to Plan
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewDetails()
                        }}
                        style={{
                            flex: 1,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "none",
                            background: "rgba(0, 194, 215, 0.8)",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(0, 194, 215, 1)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(0, 194, 215, 0.8)"
                        }}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    )
}
