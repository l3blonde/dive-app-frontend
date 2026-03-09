"use client"

import { useState } from "react"
import { Pencil, Fish, User, ChevronRight, LogOut, HelpCircle, MessageSquare, FileText } from "lucide-react"

interface ProfileData {
    name: string
    username: string
    level: string
    following: number
    friends: number
    speciesDiscovered: number
    loggedDives: number
    coverImage: string
    avatarImage: string
}

interface SpeciesCategory {
    id: string
    name: string
    count: number
    icon: "fish" | "mollusk" | "reptile" | "coral"
    color: string
}

interface FavoriteSpecies {
    id: string
    name: string
    image: string
}

interface Badge {
    id: string
    name: string
    image: string
}

const MOCK_PROFILE: ProfileData = {
    name: "Alfred Wagner",
    username: "@Alwagner",
    level: "Hobby diver",
    following: 11,
    friends: 5,
    speciesDiscovered: 30,
    loggedDives: 15,
    coverImage: "/images/profile-cover.jpg",
    avatarImage: "/images/profile-avatar.jpg",
}

const SPECIES_CATEGORIES: SpeciesCategory[] = [
    { id: "fish", name: "Fish", count: 39, icon: "fish", color: "#EF4444" },
    { id: "mollusk", name: "Mollusk", count: 14, icon: "mollusk", color: "#EF4444" },
    { id: "reptile", name: "Sea reptiles", count: 12, icon: "reptile", color: "#EF4444" },
    { id: "coral", name: "Corals", count: 8, icon: "coral", color: "#EF4444" },
]

const FAVORITE_SPECIES: FavoriteSpecies[] = [
    { id: "grey-reef-shark", name: "Grey reef shark", image: "/images/species/grey-reef-shark.jpg" },
    { id: "parrotfish", name: "Parrotfish", image: "/images/species/parrotfish.jpg" },
    { id: "napoleon-wrasse", name: "Napoleon Wrasse", image: "/images/species/napoleon-wrasse.jpg" },
]

const BADGES: Badge[] = [
    { id: "fish-finder", name: "Fish Finder", image: "/images/badges/fish-badge.jpg" },
    { id: "deep-diver", name: "Deep Diver", image: "/images/badges/pufferfish-badge.jpg" },
    { id: "explorer", name: "Explorer", image: "/images/badges/diver-badge.jpg" },
]

// Wave SVG component for decorative dividers
function WaveDivider({ flip = false, color = "#1A2744" }: { flip?: boolean; color?: string }) {
    return (
        <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                width: "100%",
                height: "60px",
                display: "block",
                transform: flip ? "scaleY(-1)" : "none",
            }}
            preserveAspectRatio="none"
        >
            <path
                d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
                fill={color}
            />
        </svg>
    )
}

// Category icon component
function CategoryIcon({ type, color }: { type: string; color: string }) {
    const iconStyle = {
        width: "28px",
        height: "28px",
        backgroundColor: color,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }

    const renderIcon = () => {
        switch (type) {
            case "fish":
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M2 16s1-4 6-4c3 0 5.5 2.5 9 2.5 5 0 7-4 7-4s-2-4-7-4c-3.5 0-6 2.5-9 2.5-5 0-6-4-6-4" />
                    </svg>
                )
            case "mollusk":
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <circle cx="8" cy="8" r="2" />
                        <circle cx="16" cy="8" r="2" />
                        <circle cx="8" cy="16" r="2" />
                        <circle cx="16" cy="16" r="2" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )
            case "reptile":
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" />
                        <path d="M8 10c0-2 2-4 4-4" />
                    </svg>
                )
            case "coral":
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 22V12" />
                        <path d="M12 12C12 8 8 6 8 2" />
                        <path d="M12 12C12 8 16 6 16 2" />
                        <path d="M12 16C12 14 9 13 9 10" />
                        <path d="M12 16C12 14 15 13 15 10" />
                    </svg>
                )
            default:
                return <Fish size={16} color="white" />
        }
    }

    return <div style={iconStyle}>{renderIcon()}</div>
}

interface ProfilePageProps {
    onClose?: () => void
}

