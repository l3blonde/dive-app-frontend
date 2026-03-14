"use client"

import { useState } from "react"
import { Bookmark, Star, SlidersHorizontal } from "lucide-react"
import type { DiveSite } from "@/lib/types"
import { DiveTripCard, type DiveTrip } from "@/components/dive-trip/dive-trip-card"
import { SortDropdown, type SortOption } from "./sort-dropdown"
import { FilterPanel, type FilterState } from "./filter-panel"

interface BottomSheetProps {
    diveSites: DiveSite[]
    diveTrips?: DiveTrip[]
    onClose?: () => void
    onViewDetails?: (site: DiveSite) => void
    onAddToPlan?: (site: DiveSite) => void
    onViewTripDetails?: (trip: DiveTrip) => void
    onAddTripToPlan?: (trip: DiveTrip) => void
}

type ContentType = "Dive Sites" | "Dive Trips" | "Marine Life"

const CONTENT_CHIPS: ContentType[] = ["Dive Sites", "Dive Trips", "Marine Life"]

// Mock dive trips for now (until Supabase is connected)
const MOCK_DIVE_TRIPS: DiveTrip[] = [
    {
        id: "1",
        name: "Dhigurah Island Trip",
        type: "Land-based",
        difficulty: "Beginner",
        start_date: "2026-04-07",
        end_date: "2026-04-11",
        description: "Relaxed island vibe + chance to see whale sharks, manta rays, and reef sharks.",
        marine_life: '["whale-shark","manta-ray","reef-shark"]',
        price_usd: 1450,
        spots_total: 12,
        spots_left: 8,
        image_url: "/images/trips/dhigurah.jpg",
        location: "Dhigurah, Maldives",
        rating: 4.9,
        review_count: 214,
    },
    {
        id: "2",
        name: "Maldives Liveaboard",
        type: "Liveaboard",
        difficulty: "Advanced",
        start_date: "2026-04-15",
        end_date: "2026-04-22",
        description: "Remote reefs + chance to see whale sharks, manta rays, and tiger sharks.",
        marine_life: '["whale-shark","manta-ray","tiger-shark"]',
        price_usd: 2290,
        spots_total: 16,
        spots_left: 6,
        image_url: "/images/trips/liveaboard.jpg",
        location: "Male Atoll, Maldives",
        rating: 4.8,
        review_count: 156,
    },
    {
        id: "3",
        name: "Raja Ampat Explorer",
        type: "Liveaboard",
        difficulty: "Intermediate",
        start_date: "2026-05-15",
        end_date: "2026-05-24",
        description: "The most biodiverse marine region on Earth. Over 1,500 fish species.",
        marine_life: '["manta-ray","wobbegong-shark","pygmy-seahorse"]',
        price_usd: 3450,
        spots_total: 14,
        spots_left: 6,
        image_url: "/images/trips/raja-ampat.jpg",
        location: "Raja Ampat, Indonesia",
        rating: 5.0,
        review_count: 287,
    },
]

export function BottomSheet({ 
    diveSites, 
    diveTrips = MOCK_DIVE_TRIPS,
    onClose, 
    onViewDetails, 
    onAddToPlan,
    onViewTripDetails,
    onAddTripToPlan,
}: BottomSheetProps) {
    const [activeContent, setActiveContent] = useState<ContentType>("Dive Sites")
    const [isNearby, setIsNearby] = useState(true)
    const [sortOption, setSortOption] = useState<SortOption>("distance")
    const [sheetHeight, setSheetHeight] = useState<"collapsed" | "half" | "full">("half")
    const [dragStart, setDragStart] = useState(0)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filters, setFilters] = useState<FilterState>({
        depthRange: [0, 60],
        difficulty: [],
        distanceRadius: 100,
        tripType: [],
        priceRange: [0, 5000],
    })

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

    const getContentCount = () => {
        switch (activeContent) {
            case "Dive Sites":
                return diveSites.length
            case "Dive Trips":
                return diveTrips.length
            case "Marine Life":
                return diveSites.length // Placeholder
        }
    }

    const chipStyle = (isActive: boolean): React.CSSProperties => ({
        padding: "8px 14px",
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
    })

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    bottom: "90px",
                    left: 0,
                    right: 0,
                    maxHeight: getHeight(),
                    height: getHeight(),
                    background: "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(0,194,215,0.08) 0%, rgba(4,24,38,0.85) 50%, rgba(4,24,38,0.92) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: "28px 28px 0 0",
                    border: "1.5px solid rgba(0, 194, 215, 0.35)",
                    borderBottom: "none",
                    zIndex: 997,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: [
                        "0 0 20px rgba(0, 194, 215, 0.3)",
                        "0 -8px 40px rgba(0, 0, 0, 0.5)",
                        "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                    ].join(", "),
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
                            background: "rgba(0, 194, 215, 0.5)",
                            borderRadius: "2px",
                            boxShadow: "0 0 8px rgba(0, 194, 215, 0.4)",
                        }}
                    />
                </div>

                {/* Filter Row: Filter icon + Sort + Nearby + Content chips */}
                <div
                    style={{
                        padding: "0 12px 12px 12px",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        flexShrink: 0,
                    }}
                    className="hide-scrollbar"
                >
                    {/* Filter Icon Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            border: "1px solid rgba(0, 194, 215, 0.4)",
                            background: "rgba(0, 194, 215, 0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                            boxShadow: "0 0 10px rgba(0, 194, 215, 0.25)",
                            transition: "all 0.2s ease-out",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(0, 194, 215, 0.25)"
                            e.currentTarget.style.boxShadow = "0 0 16px rgba(0, 194, 215, 0.4)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(0, 194, 215, 0.15)"
                            e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 194, 215, 0.25)"
                        }}
                    >
                        <SlidersHorizontal size={16} color="#00C2D7" />
                    </button>

                    {/* Sort Dropdown */}
                    <SortDropdown value={sortOption} onChange={setSortOption} />

                    {/* Nearby Toggle */}
                    <button
                        onClick={() => setIsNearby(!isNearby)}
                        style={chipStyle(isNearby)}
                    >
                        Nearby
                    </button>

                    {/* Content Type Chips */}
                    {CONTENT_CHIPS.map((chip) => (
                        <button
                            key={chip}
                            onClick={() => setActiveContent(chip)}
                            style={chipStyle(activeContent === chip)}
                        >
                            {chip}
                        </button>
                    ))}
                </div>

                {/* Content Header */}
                <div
                    style={{
                        padding: "0 16px 8px 16px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#00C2D7",
                            textShadow: "0 0 8px rgba(0, 194, 215, 0.4)",
                        }}
                    >
                        {getContentCount()} {activeContent.toLowerCase()}
                    </span>
                </div>

                {/* Content List */}
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
                    {/* Dive Sites */}
                    {activeContent === "Dive Sites" && diveSites.map((site) => (
                        <DiveSiteCard
                            key={site.id}
                            site={site}
                            onViewDetails={onViewDetails}
                            onAddToPlan={onAddToPlan}
                        />
                    ))}

                    {/* Dive Trips */}
                    {activeContent === "Dive Trips" && diveTrips.map((trip) => (
                        <DiveTripCard
                            key={trip.id}
                            trip={trip}
                            onViewDetails={onViewTripDetails}
                            onAddToPlan={onAddTripToPlan}
                        />
                    ))}

                    {/* Marine Life - Placeholder */}
                    {activeContent === "Marine Life" && (
                        <div style={{ 
                            padding: "40px 20px", 
                            textAlign: "center",
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: "14px",
                        }}>
                            Marine life sightings coming soon...
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Panel */}
            <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onApply={setFilters}
            />
        </>
    )
}

