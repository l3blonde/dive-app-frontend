"use client"

import { useState } from "react"
import { Bookmark, Star } from "lucide-react"
import type { DiveSite } from "@/lib/types"

interface BottomSheetProps {
    diveSites: DiveSite[]
    onClose?: () => void
    onViewDetails?: (site: DiveSite) => void
    onAddToPlan?: (site: DiveSite) => void
}

const FILTER_CHIPS = ["Sort", "Nearby", "Dive Sites", "Dive Trips", "Marine Life"]

export function BottomSheet({ diveSites, onClose, onViewDetails, onAddToPlan }: BottomSheetProps) {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(["Nearby"])
    const [dragStart, setDragStart] = useState(0)
    const [sheetHeight, setSheetHeight] = useState<"collapsed" | "half" | "full">("half")

    const toggleFilter = (chip: string) => {
        if (chip === "Sort") {
            // Sort is single-select only
            setSelectedFilters(["Sort"])
        } else if (selectedFilters.includes(chip)) {
            setSelectedFilters(selectedFilters.filter((f) => f !== chip))
        } else {
            // Remove Sort if selecting other filters
            const filtered = selectedFilters.filter((f) => f !== "Sort")
            setSelectedFilters([...filtered, chip])
        }
    }

    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
        setDragStart(clientY)
    }

    const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
        const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY
        const diff = dragStart - clientY

        if (diff > 50) {
            setSheetHeight("full")
        } else if (diff < -50) {
            setSheetHeight("collapsed")
        }
    }

    const getHeight = () => {
        switch (sheetHeight) {
            case "collapsed":
                return "auto"
            case "half":
                return "55vh"
            case "full":
                return "85vh"
        }
    }

    return (
        <div
            style={{
                position: "fixed",
                bottom: "90px",
                left: 0,
                right: 0,
                maxHeight: getHeight(),
                height: getHeight(),
                background: "rgba(6, 43, 61, 0.4)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: "28px 28px 0 0",
                border: "1px solid rgba(0, 194, 215, 0.15)",
                borderBottom: "none",
                zIndex: 997,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 -8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
            }}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
        >
            {/* Drag Handle with Glow */}
            <div
                style={{
                    padding: "12px 0",
                    display: "flex",
                    justifyContent: "center",
                    cursor: "grab",
                }}
            >
                <div
                    style={{
                        width: "48px",
                        height: "4px",
                        background: "rgba(0, 194, 215, 0.4)",
                        borderRadius: "2px",
                        transition: "all 0.2s ease-out",
                    }}
                />
            </div>

            {/* Filter Chips - Always Visible */}
            <div
                style={{
                    padding: "0 16px 12px 16px",
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    flexShrink: 0,
                }}
                className="hide-scrollbar"
            >
                {FILTER_CHIPS.map((chip) => {
                    const isActive = selectedFilters.includes(chip)
                    return (
                        <button
                            key={chip}
                            onClick={() => toggleFilter(chip)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "9999px",
                                border: isActive ? "1.5px solid rgba(0, 194, 215, 0.6)" : "1px solid rgba(255, 255, 255, 0.15)",
                                background: isActive ? "rgba(0, 194, 215, 0.2)" : "rgba(255, 255, 255, 0.05)",
                                color: isActive ? "#00C2D7" : "rgba(255, 255, 255, 0.7)",
                                fontSize: "12px",
                                fontWeight: isActive ? "600" : "500",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s ease-out",
                                flexShrink: 0,
                                boxShadow: isActive ? "0 0 12px rgba(0, 194, 215, 0.3)" : "none",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = isActive ? "rgba(0, 194, 215, 0.3)" : "rgba(255, 255, 255, 0.1)"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = isActive ? "rgba(0, 194, 215, 0.2)" : "rgba(255, 255, 255, 0.05)"
                            }}
                        >
                            {chip}
                        </button>
                    )
                })}
            </div>

            {/* Dive Sites List */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "8px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
                className="hide-scrollbar"
            >
                {diveSites.map((site) => (
                    <div
                        key={site.id}
                        style={{
                            background: "rgba(6, 43, 61, 0.5)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(0, 194, 215, 0.1)",
                            borderRadius: "16px",
                            overflow: "hidden",
                            transition: "all 0.2s ease-out",
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLDivElement
                            el.style.background = "rgba(6, 43, 61, 0.6)"
                            el.style.borderColor = "rgba(0, 194, 215, 0.25)"
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLDivElement
                            el.style.background = "rgba(6, 43, 61, 0.5)"
                            el.style.borderColor = "rgba(0, 194, 215, 0.1)"
                        }}
                    >
                        <div style={{ display: "flex", gap: "12px", padding: "12px" }}>
                            {/* Thumbnail */}
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "12px",
                                    background: `linear-gradient(135deg, rgba(0, 194, 215, 0.3) 0%, rgba(8, 59, 83, 0.5) 100%), url(${site.image_url || "https://xu5qaaigiohvkyk8.public.blob.vercel-storage.com/site-placeholder.png"})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    flexShrink: 0,
                                }}
                            />

                            {/* Info Section */}
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <h3
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "white",
                                            margin: 0,
                                        }}
                                    >
                                        {site.name}
                                    </h3>
                                    <button
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "2px",
                                        }}
                                    >
                                        <Bookmark size={16} color="rgba(255, 255, 255, 0.5)" />
                                    </button>
                                </div>

                                {/* Rating */}
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <div style={{ display: "flex", gap: "2px" }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                fill={i < Math.floor(site.rating || 0) ? "#FFD700" : "rgba(255, 255, 255, 0.2)"}
                                                color={i < Math.floor(site.rating || 0) ? "#FFD700" : "rgba(255, 255, 255, 0.2)"}
                                            />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}>
                                        {(site.rating || 0).toFixed(1)} ({site.dives_count || 0})
                                    </span>
                                </div>

                                {/* Details */}
                                <p
                                    style={{
                                        fontSize: "11px",
                                        color: "rgba(255, 255, 255, 0.6)",
                                        margin: 0,
                                    }}
                                >
                                    {site.depth}m · {site.visibility}
                                </p>

                                {/* Marine Life Tags */}
                                {(() => {
                                    let marineLifeArr: string[] = []
                                    try {
                                        if (typeof site.marine_life === "string" && site.marine_life) {
                                            marineLifeArr = JSON.parse(site.marine_life)
                                        } else if (Array.isArray(site.marine_life)) {
                                            marineLifeArr = site.marine_life
                                        }
                                    } catch {}
                                    return marineLifeArr.length > 0 ? (
                                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                            {marineLifeArr.slice(0, 3).map((species: string, idx: number) => (
                                                <span
                                                    key={`${species}-${idx}`}
                                                    style={{
                                                        fontSize: "10px",
                                                        background: "rgba(0, 194, 215, 0.15)",
                                                        color: "#00C2D7",
                                                        padding: "2px 8px",
                                                        borderRadius: "9999px",
                                                        border: "0.5px solid rgba(0, 194, 215, 0.3)",
                                                        textTransform: "capitalize",
                                                    }}
                                                >
                                                    {species.replace(/-/g, " ")}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null
                                })()}
                            </div>

                            {/* Distance Badge */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    padding: "4px 8px",
                                    background: "rgba(0, 194, 215, 0.1)",
                                    borderRadius: "8px",
                                    fontSize: "11px",
                                    color: "#00C2D7",
                                    fontWeight: "600",
                                }}
                            >
                                {site.distance || "?"} km
                            </div>
                        </div>

                        {/* CTAs */}
                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                                padding: "0 12px 12px 12px",
                            }}
                        >
                            <button
                                onClick={() => onAddToPlan?.(site)}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(0, 194, 215, 0.4)",
                                    background: "transparent",
                                    color: "#00C2D7",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-out",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(0, 194, 215, 0.1)"
                                    e.currentTarget.style.borderColor = "rgba(0, 194, 215, 0.6)"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent"
                                    e.currentTarget.style.borderColor = "rgba(0, 194, 215, 0.4)"
                                }}
                            >
                                Add to Plan
                            </button>
                            <button
                                onClick={() => onViewDetails?.(site)}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    background: "rgba(0, 194, 215, 0.25)",
                                    color: "#00C2D7",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-out",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(0, 194, 215, 0.35)"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(0, 194, 215, 0.25)"
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