export function ProfilePage({ onClose }: ProfilePageProps) {
    const [profile] = useState<ProfileData>(MOCK_PROFILE)

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#B8D4E8",
                overflowY: "auto",
                overflowX: "hidden",
                zIndex: 1000,
                paddingBottom: "100px",
            }}
        >
            {/* Cover Image Section */}
            <div style={{ position: "relative", height: "180px" }}>
                <img
                    src={profile.coverImage}
                    alt="Cover"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                
                {/* Edit Profile Button */}
                <button
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "24px",
                        padding: "10px 16px",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#1A2744",
                    }}
                >
                    Edit profile
                    <Pencil size={16} />
                </button>

                {/* Avatar */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "-40px",
                        left: "24px",
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        border: "4px solid white",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                >
                    <img
                        src={profile.avatarImage}
                        alt={profile.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </div>
            </div>

            {/* Profile Info Section */}
            <div style={{ padding: "0 24px", paddingTop: "50px" }}>
                {/* Level Badge */}
                <div
                    style={{
                        display: "inline-block",
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#1A2744",
                        marginBottom: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    {profile.level}
                </div>

                {/* Name */}
                <h1
                    style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#1A2744",
                        margin: 0,
                        marginBottom: "4px",
                    }}
                >
                    {profile.name}
                </h1>

                {/* Username */}
                <p
                    style={{
                        fontSize: "14px",
                        color: "#5A6A7A",
                        margin: 0,
                        marginBottom: "8px",
                    }}
                >
                    {profile.username}
                </p>

                {/* Following/Friends */}
                <p
                    style={{
                        fontSize: "14px",
                        color: "#5A6A7A",
                        margin: 0,
                    }}
                >
                    Following: {profile.following} | Friends: {profile.friends}
                </p>
            </div>

            {/* Collected Section */}
            <div style={{ padding: "24px", paddingTop: "32px" }}>
                <h2
                    style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#1A2744",
                        margin: 0,
                        marginBottom: "16px",
                    }}
                >
                    Collected
                </h2>

                <div style={{ display: "flex", gap: "12px" }}>
                    {/* Species Discovered Card */}
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    >
                        <Fish size={24} color="#1A2744" style={{ marginBottom: "12px" }} />
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#5A6A7A",
                                margin: 0,
                                marginBottom: "4px",
                            }}
                        >
                            Species discovered
                        </p>
                        <p
                            style={{
                                fontSize: "28px",
                                fontWeight: 700,
                                color: "#1A2744",
                                margin: 0,
                            }}
                        >
                            {profile.speciesDiscovered}
                        </p>
                    </div>

                    {/* Logged Dives Card */}
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2744" strokeWidth="2" style={{ marginBottom: "12px" }}>
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <path d="M3 10h18" />
                        </svg>
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#5A6A7A",
                                margin: 0,
                                marginBottom: "4px",
                            }}
                        >
                            Logged dives
                        </p>
                        <p
                            style={{
                                fontSize: "28px",
                                fontWeight: 700,
                                color: "#1A2744",
                                margin: 0,
                            }}
                        >
                            {profile.loggedDives}
                        </p>
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <WaveDivider color="#1A2744" />

            {/* Species Categories Section - Dark Background */}
            <div style={{ backgroundColor: "#1A2744", padding: "0 24px", paddingBottom: "24px", marginTop: "-1px" }}>
                <h2
                    style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "white",
                        margin: 0,
                        marginBottom: "8px",
                    }}
                >
                    Species categories
                </h2>
                <p
                    style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.7)",
                        margin: 0,
                        marginBottom: "20px",
                    }}
                >
                    Categories of your most discovered species
                </p>

                {/* Horizontal scrolling categories */}
                <div
                    className="hide-scrollbar"
                    style={{
                        display: "flex",
                        gap: "12px",
                        overflowX: "auto",
                        paddingBottom: "8px",
                        marginLeft: "-24px",
                        marginRight: "-24px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                    }}
                >
                    {SPECIES_CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            style={{
                                minWidth: "100px",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderRadius: "16px",
                                padding: "16px",
                                textAlign: "center",
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                                <CategoryIcon type={category.icon} color={category.color} />
                            </div>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "white",
                                    margin: 0,
                                    marginBottom: "4px",
                                    fontWeight: 500,
                                }}
                            >
                                {category.name}
                            </p>
                            <p
                                style={{
                                    fontSize: "20px",
                                    fontWeight: 700,
                                    color: "white",
                                    margin: 0,
                                }}
                            >
                                {category.count}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Favorite Species Section - Still on dark background */}
            <div style={{ backgroundColor: "#1A2744", padding: "24px", paddingTop: "0" }}>
                <h2
                    style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "white",
                        margin: 0,
                        marginBottom: "8px",
                    }}
                >
                    Favorite species
                </h2>
                <p
                    style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.7)",
                        margin: 0,
                        marginBottom: "20px",
                    }}
                >
                    {"A list of species you'd like to come back to"}
                </p>

                {/* Favorite species carousel */}
                <div
                    className="hide-scrollbar"
                    style={{
                        display: "flex",
                        gap: "16px",
                        overflowX: "auto",
                        marginLeft: "-24px",
                        marginRight: "-24px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                    }}
                >
                    {FAVORITE_SPECIES.map((species) => (
                        <div
                            key={species.id}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "8px",
                                minWidth: "80px",
                            }}
                        >
                            <div
                                style={{
                                    width: "72px",
                                    height: "72px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "3px solid rgba(255,255,255,0.3)",
                                }}
                            >
                                <img
                                    src={species.image}
                                    alt={species.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: "white",
                                    margin: 0,
                                    textAlign: "center",
                                    maxWidth: "80px",
                                    lineHeight: "1.3",
                                }}
                            >
                                {species.name}
                            </p>
                        </div>
                    ))}
                </div>

                {/* See more link */}
                <div style={{ marginTop: "16px", textAlign: "right" }}>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            color: "#EF4444",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        See more
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Wave Divider - reversed */}
            <WaveDivider flip color="#1A2744" />

            {/* Badges Section - Light Background */}
            <div style={{ backgroundColor: "#B8D4E8", padding: "24px", paddingTop: "0", marginTop: "-1px" }}>
                <h2
                    style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#1A2744",
                        margin: 0,
                        marginBottom: "20px",
                    }}
                >
                    Badges
                </h2>

                <div
                    className="hide-scrollbar"
                    style={{
                        display: "flex",
                        gap: "16px",
                        overflowX: "auto",
                        marginLeft: "-24px",
                        marginRight: "-24px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                    }}
                >
                    {BADGES.map((badge) => (
                        <div
                            key={badge.id}
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "4px solid white",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                flexShrink: 0,
                            }}
                        >
                            <img
                                src={badge.image}
                                alt={badge.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Section */}
            <div style={{ backgroundColor: "#B8D4E8", padding: "24px", paddingTop: "8px" }}>
                <h2
                    style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#1A2744",
                        margin: 0,
                        marginBottom: "16px",
                    }}
                >
                    Settings
                </h2>

                {/* General Settings */}
                <p
                    style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#5A6A7A",
                        margin: 0,
                        marginBottom: "12px",
                    }}
                >
                    General
                </p>

                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        marginBottom: "20px",
                    }}
                >
                    <SettingsItem icon={<User size={20} color="#5A6A7A" />} label="Account" />
                    <SettingsItem icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A6A7A" strokeWidth="2"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>} label="Diver information" />
                    <SettingsItem icon={<LogOut size={20} color="#5A6A7A" />} label="Log out" isLast />
                </div>

                {/* Support Settings */}
                <p
                    style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#5A6A7A",
                        margin: 0,
                        marginBottom: "12px",
                    }}
                >
                    Support
                </p>

                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <SettingsItem icon={<FileText size={20} color="#5A6A7A" />} label="Privacy policy" />
                    <SettingsItem icon={<HelpCircle size={20} color="#5A6A7A" />} label="Help" />
                    <SettingsItem icon={<MessageSquare size={20} color="#5A6A7A" />} label="Feedback" isLast />
                </div>
            </div>
        </div>
    )
}

// Settings Item Component
function SettingsItem({
    icon,
    label,
    isLast = false,
}: {
    icon: React.ReactNode
    label: string
    isLast?: boolean
}) {
    return (
        <button
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "none",
                border: "none",
                borderBottom: isLast ? "none" : "1px solid #F0F0F0",
                cursor: "pointer",
                textAlign: "left",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {icon}
                <span style={{ fontSize: "15px", color: "#1A2744" }}>{label}</span>
            </div>
            <ChevronRight size={20} color="#C0C0C0" />
        </button>
    )
}
