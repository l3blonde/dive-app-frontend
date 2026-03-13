"use client"

import { NavigationControl, GeolocateControl } from "react-map-gl/mapbox"
import { Fish, Anchor } from "lucide-react"

interface MapControlsProps {
    onMarineSpeciesClick: () => void
    mapMode?: "dive-sites" | "marine-species"
    onNearbyClick?: () => void
}

export function MapControls({ onMarineSpeciesClick, mapMode = "dive-sites", onNearbyClick }: MapControlsProps) {
    const buttonBase: React.CSSProperties = {
        position: "absolute",
        right: "16px",
        width: "48px",
        height: "48px",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        transition: "all 0.2s",
    }

    return (
        <>
            <GeolocateControl position="top-right" trackUserLocation={true} showUserHeading={true} />
            <NavigationControl position="top-right" showCompass={true} showZoom={true} />

            {/* Marine species / dive sites toggle */}
            <button
                onClick={onMarineSpeciesClick}
                style={{
                    ...buttonBase,
                    top: "32%",
                    transform: "translateY(-50%)",
                    backgroundColor: mapMode === "marine-species" ? "rgba(0, 194, 215, 0.3)" : "rgba(255, 255, 255, 0.15)",
                    borderColor: mapMode === "marine-species" ? "rgba(0, 194, 215, 0.5)" : "rgba(255, 255, 255, 0.25)",
                }}
                title={mapMode === "dive-sites" ? "View marine species" : "View dive sites"}
                aria-label={mapMode === "dive-sites" ? "Marine species mode" : "Dive sites mode"}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = mapMode === "marine-species" ? "rgba(0, 194, 215, 0.4)" : "rgba(255, 255, 255, 0.25)"
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = mapMode === "marine-species" ? "rgba(0, 194, 215, 0.3)" : "rgba(255, 255, 255, 0.15)"
                }}
            >
                <Fish size={22} color={mapMode === "marine-species" ? "#00C2D7" : "white"} strokeWidth={1.8} />
            </button>

            {/* Nearby dive sites — Anchor icon */}
            <button
                onClick={onNearbyClick}
                style={{
                    ...buttonBase,
                    top: "calc(32% + 64px)",
                    transform: "translateY(-50%)",
                }}
                title="Nearby dive sites"
                aria-label="Nearby dive sites"
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)"
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)"
                }}
            >
                <Anchor size={22} color="white" strokeWidth={1.8} />
            </button>
        </>
    )
}
