"use client"

import { ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export type SortOption = "distance" | "rating" | "newest" | "price-low" | "price-high" | "difficulty"

interface SortDropdownProps {
    value: SortOption
    onChange: (value: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "distance", label: "Distance" },
    { value: "rating", label: "Rating" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price (Low)" },
    { value: "price-high", label: "Price (High)" },
    { value: "difficulty", label: "Difficulty" },
]

export function SortDropdown({ value, onChange }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const currentLabel = SORT_OPTIONS.find((opt) => opt.value === value)?.label || "Sort"

    return (
        <div ref={dropdownRef} style={{ position: "relative" }}>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "8px 14px",
                    borderRadius: "9999px",
                    border: isOpen ? "1.5px solid rgba(0, 194, 215, 0.6)" : "1px solid rgba(255, 255, 255, 0.2)",
                    background: isOpen ? "rgba(0, 194, 215, 0.15)" : "rgba(255, 255, 255, 0.08)",
                    color: isOpen ? "#00C2D7" : "rgba(255, 255, 255, 0.8)",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease-out",
                    boxShadow: isOpen ? "0 0 12px rgba(0, 194, 215, 0.3)" : "none",
                }}
            >
                {currentLabel}
                <ChevronDown
                    size={14}
                    style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease-out",
                    }}
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        minWidth: "140px",
                        background: "rgba(4, 24, 38, 0.95)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        borderRadius: "12px",
                        border: "1px solid rgba(0, 194, 215, 0.3)",
                        boxShadow: [
                            "0 0 16px rgba(0, 194, 215, 0.25)",
                            "0 8px 32px rgba(0, 0, 0, 0.5)",
                        ].join(", "),
                        padding: "6px",
                        zIndex: 50,
                    }}
                >
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: "none",
                                background: value === option.value ? "rgba(0, 194, 215, 0.2)" : "transparent",
                                color: value === option.value ? "#00C2D7" : "rgba(255, 255, 255, 0.8)",
                                fontSize: "13px",
                                fontWeight: value === option.value ? "600" : "400",
                                textAlign: "left",
                                cursor: "pointer",
                                transition: "all 0.15s ease-out",
                            }}
                            onMouseEnter={(e) => {
                                if (value !== option.value) {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (value !== option.value) {
                                    e.currentTarget.style.background = "transparent"
                                }
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
