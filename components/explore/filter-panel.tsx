"use client"

import { X } from "lucide-react"
import { useState } from "react"

export interface FilterState {
    depthRange: [number, number]
    difficulty: string[]
    distanceRadius: number
    tripType: string[]
    priceRange: [number, number]
}

interface FilterPanelProps {
    isOpen: boolean
    onClose: () => void
    filters: FilterState
    onApply: (filters: FilterState) => void
}

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Expedition"]
const TRIP_TYPE_OPTIONS = ["Land-based", "Liveaboard", "Day Trip"]

export function FilterPanel({ isOpen, onClose, filters, onApply }: FilterPanelProps) {
    const [localFilters, setLocalFilters] = useState<FilterState>(filters)

    if (!isOpen) return null

    const handleDifficultyToggle = (diff: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            difficulty: prev.difficulty.includes(diff)
                ? prev.difficulty.filter((d) => d !== diff)
                : [...prev.difficulty, diff],
        }))
    }

    const handleTripTypeToggle = (type: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            tripType: prev.tripType.includes(type)
                ? prev.tripType.filter((t) => t !== type)
                : [...prev.tripType, type],
        }))
    }

    const handleApply = () => {
        onApply(localFilters)
        onClose()
    }

    const handleReset = () => {
        const resetFilters: FilterState = {
            depthRange: [0, 60],
            difficulty: [],
            distanceRadius: 100,
            tripType: [],
            priceRange: [0, 5000],
        }
        setLocalFilters(resetFilters)
    }

    const chipStyle = (isActive: boolean): React.CSSProperties => ({
        padding: "8px 16px",
        borderRadius: "9999px",
        border: isActive ? "1.5px solid rgba(0, 194, 215, 0.7)" : "1px solid rgba(255, 255, 255, 0.2)",
        background: isActive ? "rgba(0, 194, 215, 0.2)" : "transparent",
        color: isActive ? "#00C2D7" : "rgba(255, 255, 255, 0.7)",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s ease-out",
        boxShadow: isActive ? "0 0 12px rgba(0, 194, 215, 0.3)" : "none",
    })

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(4px)",
                }}
            />

            {/* Panel */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "500px",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    background: "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(0,194,215,0.12) 0%, rgba(4,24,38,0.95) 50%, rgba(4,24,38,0.98) 100%)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderRadius: "28px 28px 0 0",
                    border: "1.5px solid rgba(0, 194, 215, 0.35)",
                    borderBottom: "none",
                    boxShadow: [
                        "0 0 20px rgba(0, 194, 215, 0.4)",
                        "0 -8px 40px rgba(0, 0, 0, 0.6)",
                        "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    ].join(", "),
                    padding: "24px",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#FFFFFF", margin: 0 }}>
                        Filters
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            background: "rgba(255, 255, 255, 0.1)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <X size={18} color="#FFFFFF" />
                    </button>
                </div>

                {/* Depth Range */}
                <div style={{ marginBottom: "24px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500", color: "rgba(255, 255, 255, 0.8)", marginBottom: "12px", display: "block" }}>
                        Depth Range: {localFilters.depthRange[0]}m - {localFilters.depthRange[1]}m
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={60}
                        value={localFilters.depthRange[1]}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, depthRange: [0, parseInt(e.target.value)] }))}
                        style={{ width: "100%", accentColor: "#00C2D7" }}
                    />
                </div>

                {/* Distance Radius */}
                <div style={{ marginBottom: "24px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500", color: "rgba(255, 255, 255, 0.8)", marginBottom: "12px", display: "block" }}>
                        Distance: Within {localFilters.distanceRadius}km
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={100}
                        value={localFilters.distanceRadius}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, distanceRadius: parseInt(e.target.value) }))}
                        style={{ width: "100%", accentColor: "#00C2D7" }}
                    />
                </div>

                {/* Difficulty */}
                <div style={{ marginBottom: "24px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500", color: "rgba(255, 255, 255, 0.8)", marginBottom: "12px", display: "block" }}>
                        Difficulty
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {DIFFICULTY_OPTIONS.map((diff) => (
                            <button
                                key={diff}
                                onClick={() => handleDifficultyToggle(diff)}
                                style={chipStyle(localFilters.difficulty.includes(diff))}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trip Type */}
                <div style={{ marginBottom: "24px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500", color: "rgba(255, 255, 255, 0.8)", marginBottom: "12px", display: "block" }}>
                        Trip Type
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {TRIP_TYPE_OPTIONS.map((type) => (
                            <button
                                key={type}
                                onClick={() => handleTripTypeToggle(type)}
                                style={chipStyle(localFilters.tripType.includes(type))}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div style={{ marginBottom: "32px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500", color: "rgba(255, 255, 255, 0.8)", marginBottom: "12px", display: "block" }}>
                        Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={5000}
                        step={100}
                        value={localFilters.priceRange[1]}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
                        style={{ width: "100%", accentColor: "#00C2D7" }}
                    />
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={handleReset}
                        style={{
                            flex: 1,
                            padding: "14px",
                            borderRadius: "9999px",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            background: "transparent",
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        style={{
                            flex: 2,
                            padding: "14px",
                            borderRadius: "9999px",
                            border: "1.5px solid rgba(0, 194, 215, 0.7)",
                            background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,194,215,0.3) 0%, rgba(0,194,215,0.15) 100%)",
                            color: "#00C2D7",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: "0 0 16px rgba(0, 194, 215, 0.4)",
                        }}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    )
}
