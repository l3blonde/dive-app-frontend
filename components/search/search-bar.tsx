"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FilterChips, type FilterOptions } from "./filter-chips"
import { AutocompleteDropdown } from "./autocomplete-dropdown"
import type { AutocompleteResult, DiveSite } from "@/lib/types"

interface SearchBarProps {
    isOpen: boolean
    searchQuery: string
    onSearchChange: (query: string) => void
    onClose: () => void
    filters: FilterOptions
    onFilterChange: (filters: FilterOptions) => void
    resultsCount: number
    showFilters: boolean
    onToggleFilters: () => void
    onReset?: () => void
    allDiveSites: DiveSite[]
    onLocationSelect?: (coordinates: { longitude: number; latitude: number; zoom: number }) => void
    onDiveSiteSelect?: (site: DiveSite) => void
    onSearchExecute?: () => void
}

type MapTab = "dive-sites" | "trips" | "marine-life"

export function SearchBar({
    isOpen,
    searchQuery,
    onSearchChange,
    onClose,
    filters,
    onFilterChange,
    resultsCount,
    showFilters,
    onToggleFilters,
    onReset,
    allDiveSites,
    onLocationSelect,
    onDiveSiteSelect,
    onSearchExecute,
}: SearchBarProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [activeMapTab, setActiveMapTab] = useState<MapTab>("dive-sites")

    useEffect(() => {
        setIsMounted(true)
        const timer = setTimeout(() => setIsMounted(true), 100)
        return () => clearTimeout(timer)
    }, [])

    const [showAutocomplete, setShowAutocomplete] = useState(false)
    const [locationResults, setLocationResults] = useState<AutocompleteResult[]>([])
    const [isLoadingResults, setIsLoadingResults] = useState(false)
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

    useEffect(() => {
        if (localSearchQuery.trim().length < 2) {
            setLocationResults([])
            setShowAutocomplete(false)
            return
        }

        setShowAutocomplete(true)
        setIsLoadingResults(true)

        const fetchLocations = async () => {
            try {
                const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
                if (!token) {
                    setLocationResults([])
                    setIsLoadingResults(false)
                    return
                }

                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(localSearchQuery)}.json?access_token=${token}&types=country,region,place&limit=5`
                const response = await fetch(url)

                if (!response.ok) {
                    setLocationResults([])
                    setIsLoadingResults(false)
                    return
                }

                const data = await response.json()

                const results: AutocompleteResult[] =
                    data.features?.map((feature: any) => {
                        const placeType = feature.place_type?.[0] || "place"
                        let type: "Country" | "City" | "Dive Site" = "City"
                        let icon: "globe" | "building" | "pin" = "building"

                        if (placeType === "country") {
                            type = "Country"
                            icon = "globe"
                        } else if (placeType === "place" || placeType === "region") {
                            type = "City"
                            icon = "building"
                        }

                        return {
                            id: feature.id,
                            name: feature.text || feature.place_name,
                            type,
                            icon,
                            subtitle: feature.place_name,
                            coordinates: {
                                longitude: feature.center[0],
                                latitude: feature.center[1],
                            },
                            zoom: type === "Country" ? 6 : type === "City" ? 10 : 14,
                        }
                    }) || []

                setLocationResults(results)
            } catch (error) {
                setLocationResults([])
            } finally {
                setIsLoadingResults(false)
            }
        }

        const debounceTimer = setTimeout(fetchLocations, 300)
        return () => clearTimeout(debounceTimer)
    }, [localSearchQuery])

    const matchingDiveSites = allDiveSites
        .filter((site) => {
            const query = localSearchQuery.toLowerCase()
            return (
                site.name.toLowerCase().includes(query) ||
                site.location_name.toLowerCase().includes(query) ||
                site.description?.toLowerCase().includes(query)
            )
        })
        .slice(0, 5)

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (e.target === e.currentTarget && isMounted) {
            onClose()
        }
    }

    const handleResultSelect = (result: AutocompleteResult | DiveSite, isDiveSite: boolean) => {
        if (isDiveSite) {
            const site = result as DiveSite
            onSearchChange(site.name)
            setShowAutocomplete(false)
            onDiveSiteSelect?.(site)
        } else {
            const location = result as AutocompleteResult
            onSearchChange(location.name)
            setShowAutocomplete(false)
            if (location.coordinates) {
                onLocationSelect?.({
                    longitude: location.coordinates.longitude,
                    latitude: location.coordinates.latitude,
                    zoom: location.zoom || 10,
                })
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setShowAutocomplete(false)
            onSearchExecute?.()
        }
    }

    if (!isOpen) return null

    const MAP_TABS: { id: MapTab; label: string }[] = [
        { id: "dive-sites", label: "Dive Sites" },
        { id: "trips", label: "Trips" },
        { id: "marine-life", label: "Marine Life" },
    ]

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleBackdropClick}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.3)",
                    zIndex: 1999,
                }}
            />

            <div
                style={{
                    position: "fixed",
                    top: "16px",
                    left: "16px",
                    right: "80px",
                    maxWidth: "800px",
                    zIndex: 2000,
                }}
            >
                {/* Search row */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {/* Search input */}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "white",
                            borderRadius: "12px",
                            padding: "12px 16px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search dive sites, trips, species"
                            value={localSearchQuery}
                            onChange={(e) => {
                                setLocalSearchQuery(e.target.value)
                                onSearchChange(e.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (localSearchQuery.trim().length >= 2) setShowAutocomplete(true)
                            }}
                            autoFocus
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                color: "#374151",
                                fontSize: "15px",
                                fontWeight: 400,
                                minWidth: 0,
                            }}
                        />
                        {localSearchQuery && (
                            <button
                                onClick={() => {
                                    setLocalSearchQuery("")
                                    onSearchChange("")
                                    setShowAutocomplete(false)
                                }}
                                aria-label="Clear search"
                                style={{
                                    flexShrink: 0,
                                    width: "26px",
                                    height: "26px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "none",
                                    background: "#F3F4F6",
                                    cursor: "pointer",
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                                    <path d="M4 4l12 12M16 4L4 16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Filter icon only — no text */}
                    <button
                        onClick={onToggleFilters}
                        aria-label="Filter"
                        style={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: showFilters ? "#1A2744" : "white",
                            borderRadius: "12px",
                            padding: "12px 14px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                            border: "none",
                            cursor: "pointer",
                            transition: "background 0.2s",
                        }}
                    >
                        {/* SlidersHorizontal icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={showFilters ? "white" : "#374151"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="21" y1="4" x2="14" y2="4" />
                            <line x1="10" y1="4" x2="3" y2="4" />
                            <line x1="21" y1="12" x2="12" y2="12" />
                            <line x1="8" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="20" x2="16" y2="20" />
                            <line x1="12" y1="20" x2="3" y2="20" />
                            <circle cx="12" cy="4" r="2" />
                            <circle cx="10" cy="12" r="2" />
                            <circle cx="14" cy="20" r="2" />
                        </svg>
                    </button>
                </div>

                {/* Modular tabs: Dive Sites | Trips | Marine Life */}
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    {MAP_TABS.map((tab) => {
                        const isActive = activeMapTab === tab.id
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 999,
                padding: "16px",
                paddingTop: "20px",
                display: searchOpen ? "flex" : "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            {/* Glassmorphism container */}
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    padding: "12px 16px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                }}
            >
                {/* Search Input */}
                <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "8px" }}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search dive sites, trips, marine life"
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        onFocus={() => setShowAutocomplete(true)}
                        style={{
                            flex: 1,
                            border: "none",
                            background: "transparent",
                            color: "white",
                            fontSize: "14px",
                            outline: "none",
                            fontFamily: "inherit",
                        }}
                        placeholder="Search dive sites, trips, marine life"
                    />
                </div>

                {/* Filter Button */}
                <button
                    onClick={onToggleFilters}
                    style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
                    }}
                    title="Filter options"
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M4 6h16M8 12h8M10 18h4" />
                    </svg>
                </button>
            </div>

            {/* Glassmorphism tabs container */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    padding: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
            >
                {/* Tabs */}
                {(["dive-sites", "trips", "marine-life"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveMapTab(tab)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "16px",
                            border: "none",
                            background: activeMapTab === tab ? "rgba(255, 255, 255, 0.25)" : "transparent",
                            color: "white",
                            fontSize: "13px",
                            fontWeight: activeMapTab === tab ? "600" : "500",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                            if (activeMapTab !== tab) {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeMapTab !== tab) {
                                e.currentTarget.style.background = "transparent"
                            }
                        }}
                    >
                        {tab === "marine-life" && (
                            <span style={{ marginRight: "6px" }}>🐟</span>
                        )}
                        {tab === "dive-sites" ? "Dive Sites" : tab === "trips" ? "Trips" : "Marine Life"}
                    </button>
                ))}

                {/* More button */}
                <button
                    style={{
                        padding: "8px 12px",
                        borderRadius: "16px",
                        border: "none",
                        background: "transparent",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                    }}
                    title="More options"
                >
                    •••
                </button>
            </div>
        </div>
    )
                            <button
                                key={tab.id}
                                onClick={() => setActiveMapTab(tab.id)}
                                style={{
                                    padding: "7px 16px",
                                    borderRadius: "12px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: isActive ? 700 : 500,
                                    background: isActive ? "#1A2744" : "rgba(255,255,255,0.85)",
                                    color: isActive ? "white" : "#374151",
                                    boxShadow: isActive ? "0 2px 8px rgba(26,39,68,0.25)" : "0 2px 8px rgba(0,0,0,0.08)",
                                    transition: "all 0.2s ease",
                                    backdropFilter: "blur(8px)",
                                    WebkitBackdropFilter: "blur(8px)",
                                }}
                            >
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Autocomplete */}
                {showAutocomplete && (locationResults.length > 0 || matchingDiveSites.length > 0 || isLoadingResults) && (
                    <div style={{ marginTop: "10px" }}>
                        <AutocompleteDropdown
                            results={locationResults}
                            diveSites={matchingDiveSites}
                            onSelect={handleResultSelect}
                            isLoading={isLoadingResults}
                        />
                    </div>
                )}

                {/* Results count */}
                {localSearchQuery && !showAutocomplete && (
                    <div style={{ marginTop: "12px", textAlign: "center" }}>
                        <span
                            style={{
                                display: "inline-block",
                                background: "#DBEAFE",
                                color: "#1E40AF",
                                padding: "6px 14px",
                                borderRadius: "12px",
                                fontSize: "13px",
                                fontWeight: 500,
                            }}
                        >
                            {resultsCount} {resultsCount === 1 ? "result" : "results"}
                        </span>
                    </div>
                )}
            </div>

            {showFilters && (
                <FilterChips
                    filters={filters}
                    onFilterChange={onFilterChange}
                    resultsCount={resultsCount}
                    onClose={onToggleFilters}
                />
            )}
        </>
    )
}
