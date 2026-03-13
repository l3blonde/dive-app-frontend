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
        id: "home",
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
        id: "profile",
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
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px 20px 16px",
                gap: "12px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    background: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "32px",
                    padding: "8px 12px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    flex: 1,
                    justifyContent: "space-around",
                    gap: "4px",
                }}
            >
                {NAV_TABS.map((tab) => {
                    const isActive = activeTab === tab.id
                    const color = isActive ? "#1A1A33" : "#6A6A6A"
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "4px",
                                background: isActive 
                                    ? "rgba(0, 194, 215, 0.35)" 
                                    : "transparent",
                                border: isActive ? "1.5px solid rgba(0, 194, 215, 0.6)" : "none",
                                cursor: "pointer",
                                padding: "8px 4px",
                                borderRadius: "16px",
                                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                boxShadow: isActive 
                                    ? "0 0 20px rgba(0, 194, 215, 0.5), inset 0 0 15px rgba(0, 194, 215, 0.2)" 
                                    : "none",
                            }}
                            onMouseEnter={(e) => {
                                if (isActive) {
                                    e.currentTarget.style.boxShadow = "0 0 28px rgba(0, 194, 215, 0.7), inset 0 0 20px rgba(0, 194, 215, 0.3)"
                                } else {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isActive) {
                                    e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 194, 215, 0.5), inset 0 0 15px rgba(0, 194, 215, 0.2)"
                                } else {
                                    e.currentTarget.style.background = "transparent"
                                }
                            }}
                        >
                            {tab.custom === "mask" ? (
                                <DiverMaskIcon color={color} />
                            ) : tab.custom === "shell" ? (
                                <Shell size={24} color={color} strokeWidth={1.6} />
                            ) : (
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ transition: "stroke 0.2s ease-in-out" }}
                                >
                                    <path d={tab.icon!} />
                                </svg>
                            )}
                            <span
                                style={{
                                    fontSize: "10px",
                                    fontWeight: isActive ? "700" : "500",
                                    color,
                                    transition: "all 0.2s ease-in-out",
                                }}
                            >
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            <button
                onClick={onSearchOpen}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    background: "#94E0FF",
                    border: "none",
                    borderRadius: "32px",
                    cursor: "pointer",
                    padding: "12px 16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    minWidth: "70px",
                    transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={searchOpen ? "#1A1A33" : "#6A6A6A"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: "stroke 0.2s ease-in-out" }}
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <span
                    style={{
                        fontSize: "10px",
                        fontWeight: "500",
                        color: searchOpen ? "#1A1A33" : "#6A6A6A",
                        transition: "color 0.2s ease-in-out",
                    }}
                >
                    Search
                </span>
            </button>
        </div>
    )
}
