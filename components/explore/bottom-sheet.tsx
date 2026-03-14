"use client"

import { useState } from "react"
import { Bookmark, Star, SlidersHorizontal, X, Fish, MapPin, Anchor, ChevronDown } from "lucide-react"
import type { DiveSite, MarineSpecies } from "@/lib/types"
import { DiveTripCard, type DiveTrip } from "@/components/cards/dive-trip-card"
import { DiveSiteCard } from "@/components/cards/dive-site-card"
import { MarineSpeciesCard } from "@/components/cards/marine-species-card"
import { MARINE_SPECIES_LIST } from "@/lib/data/marine-species"
import { MOCK_DIVE_TRIPS } from "@/lib/data/dive-trips"

export type SortOption = "distance" | "rating" | "newest" | "difficulty"

interface BottomSheetProps {
    diveSites: DiveSite[]
    onClose?: () => void
    onViewDetails?: (site: DiveSite) => void
    onAddToPlan?: (site: DiveSite) => void
    onViewTripDetails?: (trip: DiveTrip) => void
    onAddTripToPlan?: (trip: DiveTrip) => void
    activeContentType: "Dive Sites" | "Dive Trips" | "Marine Life"
    onContentTypeChange: (type: "Dive Sites" | "Dive Trips" | "Marine Life") => void
    isNearbyActive: boolean
    onNearbyChange: (active: boolean) => void
    sortOption: SortOption
    onSortChange: (option: SortOption) => void
}

type ContentType = "Dive Sites" | "Dive Trips" | "Marine Life"
const CONTENT_CHIPS: ContentType[] = ["Dive Sites", "Dive Trips", "Marine Life"]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "rating", label: "Rating" },
    { value: "distance", label: "Distance" },
    { value: "newest", label: "Newest" },
    { value: "difficulty", label: "Difficulty" },
]

// ── filter-panel state ──────────────────────────────────────────────────────
interface FilterState {
    depthRange: [number, number]
    difficulty: string[]
    tripType: string[]
}
const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"]
const TRIP_TYPE_OPTIONS = ["Land-based", "Liveaboard", "Day Trip"]

// ── shared chip style ───────────────────────────────────────────────────────
function chipStyle(isActive: boolean): React.CSSProperties {
    return {
        padding: "8px 16px",
        borderRadius: "9999px",
        border: isActive ? "1.5px solid rgba(0, 194, 215, 0.65)" : "1px solid rgba(255, 255, 255, 0.15)",
        background: isActive
            ? "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,194,215,0.25) 0%, rgba(0,194,215,0.12) 100%)"
            : "rgba(255, 255, 255, 0.05)",
        color: isActive ? "#00C2D7" : "rgba(255, 255, 255, 0.7)",
        fontSize: "12px",
        fontWeight: isActive ? "600" : "500",
        cursor: "pointer",
        whiteSpace: "nowrap" as const,
        transition: "all 0.25s ease-out",
        flexShrink: 0,
        boxShadow: isActive
            ? "0 0 10px rgba(0, 194, 215, 0.6), 0 0 20px rgba(0, 194, 215, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "none",
    }
}

