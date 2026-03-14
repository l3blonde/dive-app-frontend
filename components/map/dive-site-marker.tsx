"use client"

import { MapPin } from "lucide-react"

interface DiveSiteMarkerProps {
    count?: number
    isSelected?: boolean
    onClick: () => void
}

export function DiveSiteMarker({ count, isSelected = false, onClick }: DiveSiteMarkerProps) {
    return (
        <div
            onClick={onClick}
            style={{
                width: "52px",
                height: "52px",
                cursor: "pointer",
                position: "relative",
                transition: "transform 0.25s ease-out",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
            }}
        >
            {/* 3D Bubble with aqua glow */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: isSelected
                        ? "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), rgba(0,194,215,0.35) 35%, rgba(4,24,38,0.7))"
                        : "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(0,194,215,0.22) 35%, rgba(4,24,38,0.65))",
                    border: isSelected ? "2px solid rgba(0, 194, 215, 0.9)" : "1.5px solid rgba(0, 194, 215, 0.55)",
                    boxShadow: isSelected
                        ? [
                            "0 0 16px rgba(0, 194, 215, 1)",
                            "0 0 36px rgba(0, 194, 215, 0.7)",
                            "0 0 56px rgba(0, 194, 215, 0.35)",
                            "inset 0 0 16px rgba(0, 194, 215, 0.4)",
                            "inset 2px 2px 8px rgba(255, 255, 255, 0.3)",
                        ].join(", ")
                        : [
                            "0 0 12px rgba(0, 194, 215, 0.8)",
                            "0 0 28px rgba(0, 194, 215, 0.5)",
                            "0 0 48px rgba(0, 194, 215, 0.25)",
                            "inset 0 0 14px rgba(0, 194, 215, 0.3)",
                            "inset 2px 2px 8px rgba(255, 255, 255, 0.25)",
                        ].join(", "),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    transition: "all 0.25s ease-out",
                }}
            >
                {/* Show count number OR MapPin icon */}
                {count !== undefined ? (
                    <span
                        style={{
                            color: "#FFFFFF",
                            fontSize: "16px",
                            fontWeight: "700",
                            textShadow: "0 0 12px rgba(0, 194, 215, 0.8), 0 2px 4px rgba(0,0,0,0.5)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {count}
                    </span>
                ) : (
                    <MapPin 
                        size={22} 
                        color="#FFFFFF"
                        strokeWidth={2}
                        style={{
                            filter: "drop-shadow(0 0 6px rgba(0, 194, 215, 0.7))",
                        }}
                    />
                )}
            </div>

            {/* Pulse animation ring for selected state */}
            {isSelected && (
                <div
                    style={{
                        position: "absolute",
                        inset: "-4px",
                        borderRadius: "50%",
                        border: "2px solid rgba(0, 194, 215, 0.5)",
                        animation: "marker-pulse-ring 2s ease-out infinite",
                    }}
                />
            )}

            {/* Inject keyframes */}
            <style>{`
                @keyframes marker-pulse-ring {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(1.4);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}