// Extracted Dive Site Card component
function DiveSiteCard({ 
    site, 
    onViewDetails, 
    onAddToPlan 
}: { 
    site: DiveSite
    onViewDetails?: (site: DiveSite) => void
    onAddToPlan?: (site: DiveSite) => void
}) {
    let marineLifeArr: string[] = []
    try {
        if (typeof site.marine_life === "string" && site.marine_life) {
            marineLifeArr = JSON.parse(site.marine_life)
        } else if (Array.isArray(site.marine_life)) {
            marineLifeArr = site.marine_life
        }
    } catch {}

    return (
        <div
            style={{
                background: "rgba(6, 43, 61, 0.5)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(0, 194, 215, 0.2)",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "all 0.2s ease-out",
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = "rgba(6, 43, 61, 0.65)"
                el.style.borderColor = "rgba(0, 194, 215, 0.35)"
                el.style.boxShadow = "0 0 16px rgba(0, 194, 215, 0.2)"
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = "rgba(6, 43, 61, 0.5)"
                el.style.borderColor = "rgba(0, 194, 215, 0.2)"
                el.style.boxShadow = "none"
            }}
        >
            <div style={{ display: "flex", gap: "12px", padding: "12px" }}>
                {/* Thumbnail */}
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "12px",
                        background: `linear-gradient(135deg, rgba(0, 194, 215, 0.3) 0%, rgba(8, 59, 83, 0.5) 100%), url(${site.image_url || "/images/dive-placeholder.jpg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        flexShrink: 0,
                        border: "1px solid rgba(0, 194, 215, 0.15)",
                    }}
                />

                {/* Info Section */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h3
                            style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "white",
                                margin: 0,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
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
                                    size={11}
                                    fill={i < Math.floor(site.rating || 0) ? "#FFD700" : "rgba(255, 255, 255, 0.2)"}
                                    color={i < Math.floor(site.rating || 0) ? "#FFD700" : "rgba(255, 255, 255, 0.2)"}
                                />
                            ))}
                        </div>
                        <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}>
                            {(site.rating || 0).toFixed(1)} ({site.dives_count || 0})
                        </span>
                        <span style={{ fontSize: "11px", color: "rgba(0, 194, 215, 0.8)", marginLeft: "auto" }}>
                            {site.distance || "?"} km
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
                        Depth {site.depth}m · {site.visibility}
                    </p>

                    {/* Marine Life Tags */}
                    {marineLifeArr.length > 0 && (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}>
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
                    )}
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
                        borderRadius: "9999px",
                        border: "1px solid rgba(0, 194, 215, 0.5)",
                        background: "transparent",
                        color: "#00C2D7",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease-out",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(0, 194, 215, 0.15)"
                        e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 194, 215, 0.3)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                        e.currentTarget.style.boxShadow = "none"
                    }}
                >
                    Add to Plan
                </button>
                <button
                    onClick={() => onViewDetails?.(site)}
                    style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "9999px",
                        border: "1.5px solid rgba(0, 194, 215, 0.6)",
                        background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,194,215,0.25) 0%, rgba(0,194,215,0.12) 100%)",
                        color: "#00C2D7",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 0 10px rgba(0, 194, 215, 0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                        transition: "all 0.2s ease-out",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 18px rgba(0, 194, 215, 0.55), inset 0 1px 0 rgba(255,255,255,0.15)"
                        e.currentTarget.style.borderColor = "rgba(0, 194, 215, 0.8)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 194, 215, 0.35), inset 0 1px 0 rgba(255,255,255,0.1)"
                        e.currentTarget.style.borderColor = "rgba(0, 194, 215, 0.6)"
                    }}
                >
                    View Details
                </button>
            </div>
        </div>
    )
}