// ── main component ──────────────────────────────────────────────────────────
export function BottomSheet({
    diveSites,
    onClose,
    onViewDetails,
    onAddToPlan,
    onViewTripDetails,
    onAddTripToPlan,
    activeContentType,
    onContentTypeChange,
    isNearbyActive,
    onNearbyChange,
    sortOption,
    onSortChange,
}: BottomSheetProps) {
    const [sheetHeight, setSheetHeight] = useState<"half" | "full">("half")
    const [dragStart, setDragStart] = useState(0)
    const [showFilter, setShowFilter] = useState(false)
    const [showSort, setShowSort] = useState(false)
    const [filters, setFilters] = useState<FilterState>({ depthRange: [0, 60], difficulty: [], tripType: [] })
    const [localFilters, setLocalFilters] = useState<FilterState>({ depthRange: [0, 60], difficulty: [], tripType: [] })

    const handleDragStart = (e: React.TouchEvent) => setDragStart(e.touches[0].clientY)
    const handleDragEnd = (e: React.TouchEvent) => {
        const diff = dragStart - e.changedTouches[0].clientY
        if (diff > 50) setSheetHeight("full")
        else if (diff < -50) setSheetHeight("half")
    }

    const getHeight = () => sheetHeight === "full" ? "85vh" : "55vh"

    // Apply filters to content
    const filteredSites = diveSites.filter((s) => {
        if (filters.difficulty.length > 0 && !filters.difficulty.map(d => d.toLowerCase()).includes(s.difficulty)) return false
        if (s.max_depth < filters.depthRange[0] || s.min_depth > filters.depthRange[1]) return false
        return true
    })
    const filteredTrips = MOCK_DIVE_TRIPS.filter((t) => {
        if (filters.difficulty.length > 0 && !filters.difficulty.includes(t.difficulty || "")) return false
        if (filters.tripType.length > 0 && !filters.tripType.includes(t.type)) return false
        return true
    })
    const filteredSpecies = MARINE_SPECIES_LIST

    const getContentCount = () => {
        if (activeContentType === "Dive Sites") return filteredSites.length
        if (activeContentType === "Dive Trips") return filteredTrips.length
        return filteredSpecies.length
    }

    const handleApplyFilter = () => {
        setFilters(localFilters)
        setShowFilter(false)
    }
    const handleResetFilter = () => {
        const reset: FilterState = { depthRange: [0, 60], difficulty: [], tripType: [] }
        setLocalFilters(reset)
        setFilters(reset)
    }
    const toggleDifficulty = (d: string) => setLocalFilters(prev => ({
        ...prev,
        difficulty: prev.difficulty.includes(d) ? prev.difficulty.filter(x => x !== d) : [...prev.difficulty, d],
    }))
    const toggleTripType = (t: string) => setLocalFilters(prev => ({
        ...prev,
        tripType: prev.tripType.includes(t) ? prev.tripType.filter(x => x !== t) : [...prev.tripType, t],
    }))

    const filterBtnStyle: React.CSSProperties = {
        width: "40px", height: "40px", borderRadius: "50%",
        border: "1.5px solid rgba(0, 194, 215, 0.6)",
        background: showFilter
            ? "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(0,194,215,0.3) 30%, rgba(4,24,38,0.65))"
            : "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3), rgba(0,194,215,0.2) 30%, rgba(4,24,38,0.65))",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
        boxShadow: [
            "0 0 12px rgba(0, 194, 215, 0.8)", "0 0 28px rgba(0, 194, 215, 0.4)",
            "inset 0 0 12px rgba(0, 194, 215, 0.2)", "inset 2px 2px 6px rgba(255,255,255,0.2)",
        ].join(", "),
        transition: "all 0.2s ease-out",
    }

    return (
        <div
            style={{
                position: "fixed", bottom: "90px", left: 0, right: 0,
                height: getHeight(),
                background: "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(0,194,215,0.15) 0%, rgba(6,43,61,0.8) 40%, rgba(4,24,38,0.95) 100%)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                borderRadius: "28px 28px 0 0",
                border: "2px solid rgba(0, 194, 215, 0.55)", borderBottom: "none",
                zIndex: 997, display: "flex", flexDirection: "column",
                boxShadow: [
                    "0 0 16px rgba(0, 194, 215, 0.6)", "0 0 32px rgba(0, 194, 215, 0.3)",
                    "0 0 48px rgba(0, 194, 215, 0.15)", "0 -8px 40px rgba(0, 0, 0, 0.6)",
                    "inset 0 2px 8px rgba(255, 255, 255, 0.1)", "inset 0 -1px 0 rgba(0, 0, 0, 0.3)",
                ].join(", "),
                transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
            }}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
        >
            {/* Drag Handle */}
            <div style={{ padding: "12px 0", display: "flex", justifyContent: "center", cursor: "grab", flexShrink: 0 }}>
                <div style={{
                    width: "48px", height: "4px", background: "rgba(0, 194, 215, 0.7)", borderRadius: "2px",
                    boxShadow: "0 0 12px rgba(0, 194, 215, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
                }} />
            </div>

            {/* ── Chips Row ─────────────────────────────────────────────────── */}
            <div style={{
                padding: "0 12px 10px 12px", display: "flex", gap: "8px", alignItems: "center",
                overflowX: "auto", scrollbarWidth: "none", flexShrink: 0,
            }} className="hide-scrollbar">

                {/* Filter button */}
                <button onClick={() => setShowFilter(!showFilter)} style={filterBtnStyle}>
                    <SlidersHorizontal size={18} color="#00C2D7" strokeWidth={1.8} />
                </button>

                {/* Sort chip */}
                <button
                    onClick={() => setShowSort(!showSort)}
                    style={{
                        ...chipStyle(showSort),
                        display: "flex", alignItems: "center", gap: "4px",
                    }}
                >
                    Sort
                    <ChevronDown size={12} style={{ transform: showSort ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {/* Nearby chip */}
                <button onClick={() => onNearbyChange(!isNearbyActive)} style={chipStyle(isNearbyActive)}>
                    Nearby
                </button>

                {/* Content type chips */}
                {CONTENT_CHIPS.map((chip) => (
                    <button
                        key={chip}
                        onClick={() => { onContentTypeChange(chip); setShowFilter(false); setShowSort(false) }}
                        style={chipStyle(activeContentType === chip)}
                    >
                        {chip}
                    </button>
                ))}
            </div>

            {/* ── Sort Panel (inline, inside sheet) ─────────────────────────── */}
            {showSort && (
                <div style={{
                    margin: "0 12px 10px 12px", borderRadius: "16px",
                    border: "1px solid rgba(0, 194, 215, 0.3)",
                    background: "rgba(4, 24, 38, 0.7)", backdropFilter: "blur(12px)",
                    padding: "10px", display: "flex", gap: "8px", flexWrap: "wrap", flexShrink: 0,
                    boxShadow: "0 0 16px rgba(0, 194, 215, 0.2)",
                }}>
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { onSortChange(opt.value); setShowSort(false) }}
                            style={chipStyle(sortOption === opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Filter Panel (inline, inside sheet) ───────────────────────── */}
            {showFilter && (
                <div style={{
                    margin: "0 12px 10px 12px", borderRadius: "16px",
                    border: "1px solid rgba(0, 194, 215, 0.3)",
                    background: "rgba(4, 24, 38, 0.75)", backdropFilter: "blur(16px)",
                    padding: "16px", flexShrink: 0,
                    boxShadow: "0 0 20px rgba(0, 194, 215, 0.25)",
                }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>Filters</span>
                        <button
                            onClick={() => setShowFilter(false)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
                        >
                            <X size={16} color="rgba(255,255,255,0.6)" />
                        </button>
                    </div>

                    {/* Depth Range */}
                    <div style={{ marginBottom: "14px" }}>
                        <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                            Depth: {localFilters.depthRange[0]}m – {localFilters.depthRange[1]}m
                        </label>
                        <input type="range" min={0} max={60} value={localFilters.depthRange[1]}
                            onChange={(e) => setLocalFilters(p => ({ ...p, depthRange: [0, +e.target.value] }))}
                            style={{ width: "100%", accentColor: "#00C2D7" }} />
                    </div>

                    {/* Difficulty */}
                    <div style={{ marginBottom: "14px" }}>
                        <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "8px" }}>Difficulty</label>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {DIFFICULTY_OPTIONS.map((d) => (
                                <button key={d} onClick={() => toggleDifficulty(d)} style={chipStyle(localFilters.difficulty.includes(d))}>{d}</button>
                            ))}
                        </div>
                    </div>

                    {/* Trip Type */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "8px" }}>Trip Type</label>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {TRIP_TYPE_OPTIONS.map((t) => (
                                <button key={t} onClick={() => toggleTripType(t)} style={chipStyle(localFilters.tripType.includes(t))}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={handleResetFilter} style={{
                            flex: 1, padding: "10px", borderRadius: "9999px",
                            border: "1px solid rgba(255,255,255,0.25)", background: "transparent",
                            color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                        }}>Reset</button>
                        <button onClick={handleApplyFilter} style={{
                            flex: 2, padding: "10px", borderRadius: "9999px",
                            border: "1.5px solid rgba(0, 194, 215, 0.7)",
                            background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,194,215,0.3) 0%, rgba(0,194,215,0.15) 100%)",
                            color: "#00C2D7", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                            boxShadow: "0 0 12px rgba(0, 194, 215, 0.4)",
                        }}>Apply Filters</button>
                    </div>
                </div>
            )}

            {/* ── Content count header ───���───────────────────────────────────── */}
            <div style={{ padding: "0 16px 8px", textAlign: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#00C2D7", textShadow: "0 0 8px rgba(0,194,215,0.4)" }}>
                    {getContentCount()} {activeContentType.toLowerCase()}
                    {isNearbyActive && " · nearby"}
                </span>
            </div>

            {/* ── Scrollable content list ────────────────────────────────────── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px", display: "flex", flexDirection: "column", gap: "12px" }}
                className="hide-scrollbar">

                    {/* Dive Sites */}
                    {activeContentType === "Dive Sites" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflow: "auto", flex: 1 }}>
                            {filteredSites.length > 0 ? (
                                filteredSites.map((site) => (
                                    <DiveSiteCard
                                        key={site.id}
                                        site={site}
                                        onViewDetails={onViewDetails}
                                        onAddToPlan={onAddToPlan}
                                    />
                                ))
                            ) : (
                                <div style={{ padding: "40px 20px", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                                    No dive sites found
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dive Trips */}
                    {activeContentType === "Dive Trips" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflow: "auto", flex: 1 }}>
                            {filteredTrips.length > 0 ? (
                                filteredTrips.map((trip) => (
                                    <DiveTripCard
                                        key={trip.id}
                                        trip={trip}
                                        onViewDetails={onViewTripDetails}
                                        onAddToPlan={onAddTripToPlan}
                                    />
                                ))
                            ) : (
                                <div style={{ padding: "40px 20px", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                                    No dive trips found
                                </div>
                            )}
                        </div>
                    )}

                    {/* Marine Life */}
                    {activeContentType === "Marine Life" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflow: "auto", flex: 1 }}>
                            {filteredSpecies.length > 0 ? (
                                filteredSpecies.map((species) => (
                                    <MarineSpeciesCard
                                        key={species.id}
                                        species={species}
                                        onViewProfile={() => console.log("View profile:", species.common_name)}
                                        onAddSighting={() => console.log("Add sighting:", species.common_name)}
                                    />
                                ))
                            ) : (
                                <div style={{ padding: "40px 20px", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                                    No marine species found
                                </div>
                            )}
                        </div>
                    )}
            </div>
        </div>
    )
}

// ── EmptyState ────────────────────────────────────────────────────────────
function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "13px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            {icon}
            {label}
        </div>
    )
}

// ── MarineLifeCard ────────────────────────────────────────────────────────
function MarineLifeCard({ species }: { species: MarineSpecies }) {
    return (
        <div
            style={{
                background: "rgba(6, 43, 61, 0.5)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(0, 194, 215, 0.2)", borderRadius: "16px",
                overflow: "hidden", transition: "all 0.2s ease-out",
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = "rgba(0, 194, 215, 0.35)"
                el.style.boxShadow = "0 0 16px rgba(0, 194, 215, 0.2)"
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = "rgba(0, 194, 215, 0.2)"
                el.style.boxShadow = "none"
            }}
        >
            <div style={{ display: "flex", gap: "12px", padding: "12px" }}>
                {/* Thumbnail */}
                <div style={{
                    width: "72px", height: "72px", borderRadius: "12px", flexShrink: 0,
                    backgroundImage: `url(${species.image_url})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    border: "1px solid rgba(0, 194, 215, 0.15)",
                    background: `linear-gradient(135deg, rgba(0,194,215,0.3) 0%, rgba(8,59,83,0.5) 100%)`,
                }} />
                {/* Info */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 }}>{species.common_name}</h3>
                        <span style={{
                            fontSize: "10px", color: "#00C2D7", background: "rgba(0,194,215,0.1)",
                            border: "0.5px solid rgba(0,194,215,0.3)", borderRadius: "9999px", padding: "2px 8px",
                            textTransform: "capitalize", flexShrink: 0,
                        }}>{species.category}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0, fontStyle: "italic" }}>
                        {species.scientific_name}
                    </p>
                    {species.habitat && (
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                            {species.habitat}
                        </p>
                    )}
                    {species.best_months && (
                        <span style={{ fontSize: "10px", color: "rgba(0,194,215,0.8)" }}>
                            Best: {species.best_months}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
