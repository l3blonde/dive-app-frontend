"use client"

import { MapPin, Anchor, Star } from "lucide-react"
import type { DiveSite } from "@/lib/types"

interface DiveSiteCardProps {
    site: DiveSite
    onViewDetails?: (site: DiveSite) => void
    onAddToPlan?: (site: DiveSite) => void
}

export function DiveSiteCard({ site, onViewDetails, onAddToPlan }: DiveSiteCardProps) {
    return (
        <div
            style={{
                background: "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(0,194,215,0.15), rgba(4,24,38,0.4), rgba(4,24,38,0.6))",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(0, 194, 215, 0.3)",
                borderRadius: "16px",
                padding: "12px",
                overflow: "hidden",
                boxShadow: [
                    "0 0 12px rgba(0, 194, 215, 0.2)",
                    "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                ].join(", "),
            }}
        >
            {/* Image */}
            <div
                style={{
                    width: "100%",
                    height: "160px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "12px",
                    backgroundImage: `url(${site.image_url || "https://xu5qaaigiohvkyk8.public.blob.vercel-storage.com/site-placeholder.png"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
            />

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Title Row */}
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
                            {site.name}
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "11px",
                                color: "rgba(255, 255, 255, 0.6)",
                                marginTop: "2px",
                            }}
                        >
                            <MapPin size={12} />
                            {site.location_name}
                        </div>
                    </div>
                    {site.rating && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Star size={14} color="#FFB800" fill="#FFB800" />
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#FFFFFF" }}>
                                {site.rating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Depth & Difficulty */}
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        fontSize: "11px",
                        color: "rgba(255, 255, 255, 0.7)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Anchor size={12} />
                        <span>{site.min_depth}-{site.max_depth}m</span>
                    </div>
                    <span
                        style={{
                            backgroundColor: `rgba(0, 194, 215, ${
                                site.difficulty === "advanced" ? 0.25 : site.difficulty === "intermediate" ? 0.15 : 0.08
                            })`,
                            color: "#00C2D7",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            textTransform: "capitalize",
                            fontWeight: "500",
                        }}
                    >
                        {site.difficulty}
                    </span>
                </div>

                {/* Description */}
                {site.description && (
                    <p
                        style={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, 0.6)",
                            margin: "4px 0 0 0",
                            lineHeight: "1.4",
                        }}
                    >
                        {site.description}
                    </p>
                )}

                {/* Marine Life Tags */}
                {site.marine_life && (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                            marginTop: "8px",
                        }}
                    >
                        {JSON.parse(site.marine_life || "[]").slice(0, 3).map((species: string, idx: number) => (
                            <span
                                key={idx}
                                style={{
                                    fontSize: "10px",
                                    backgroundColor: "rgba(0, 194, 215, 0.15)",
                                    color: "#00C2D7",
                                    padding: "3px 8px",
                                    borderRadius: "4px",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                ★ {species.replace(/-/g, " ")}
                            </span>
                        ))}
                    </div>
                )}

                {/* CTAs */}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                        onClick={() => onAddToPlan?.(site)}
                        style={{
                            flex: 1,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid rgba(0, 194, 215, 0.5)",
                            background: "rgba(0, 194, 215, 0.1)",
                            color: "#00C2D7",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease-out",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(0, 194, 215, 0.2)"
                            e.currentTarget.style.borderColor = "rgba(0, 194, 215, 0.7)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(0, 194, 215, 0.1)"
                            e.currentTarget.style.borderColor = "rgba(0, 194, 215, 0.5)"
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
                            background: "linear-gradient(135deg, rgba(0, 194, 215, 0.4), rgba(0, 194, 215, 0.2))",
                            color: "#00C2D7",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease-out",
                            boxShadow: "0 0 8px rgba(0, 194, 215, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 194, 215, 0.5), rgba(0, 194, 215, 0.3))"
                            e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 194, 215, 0.5)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 194, 215, 0.4), rgba(0, 194, 215, 0.2))"
                            e.currentTarget.style.boxShadow = "0 0 8px rgba(0, 194, 215, 0.3)"
                        }}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    )
}
