"use client"

import { MapPin, Plus, Minus, Compass, Fish, Waves } from "lucide-react"

interface MapControlsProps {
    onMarineSpeciesClick: () => void
    mapMode?: "dive-sites" | "marine-species"
    onZoomIn?: () => void
    onZoomOut?: () => void
    onLocate?: () => void
    onSearchToggle?: () => void
    searchOpen?: boolean
}

export function MapControls({ 
    onMarineSpeciesClick, 
    mapMode = "dive-sites",
    onZoomIn,
    onZoomOut,
    onLocate,
    onSearchToggle,
    searchOpen = false,
}: MapControlsProps) {
    // 3D Bubble Button Style - Creates sphere effect with radial gradient and layered glows
    const bubbleButtonStyle: React.CSSProperties = {
        width: "48px",
        height: "48px",
        backgroundColor: "rgba(0, 194, 215, 0.12)",
        backgroundImage: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3), rgba(0,194,215,0.15) 30%, rgba(4,24,38,0.6))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "50%",
        border: "1.5px solid rgba(0, 194, 215, 0.4)",
        boxShadow: [
            "0 0 20px rgba(0, 194, 215, 0.6)",      // Tight core glow
            "0 0 40px rgba(0, 194, 215, 0.3)",      // Mid bloom
            "inset 0 0 12px rgba(0, 194, 215, 0.25)", // Inner glow
            "inset 2px 2px 6px rgba(255, 255, 255, 0.2)", // Top-left highlight (3D effect)
        ].join(", "),
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.25s ease-out",
    }

    const handleBubbleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 194, 215, 0.22)"
        e.currentTarget.style.boxShadow = [
            "0 0 28px rgba(0, 194, 215, 0.8)",
            "0 0 56px rgba(0, 194, 215, 0.45)",
            "inset 0 0 16px rgba(0, 194, 215, 0.35)",
            "inset 2px 2px 8px rgba(255, 255, 255, 0.25)",
        ].join(", ")
    }

    const handleBubbleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, isActive = false) => {
        const baseColor = isActive ? "rgba(0, 194, 215, 0.18)" : "rgba(0, 194, 215, 0.12)"
        const glow = isActive 
            ? [
                "0 0 28px rgba(0, 194, 215, 0.7)",
                "0 0 48px rgba(0, 194, 215, 0.35)",
                "inset 0 0 14px rgba(0, 194, 215, 0.3)",
                "inset 2px 2px 6px rgba(255, 255, 255, 0.2)",
            ].join(", ")
            : [
                "0 0 20px rgba(0, 194, 215, 0.6)",
                "0 0 40px rgba(0, 194, 215, 0.3)",
                "inset 0 0 12px rgba(0, 194, 215, 0.25)",
                "inset 2px 2px 6px rgba(255, 255, 255, 0.2)",
            ].join(", ")
        e.currentTarget.style.backgroundColor = baseColor
        e.currentTarget.style.boxShadow = glow
    }

    return (
        <div
            style={{
                position: "absolute",
                top: "100px",
                right: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "8px",
                zIndex: 10,
            }}
        >
            {/* Location / Geolocate */}
            <button
                onClick={onLocate}
                style={bubbleButtonStyle}
                title="My location"
                aria-label="My location"
                onMouseEnter={handleBubbleMouseEnter}
                onMouseLeave={(e) => handleBubbleMouseLeave(e)}
            >
                <MapPin size={22} color="white" strokeWidth={1.6} />
            </button>

            {/* Zoom In */}
            <button
                onClick={onZoomIn}
                style={bubbleButtonStyle}
                title="Zoom in"
                aria-label="Zoom in"
                onMouseEnter={handleBubbleMouseEnter}
                onMouseLeave={(e) => handleBubbleMouseLeave(e)}
            >
                <Plus size={22} color="white" strokeWidth={1.6} />
            </button>

            {/* Zoom Out */}
            <button
                onClick={onZoomOut}
                style={bubbleButtonStyle}
                title="Zoom out"
                aria-label="Zoom out"
                onMouseEnter={handleBubbleMouseEnter}
                onMouseLeave={(e) => handleBubbleMouseLeave(e)}
            >
                <Minus size={22} color="white" strokeWidth={1.6} />
            </button>

            {/* Compass */}
            <button
                style={bubbleButtonStyle}
                title="Compass / Reset north"
                aria-label="Compass"
                onMouseEnter={handleBubbleMouseEnter}
                onMouseLeave={(e) => handleBubbleMouseLeave(e)}
            >
                <Compass size={22} color="white" strokeWidth={1.6} />
            </button>

            {/* Gap spacer */}
            <div style={{ height: "4px" }} />

            {/* Fish / Marine Life Toggle */}
            <button
                onClick={onMarineSpeciesClick}
                style={{
                    ...bubbleButtonStyle,
                    backgroundColor: mapMode === "marine-species" ? "rgba(0, 194, 215, 0.2)" : "rgba(0, 194, 215, 0.12)",
                    backgroundImage: mapMode === "marine-species" 
                        ? "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(0,194,215,0.25) 30%, rgba(4,24,38,0.65))"
                        : "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3), rgba(0,194,215,0.15) 30%, rgba(4,24,38,0.6))",
                }}
                title={mapMode === "dive-sites" ? "View marine species" : "View dive sites"}
                aria-label={mapMode === "dive-sites" ? "Marine species mode" : "Dive sites mode"}
                onMouseEnter={handleBubbleMouseEnter}
                onMouseLeave={(e) => handleBubbleMouseLeave(e, mapMode === "marine-species")}
            >
                <Fish size={22} color={mapMode === "marine-species" ? "#00C2D7" : "white"} strokeWidth={1.6} />
            </button>

            {/* Waves / Layers */}
            <button
                style={bubbleButtonStyle}
                title="Map layers"
                aria-label="Map layers"
                onMouseEnter={handleBubbleMouseEnter}
                onMouseLeave={(e) => handleBubbleMouseLeave(e)}
            >
                <Waves size={22} color="white" strokeWidth={1.6} />
            </button>
        </div>
    )
}
