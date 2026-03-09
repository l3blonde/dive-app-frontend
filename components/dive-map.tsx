"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import Map, { Marker, type MapRef } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { supabase } from "@/lib/db/client"
import { SitePopup } from "./dive-site/site-popup"
import { SpeciesBrowser } from "./marine-species/species-browser"
import { MapControls } from "./map/map-controls"
import { SearchBar } from "./search/search-bar"
import { BottomNav } from "./navigation/bottom-nav"
import { SiteCarousel } from "./dive-site/site-carousel"
import type { MarineSpecies } from "@/lib/types"
import type { DiveSite } from "@/lib/types"
import { MapMarker } from "./map/map-marker"
import { getDifficultyIcon } from "@/lib/utils/dive-site"
import { SpeciesPopup } from "./marine-species/species-popup"
import { ProfilePage } from "./profile/profile-page"

type DiveSiteWithMarineLife = DiveSite & { marine_life?: string }

export function DiveMap() {
    const [selectedSite, setSelectedSite] = useState<DiveSiteWithMarineLife | null>(null)
    const [diveSites, setDiveSites] = useState<DiveSite[]>([])
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    console.log("searchOpen state:", searchOpen)

    useEffect(() => {
        console.log("searchOpen changed to:", searchOpen)
    }, [searchOpen])

    const [searchQuery, setSearchQuery] = useState("")
    const [filters, setFilters] = useState<Record<string, any>>({})
    const [showFilters, setShowFilters] = useState(false)
    const [activeTab, setActiveTab] = useState("map")
    const mapRef = useRef<MapRef | null>(null)
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isSpeciesMode, setIsSpeciesMode] = useState(false)
    const [isSpeciesBrowserOpen, setIsSpeciesBrowserOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [marineSpecies, setMarineSpecies] = useState<MarineSpecies[]>([])
    const [selectedSpeciesForPopup, setSelectedSpeciesForPopup] = useState<MarineSpecies | null>(null)
    const [isLoadingSpecies, setIsLoadingSpecies] = useState(false)
    const [favorites, setFavorites] = useState<string[]>([])
    const [selectedSpecies, setSelectedSpecies] = useState<MarineSpecies | null>(null)

    const uniqueSpeciesFromSites = useMemo(() => {
        const allSpeciesNames = new Set<string>()

        diveSites.forEach((site: DiveSiteWithMarineLife) => {
            if (site.marine_life && typeof site.marine_life === "string") {
                try {
                    const marineLifeArray = JSON.parse(site.marine_life)
                    if (Array.isArray(marineLifeArray)) {
                        marineLifeArray.forEach((name) => allSpeciesNames.add(name))
                    }
                } catch (error) {
                    console.error("Error parsing marine_life for site:", site.name, error)
                }
            }
        })

        const matchedSpecies = marineSpecies.filter((species) => {
            const slug = species.common_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            return Array.from(allSpeciesNames).some((name) => {
                const nameSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                return nameSlug === slug || name.toLowerCase() === species.common_name.toLowerCase()
            })
        })

        console.log("Found unique marinespecies from dive spots:", matchedSpecies.length)
        return matchedSpecies
    }, [diveSites, isSpeciesMode, marineSpecies])

    const handleMarineSpeciesChange = (species: string[]) => {
        setSelectedSpeciesForPopup(null)
        setIsSpeciesMode(true)
        setIsSpeciesBrowserOpen(true)
        setSelectedCategory("")
    }

    const handleFavoriteToggle = (speciesId: string) => {
        setFavorites((prev) => (prev.includes(speciesId) ? prev.filter((id) => id !== speciesId) : [...prev, speciesId]))
    }

    const handleSpeciesMarkerClick = () => {
        if (selectedSpecies) {
            console.log("Species marker clicked:", selectedSpecies.common_name)
        }
    }

    const handleMarineSpeciesClick = () => {
        console.log("Toggling map mode")
        setIsSpeciesMode(!isSpeciesMode)
        setSelectedSite(null)
        setIsBottomSheetOpen(false)
    }

    const handleSelectSpecies = (species: MarineSpecies) => {
        console.log("Selected species:", species.common_name)
        setSelectedSpecies(species)
        setIsSpeciesMode(false)
        setIsSpeciesBrowserOpen(false)
        setIsLoadingSpecies(true)

        setTimeout(() => {
            setIsLoadingSpecies(false)
        }, 2000)
    }

    const handleFindDiveSitesForSpecies = () => {
        if (!selectedSpeciesForPopup) return

        console.log("Finding dive sites for species:", selectedSpeciesForPopup.common_name)

        setIsSpeciesMode(false)
        setSelectedSpeciesForPopup(null)

        const speciesSlug = selectedSpeciesForPopup.common_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        const matchingSites = diveSites.filter((site: DiveSiteWithMarineLife) => {
            if (!site.marine_life || typeof site.marine_life !== "string") return false
            try {
                const marineLifeArray = JSON.parse(site.marine_life)
                return marineLifeArray.some((name: string) => {
                    const nameSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    return nameSlug === speciesSlug
                })
            } catch (error) {
                console.error("Error parsing marine_life for site:", site.name, error)
                return false
            }
        })

        console.log("Found matching dive sites:", matchingSites.length)

        if (matchingSites.length > 0 && mapRef.current) {
            mapRef.current.flyTo({
                center: [matchingSites[0].longitude, matchingSites[0].latitude],
                zoom: matchingSites.length === 1 ? 14 : 10,
                duration: 2000,
            })
        }
    }

    const handleSpeciesAvatarClick = (species: MarineSpecies) => {
        console.log("Species avatar clicked:", species.common_name)
        setSelectedSpeciesForPopup(species)
    }

    useEffect(() => {}, [])

    useEffect(() => {
        if (diveSites.length === 0) return

        const allSpeciesNames = new Set<string>()

        diveSites.forEach((site: DiveSiteWithMarineLife) => {
            if (site.marine_life && typeof site.marine_life === "string") {
                try {
                    const marineLifeArray = JSON.parse(site.marine_life)
                    if (Array.isArray(marineLifeArray)) {
                        marineLifeArray.forEach((name) => allSpeciesNames.add(name))
                    }
                } catch (error) {
                    console.error("Error parsing marine_life for site:", site.name, error)
                }
            }
        })

        console.log("Found unique species from dive sites:", allSpeciesNames.size)
    }, [diveSites])

    useEffect(() => {
        async function fetchDiveSites() {
            const { data, error } = await supabase.from("dive_sites").select("*").order("name")

            if (error) {
                console.error("Error fetching dive sites:", error)
            } else {
                console.log(`Loaded ${data?.length || 0} dive sites from database`)
                setDiveSites((data || []) as DiveSiteWithMarineLife[])
            }
        }

        void fetchDiveSites()
    }, [])

    useEffect(() => {
        const fetchMarineSpecies = async () => {
            try {
                const { data, error } = await supabase.from("marine_species").select("*").order("common_name")

                if (error) {
                    console.error("Error fetching marine species:", error)
                    return
                }

                console.log("Fetched marine species from database:", data?.length || 0)
                setMarineSpecies(data || [])
            } catch (error) {
                console.error("Failed to fetch marine species:", error)
            }
        }

        fetchMarineSpecies()
    }, [])

    useEffect(() => {
        if (!mapRef.current || !searchQuery) return

        const query = searchQuery.toLowerCase()
        const locationCoordinates: Record<string, { longitude: number; latitude: number; zoom: number }> = {
            maldives: { longitude: 73.5, latitude: 4.2, zoom: 10 },
            bali: { longitude: 115.2, latitude: -8.4, zoom: 10 },
            egypt: { longitude: 34.5, latitude: 27.0, zoom: 7 },
            australia: { longitude: 145.0, latitude: -25.0, zoom: 5 },
            caribbean: { longitude: -75.0, latitude: 18.0, zoom: 6 },
            thailand: { longitude: 99.0, latitude: 8.0, zoom: 7 },
            indonesia: { longitude: 118.0, latitude: -2.0, zoom: 5 },
            philippines: { longitude: 122.0, latitude: 12.0, zoom: 6 },
        }

        for (const [location, coords] of Object.entries(locationCoordinates)) {
            if (query.includes(location)) {
                mapRef.current.flyTo({
                    center: [coords.longitude, coords.latitude],
                    zoom: coords.zoom,
                    duration: 2000,
                })
                break
            }
        }
    }, [searchQuery])

    useEffect(() => {
        setCurrentCardIndex(0)
    }, [isBottomSheetOpen, searchQuery])

    const filteredDiveSites = diveSites
        .filter((site: DiveSiteWithMarineLife) => {
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase()
                const matchesSearch =
                    site.name.toLowerCase().includes(query) ||
                    site.location_name.toLowerCase().includes(query) ||
                    site.description?.toLowerCase().includes(query)
                if (!matchesSearch) return false
            }

            if (filters.difficulty && site.difficulty !== filters.difficulty) {
                return false
            }

            if (filters.depthRange) {
                const depth = site.min_depth
                if (filters.depthRange === "Shallow (<18m)" && depth >= 18) return false
                if (filters.depthRange === "Medium (18-30m)" && (depth < 18 || depth > 30)) return false
                if (filters.depthRange === "Deep (>30m)" && depth <= 30) return false
            }

            return true
        })
        .sort((a, b) => {
            if (filters.sortBy) {
                return a.name.localeCompare(b.name)
            }
            return 0
        })

    const nextCard = () => {
        setCurrentCardIndex((prev) => (prev + 1) % filteredDiveSites.length)
    }

    const prevCard = () => {
        setCurrentCardIndex((prev) => (prev - 1 + filteredDiveSites.length) % filteredDiveSites.length)
    }

    const handleOverlayClick = () => {
        setIsBottomSheetOpen(false)
        setCurrentCardIndex(0)
    }

    const handleSearchClose = () => {
        console.log("handleSearchClose called - setting searchOpen to false")
        setSearchQuery("")
        setSearchOpen(false)
    }

    const handleSearchReset = () => {
        setSearchQuery("")
        setFilters({})
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [73.5, 4.2],
                zoom: 10,
                duration: 1500,
            })
        }
    }

    const handleLocationSelect = (coordinates: { longitude: number; latitude: number; zoom: number }) => {
        console.log("Flying to selected location:", coordinates)
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [coordinates.longitude, coordinates.latitude],
                zoom: coordinates.zoom,
                duration: 2000,
            })
        }
    }

    const handleDiveSiteSelect = (site: DiveSiteWithMarineLife) => {
        console.log("Selected dive site:", site.name)
        setSelectedSite(site)
        setIsDescriptionExpanded(false)
        setIsBottomSheetOpen(false)

        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [site.longitude, site.latitude],
                zoom: 14,
                duration: 2000,
            })
        }
    }

    const handleSearchExecute = () => {
        console.log("Executing search for:", searchQuery)

        const matchingSites = diveSites.filter((site: DiveSiteWithMarineLife) => {
            const query = searchQuery.toLowerCase()
            return (
                site.name.toLowerCase().includes(query) ||
                site.location_name.toLowerCase().includes(query) ||
                site.description?.toLowerCase().includes(query)
            )
        })

        console.log(`Found ${matchingSites.length} matching dive sites`)

        if (matchingSites.length > 0 && mapRef.current) {
            const firstSite = matchingSites[0]
            mapRef.current.flyTo({
                center: [firstSite.longitude, firstSite.latitude],
                zoom: matchingSites.length === 1 ? 14 : 10,
                duration: 2000,
            })
        }
    }

    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        return (
            <div className="flex h-screen items-center justify-center bg-red-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600">Mapbox Token Missing</h2>
                    <p className="mt-2 text-sm text-red-500">Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file</p>
                </div>
            </div>
        )
    }

    // Show Profile Page when profile tab is active
    if (activeTab === "profile") {
        return (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
                <ProfilePage />
                <BottomNav
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onSearchOpen={() => setSearchOpen(true)}
                    searchOpen={searchOpen}
                />
            </div>
        )
    }

    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#4A90E2" }}>
            <SearchBar
                isOpen={searchOpen}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClose={handleSearchClose}
                filters={filters}
                onFilterChange={setFilters}
                resultsCount={filteredDiveSites.length}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
                onReset={handleSearchReset}
                allDiveSites={diveSites}
                onLocationSelect={handleLocationSelect}
                onDiveSiteSelect={handleDiveSiteSelect}
                onSearchExecute={handleSearchExecute}
            />

            {isSpeciesBrowserOpen && (
                <SpeciesBrowser
                    species={marineSpecies}
                    onSpeciesSelect={handleSelectSpecies}
                    selectedSpeciesId={selectedSpecies?.id}
                    onClose={() => setIsSpeciesBrowserOpen(false)}
                    onFavorite={handleFavoriteToggle}
                    favorites={favorites}
                />
            )}

            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: 0,
                    latitude: 20,
                    zoom: 2,
                }}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                mapStyle="mapbox://styles/legrelle/cmj358rgb009r01se6gmwcz2q"
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            >
                <MapControls onMarineSpeciesClick={handleMarineSpeciesClick} />

                {!isSpeciesMode &&
                    !isSpeciesBrowserOpen &&
                    filteredDiveSites.map((site: DiveSiteWithMarineLife, index: number) => (
                        <Marker key={site.id} longitude={site.longitude} latitude={site.latitude}>
                            <MapMarker index={index} onClick={() => handleDiveSiteSelect(site)} />
                        </Marker>
                    ))}

                {isSpeciesMode &&
                    uniqueSpeciesFromSites.map((species) => {
                        const sitesWithSpecies = diveSites.filter((site: DiveSiteWithMarineLife) => {
                            if (!site.marine_life || typeof site.marine_life !== "string") return false
                            try {
                                const marineLifeArray = JSON.parse(site.marine_life)
                                const speciesSlug = species.common_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                                return marineLifeArray.some((name: string) => {
                                    const nameSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                                    return nameSlug === speciesSlug
                                })
                            } catch (error) {
                                console.error("Error parsing marine_life:", error)
                                return false
                            }
                        })

                        if (sitesWithSpecies.length === 0) return null
                        const representativeSite = sitesWithSpecies[0]

                        return (
                            <Marker key={species.id} longitude={representativeSite.longitude} latitude={representativeSite.latitude}>
                                <div
                                    onClick={() => handleSpeciesAvatarClick(species)}
                                    style={{
                                        cursor: "pointer",
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            border: "3px solid white",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.2), 0 0 20px rgba(74, 144, 226, 0.3)",
                                            transition: "transform 0.2s",
                                            overflow: "hidden",
                                            background: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onMouseEnter={(e: any) => {
                                            e.currentTarget.style.transform = "scale(1.1)"
                                        }}
                                        onMouseLeave={(e: any) => {
                                            e.currentTarget.style.transform = "scale(1)"
                                        }}
                                    >
                                        {species.image_url ? (
                                            <img
                                                src={species.image_url || "/placeholder.svg"}
                                                alt={species.common_name}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                                onError={(e: any) => {
                                                    e.currentTarget.style.display = "none"
                                                    const parent = e.currentTarget.parentElement
                                                    if (parent) {
                                                        parent.innerHTML = '<div style="font-size: 30px;">🐠</div>'
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div style={{ fontSize: "30px" }}>🐠</div>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "-8px",
                                            right: "-8px",
                                            background: "white",
                                            borderRadius: "12px",
                                            padding: "4px 8px",
                                            fontSize: "10px",
                                            fontWeight: "700",
                                            color: "#3B82F6",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {sitesWithSpecies.length}
                                    </div>
                                </div>
                            </Marker>
                        )
                    })}
            </Map>

            <div
                style={{
                    position: "fixed",
                    bottom: "100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 50,
                }}
            >
                <button
                    onClick={() => setIsBottomSheetOpen(!isBottomSheetOpen)}
                    style={{
                        padding: "16px 32px",
                        background: "#94E0FF",
                        border: "none",
                        borderRadius: "24px",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1F2937",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                    }}
                >
                    <span>{filteredDiveSites.length} dive sites</span>
                    <span style={{ fontSize: "12px" }}>{isBottomSheetOpen ? "▼" : "▲"}</span>
                </button>
            </div>

            {isBottomSheetOpen && (
                <div
                    onClick={handleOverlayClick}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.3)",
                        zIndex: 49,
                    }}
                />
            )}

            {isBottomSheetOpen && filteredDiveSites.length > 0 && (
                <SiteCarousel
                    sites={filteredDiveSites}
                    onCardClick={(site) => {
                        setSelectedSite(site)
                        setIsBottomSheetOpen(false)
                        setIsDescriptionExpanded(false)
                    }}
                    onClose={handleOverlayClick}
                    getDifficultyIcon={getDifficultyIcon}
                    onIndexChange={setCurrentCardIndex}
                />
            )}

            {selectedSite && (
                <SitePopup
                    site={selectedSite}
                    imageUrl={selectedSite.image_url || ""}
                    isDescriptionExpanded={isDescriptionExpanded}
                    onClose={() => setSelectedSite(null)}
                    onToggleDescription={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    onFavorite={(siteId) => {
                        setFavorites((prev) => (prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]))
                    }}
                    isFavorite={favorites.includes(selectedSite.id)}
                />
            )}

            {selectedSpeciesForPopup && (
                <SpeciesPopup
                    species={selectedSpeciesForPopup}
                    imageUrl={selectedSpeciesForPopup.image_url}
                    onClose={() => setSelectedSpeciesForPopup(null)}
                    onFindDiveSites={handleFindDiveSitesForSpecies}
                    scientificName={selectedSpeciesForPopup.scientific_name}
                    habitat={selectedSpeciesForPopup.habitat}
                    bestMonths={selectedSpeciesForPopup.best_months}
                    sightingsCount={
                        diveSites.filter((site: DiveSiteWithMarineLife) => {
                            if (!site.marine_life || typeof site.marine_life !== "string") return false
                            try {
                                const marineLifeArray = JSON.parse(site.marine_life)
                                const speciesSlug = selectedSpeciesForPopup.common_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                                return marineLifeArray.some((name: string) => {
                                    const nameSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                                    return nameSlug === speciesSlug
                                })
                            } catch (error) {
                                return false
                            }
                        }).length
                    }
                />
            )}

            <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSearchOpen={() => setSearchOpen(true)}
                searchOpen={searchOpen}
            />

            <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    )
}
