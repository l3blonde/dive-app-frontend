"use client"

import { Shell } from "lucide-react"

// Premium diver mask SVG icon
function DiverMaskIcon({ color }: { color: string }) {
    return (
        <svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer mask body - full silhouette */}
            <path
                d="M4 15 C4 11 7 9 11 9 L25 9 C29 9 32 11 32 15 L32 22 C32 25 30 27 27 27 L22 27 C20.5 27 19.5 26 19 25 L18 23 L17 25 C16.5 26 15.5 27 14 27 L9 27 C6 27 4 25 4 22 Z"
                stroke={color}
                strokeWidth="1.6"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Left lens inner rounded rect */}
            <rect x="6" y="12" width="10" height="9" rx="2.5" stroke={color} strokeWidth="1.4" fill="none" />
            {/* Right lens inner rounded rect */}
            <rect x="20" y="12" width="10" height="9" rx="2.5" stroke={color} strokeWidth="1.4" fill="none" />
            {/* Nose bridge */}
            <path d="M16 16.5 L20 16.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
            {/* Top strap */}
            <path d="M11 9 C11 6 14 4 18 4 C22 4 25 6 25 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
    )
}

interface BottomNavProps {
    activeTab: string
    onTabChange: (tab: string) => void
    onSearchOpen: () => void
    searchOpen: boolean
}

const NAV_TABS = [
    {
        id: "explore",
        icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
        label: "Explore",
        custom: null,
    },
    {
        id: "plan",
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        label: "Plan",
        custom: null,
    },
    {
        id: "dive",
        icon: null,
        label: "Dive",
        custom: "mask",
    },
    {
        id: "logbook",
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
        label: "Logbook",
        custom: null,
    },
    {
        id: "memories",
        icon: null,
        label: "Memories",
        custom: "shell",
    },
]

export function BottomNav({ activeTab, onTabChange, onSearchOpen, searchOpen }: BottomNavProps) {
    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1002,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                padding: "12px 16px 20px 16px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    background: "rgba(6, 43, 61, 0.4)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(0, 194, 215, 0.15)",
                    borderRadius: "32px",
                    padding: "8px 12px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                    justifyContent: "space-around",
                    gap: "4px",
                    maxWidth: "100%",
                }}
            >
                {NAV_TABS.map((tab) => {
                    const isActive = activeTab === tab.id
                    const iconColor = isActive ? "#00C2D7" : "rgba(255, 255, 255, 0.5)"
                    const textColor = isActive ? "#00C2D7" : "rgba(255, 255, 255, 0.5)"
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "3px",
                                background: isActive
                                    ? "rgba(0, 194, 215, 0.2)"
                                    : "transparent",
                                border: isActive ? "1px solid rgba(0, 194, 215, 0.5)" : "1px solid transparent",
                                cursor: "pointer",
                                padding: isActive ? "7px 20px" : "7px 10px",
                                borderRadius: "9999px",
                                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                boxShadow: isActive
                                    ? "0 0 16px rgba(0, 194, 215, 0.5), 0 0 32px rgba(0, 194, 215, 0.25), inset 0 0 12px rgba(0, 194, 215, 0.1)"
                                    : "none",
                                minWidth: isActive ? "72px" : "48px",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "transparent"
                                }
                            }}
                        >
                            {tab.custom === "mask" ? (
                                <DiverMaskIcon color={iconColor} />
                            ) : tab.custom === "shell" ? (
                                <Shell size={24} color={iconColor} strokeWidth={1.6} />
                            ) : (
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={iconColor}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ transition: "stroke 0.2s ease-out" }}
                                >
                                    <path d={tab.icon!} />
                                </svg>
                            )}
                            <span
                                style={{
                                    fontSize: "10px",
                                    fontWeight: isActive ? "700" : "500",
                                    color: textColor,
                                    transition: "all 0.2s ease-out",
                                }}
                            >
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
