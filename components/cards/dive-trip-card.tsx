"use client"

import { Star } from "lucide-react"

export interface DiveTrip {
    id: string
    name: string
    type: string // 'Land-based', 'Liveaboard', 'Day Trip'
    difficulty?: string
    start_date: string
    end_date: string
    description?: string
    marine_life?: string // JSON array
    spots_total?: number
    spots_left?: number
    image_url?: string
    location?: string
    latitude?: number
    longitude?: number
    rating?: number
    review_count?: number
}

interface DiveTripCardProps {
    trip: DiveTrip
    onAddToPlan?: (trip: DiveTrip) => void
    onViewDetails?: (trip: DiveTrip) => void
}

export function DiveTripCard({ trip, onAddToPlan, onViewDetails }: DiveTripCardProps) {
    // Parse marine life from JSON string
    let marineLifeArr: string[] = []
    try {
        if (typeof trip.marine_life === "string" && trip.marine_life) {
            marineLifeArr = JSON.parse(trip.marine_life)
        } else if (Array.isArray(trip.marine_life)) {
            marineLifeArr = trip.marine_life
        }
    } catch {}

    // Format dates
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("en-US", { day: "numeric", month: "short" })
    }

    const dateRange = `${formatDate(trip.start_date)}-${formatDate(trip.end_date)}`

    return (
        <div
            style={{
                display: "flex",
                gap: "12px",
                padding: "12px",
                background: "rgba(6, 43, 61, 0.5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "16px",
                border: "1px solid rgba(0, 194, 215, 0.25)",
                boxShadow: [
                    "0 0 12px rgba(0, 194, 215, 0.15)",
                    "0 4px 20px rgba(0, 0, 0, 0.4)",
                    "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
                ].join(", "),
                transition: "all 0.25s ease-out",
            }}
        >
            {/* Thumbnail */}
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, rgba(0,194,215,0.3), rgba(4,28,44,0.8)), url(${trip.image_url || "/images/dive-placeholder.jpg"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    flexShrink: 0,
                    border: "1px solid rgba(0, 194, 215, 0.2)",
                    boxShadow: "0 0 8px rgba(0, 194, 215, 0.2)",
                }}
            />

            {/* Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>
                {/* Title row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ minWidth: 0 }}>
                        <h3
                            style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "#FFFFFF",
                                margin: 0,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {trip.name}
                        </h3>
                        <span
                            style={{
                                fontSize: "11px",
                                color: "rgba(0, 194, 215, 0.8)",
                                fontWeight: "500",
                            }}
                        >
                            [{trip.type}]
                        </span>
                    </div>
                </div>

                {/* Date */}
                <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>
                    {dateRange}
                </span>

                {/* Rating row */}
                {trip.rating && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <div style={{ display: "flex", gap: "1px" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={12}
                                    fill={star <= Math.round(trip.rating || 0) ? "#FFD700" : "transparent"}
                                    color={star <= Math.round(trip.rating || 0) ? "#FFD700" : "rgba(255,255,255,0.3)"}
                                    strokeWidth={1.5}
                                />
                            ))}
                        </div>
                        <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}>
                            {trip.rating} ({trip.review_count})
                        </span>
                    </div>
                )}

                {/* Description with marine life */}
                {trip.description && (
                    <p
                        style={{
                            fontSize: "11px",
                            color: "rgba(255, 255, 255, 0.6)",
                            margin: 0,
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {trip.description}
                    </p>
                )}

                {/* Marine life tags */}
                {marineLifeArr.length > 0 && (
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}>
                        {marineLifeArr.slice(0, 3).map((species, idx) => (
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

                {/* CTAs */}
                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button
                        onClick={() => onAddToPlan?.(trip)}
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
                        onClick={() => onViewDetails?.(trip)}
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
        </div>
    )
}
