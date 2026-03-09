"use client"

import { useState, useRef } from "react"
import { X, Camera, ChevronDown, MapPin, Instagram, Globe, Eye, EyeOff, Users, Map } from "lucide-react"

interface EditProfileData {
    displayName: string
    username: string
    bio: string
    location: string
    diverLevel: string
    instagram: string
    website: string
    showDiveLogPublicly: boolean
    allowFriendRequests: boolean
    showLocationOnDives: boolean
    coverImage: string
    avatarImage: string
}

const DIVER_LEVELS = [
    "Beginner",
    "Hobby diver",
    "Advanced",
    "Professional",
    "Instructor",
]

interface EditProfilePageProps {
    onClose: () => void
    onSave: (data: EditProfileData) => void
    initialData?: Partial<EditProfileData>
}

export function EditProfilePage({ onClose, onSave, initialData }: EditProfilePageProps) {
    const [formData, setFormData] = useState<EditProfileData>({
        displayName: initialData?.displayName || "Alfred Wagner",
        username: initialData?.username || "Alwagner",
        bio: initialData?.bio || "",
        location: initialData?.location || "",
        diverLevel: initialData?.diverLevel || "Hobby diver",
        instagram: initialData?.instagram || "",
        website: initialData?.website || "",
        showDiveLogPublicly: initialData?.showDiveLogPublicly ?? true,
        allowFriendRequests: initialData?.allowFriendRequests ?? true,
        showLocationOnDives: initialData?.showLocationOnDives ?? true,
        coverImage: initialData?.coverImage || "/images/profile-cover.jpg",
        avatarImage: initialData?.avatarImage || "/images/profile-avatar.jpg",
    })

    const [showLevelDropdown, setShowLevelDropdown] = useState(false)
    const coverInputRef = useRef<HTMLInputElement>(null)
    const avatarInputRef = useRef<HTMLInputElement>(null)

    const handleInputChange = (field: keyof EditProfileData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setFormData((prev) => ({ ...prev, coverImage: url }))
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setFormData((prev) => ({ ...prev, avatarImage: url }))
        }
    }

    const handleSave = () => {
        onSave(formData)
        onClose()
    }

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
                zIndex: 2000,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    backgroundColor: "#B8D4E8",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    borderBottom: "1px solid rgba(26, 39, 68, 0.1)",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "none",
                        border: "none",
                        color: "#1A2744",
                        fontSize: "16px",
                        fontWeight: 500,
                        cursor: "pointer",
                        padding: "8px",
                        marginLeft: "-8px",
                    }}
                >
                    <X size={24} />
                </button>

                <h1
                    style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#1A2744",
                        margin: 0,
                    }}
                >
                    Edit Profile
                </h1>

                <button
                    onClick={handleSave}
                    style={{
                        backgroundColor: "#1A2744",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        padding: "10px 24px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Save
                </button>
            </div>

            {/* Cover Photo Section */}
            <div style={{ position: "relative", height: "160px" }}>
                <img
                    src={formData.coverImage}
                    alt="Cover"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            border: "none",
                            borderRadius: "24px",
                            padding: "12px 20px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#1A2744",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Camera size={18} />
                        Change Cover
                    </button>
                </div>
                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    style={{ display: "none" }}
                />

                {/* Avatar */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "-50px",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                        }}
                    >
                        <div
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                border: "4px solid white",
                                overflow: "hidden",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                            }}
                        >
                            <img
                                src={formData.avatarImage}
                                alt="Avatar"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <button
                            onClick={() => avatarInputRef.current?.click()}
                            style={{
                                position: "absolute",
                                bottom: "0",
                                right: "0",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#1A2744",
                                border: "3px solid white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            }}
                        >
                            <Camera size={16} color="white" />
                        </button>
                    </div>
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            {/* Form Content */}
            <div style={{ padding: "70px 20px 40px" }}>
                {/* Basic Information Section */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        padding: "24px",
                        marginBottom: "20px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#5A6A7A",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            margin: 0,
                            marginBottom: "20px",
                        }}
                    >
                        Basic Information
                    </h2>

                    {/* Display Name */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1A2744",
                                marginBottom: "8px",
                            }}
                        >
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => handleInputChange("displayName", e.target.value)}
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                fontSize: "16px",
                                border: "2px solid #E8EEF2",
                                borderRadius: "12px",
                                backgroundColor: "#F8FAFC",
                                color: "#1A2744",
                                outline: "none",
                                transition: "border-color 0.2s",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#1A2744")}
                            onBlur={(e) => (e.target.style.borderColor = "#E8EEF2")}
                        />
                    </div>

                    {/* Username */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1A2744",
                                marginBottom: "8px",
                            }}
                        >
                            Username
                        </label>
                        <div style={{ position: "relative" }}>
                            <span
                                style={{
                                    position: "absolute",
                                    left: "16px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#5A6A7A",
                                    fontSize: "16px",
                                }}
                            >
                                @
                            </span>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleInputChange("username", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "14px 16px 14px 32px",
                                    fontSize: "16px",
                                    border: "2px solid #E8EEF2",
                                    borderRadius: "12px",
                                    backgroundColor: "#F8FAFC",
                                    color: "#1A2744",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#1A2744")}
                                onBlur={(e) => (e.target.style.borderColor = "#E8EEF2")}
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1A2744",
                                marginBottom: "8px",
                            }}
                        >
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            placeholder="Tell others about yourself..."
                            maxLength={150}
                            rows={3}
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                fontSize: "16px",
                                border: "2px solid #E8EEF2",
                                borderRadius: "12px",
                                backgroundColor: "#F8FAFC",
                                color: "#1A2744",
                                outline: "none",
                                transition: "border-color 0.2s",
                                resize: "none",
                                fontFamily: "inherit",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#1A2744")}
                            onBlur={(e) => (e.target.style.borderColor = "#E8EEF2")}
                        />
                        <p
                            style={{
                                fontSize: "12px",
                                color: "#5A6A7A",
                                margin: "8px 0 0",
                                textAlign: "right",
                            }}
                        >
                            {formData.bio.length}/150
                        </p>
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1A2744",
                                marginBottom: "8px",
                            }}
                        >
                            Location
                        </label>
                        <div style={{ position: "relative" }}>
                            <MapPin
                                size={18}
                                color="#5A6A7A"
                                style={{
                                    position: "absolute",
                                    left: "16px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            />
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                placeholder="e.g., Maldives, Egypt, Philippines"
                                style={{
                                    width: "100%",
                                    padding: "14px 16px 14px 44px",
                                    fontSize: "16px",
                                    border: "2px solid #E8EEF2",
                                    borderRadius: "12px",
                                    backgroundColor: "#F8FAFC",
                                    color: "#1A2744",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#1A2744")}
                                onBlur={(e) => (e.target.style.borderColor = "#E8EEF2")}
                            />
                        </div>
                    </div>
                </div>

                {/* Diver Level Section */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        padding: "24px",
                        marginBottom: "20px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#5A6A7A",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            margin: 0,
                            marginBottom: "20px",
                        }}
                    >
                        Diver Level
                    </h2>

                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                fontSize: "16px",
                                border: "2px solid #E8EEF2",
                                borderRadius: "12px",
                                backgroundColor: "#F8FAFC",
                                color: "#1A2744",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                textAlign: "left",
                            }}
                        >
                            <span>{formData.diverLevel}</span>
                            <ChevronDown
                                size={20}
                                color="#5A6A7A"
                                style={{
                                    transform: showLevelDropdown ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s",
                                }}
                            />
                        </button>

                        {showLevelDropdown && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 8px)",
                                    left: 0,
                                    right: 0,
                                    backgroundColor: "white",
                                    borderRadius: "12px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                    zIndex: 100,
                                    overflow: "hidden",
                                }}
                            >
                                {DIVER_LEVELS.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => {
                                            handleInputChange("diverLevel", level)
                                            setShowLevelDropdown(false)
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "14px 16px",
                                            fontSize: "16px",
                                            border: "none",
                                            backgroundColor: formData.diverLevel === level ? "#F0F7FF" : "white",
                                            color: "#1A2744",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            borderBottom: "1px solid #E8EEF2",
                                        }}
                                    >
                                        {level}
                                        {formData.diverLevel === level && (
                                            <span style={{ float: "right", color: "#3B82F6" }}>✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Social Links Section */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        padding: "24px",
                        marginBottom: "20px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#5A6A7A",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            margin: 0,
                            marginBottom: "20px",
                        }}
                    >
                        Social Links
                    </h2>

                    {/* Instagram */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1A2744",
                                marginBottom: "8px",
                            }}
                        >
                            Instagram
                        </label>
                        <div style={{ position: "relative" }}>
                            <Instagram
                                size={18}
                                color="#5A6A7A"
                                style={{
                                    position: "absolute",
                                    left: "16px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            />
                            <input
                                type="text"
                                value={formData.instagram}
                                onChange={(e) => handleInputChange("instagram", e.target.value)}
                                placeholder="username"
                                style={{
                                    width: "100%",
                                    padding: "14px 16px 14px 44px",
                                    fontSize: "16px",
                                    border: "2px solid #E8EEF2",
                                    borderRadius: "12px",
                                    backgroundColor: "#F8FAFC",
                                    color: "#1A2744",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#1A2744")}
                                onBlur={(e) => (e.target.style.borderColor = "#E8EEF2")}
                            />
                        </div>
                    </div>

                    {/* Website */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1A2744",
                                marginBottom: "8px",
                            }}
                        >
                            Website
                        </label>
                        <div style={{ position: "relative" }}>
                            <Globe
                                size={18}
                                color="#5A6A7A"
                                style={{
                                    position: "absolute",
                                    left: "16px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            />
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => handleInputChange("website", e.target.value)}
                                placeholder="https://yourwebsite.com"
                                style={{
                                    width: "100%",
                                    padding: "14px 16px 14px 44px",
                                    fontSize: "16px",
                                    border: "2px solid #E8EEF2",
                                    borderRadius: "12px",
                                    backgroundColor: "#F8FAFC",
                                    color: "#1A2744",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#1A2744")}
                                onBlur={(e) => (e.target.style.borderColor = "#E8EEF2")}
                            />
                        </div>
                    </div>
                </div>

                {/* Privacy Section */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        padding: "24px",
                        marginBottom: "40px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#5A6A7A",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            margin: 0,
                            marginBottom: "20px",
                        }}
                    >
                        Privacy Settings
                    </h2>

                    {/* Toggle Items */}
                    <ToggleItem
                        icon={<Eye size={20} color="#1A2744" />}
                        label="Show dive log publicly"
                        description="Others can see your dive history"
                        checked={formData.showDiveLogPublicly}
                        onChange={(checked) => handleInputChange("showDiveLogPublicly", checked)}
                    />

                    <ToggleItem
                        icon={<Users size={20} color="#1A2744" />}
                        label="Allow friend requests"
                        description="Let other divers connect with you"
                        checked={formData.allowFriendRequests}
                        onChange={(checked) => handleInputChange("allowFriendRequests", checked)}
                    />

                    <ToggleItem
                        icon={<Map size={20} color="#1A2744" />}
                        label="Show location on dives"
                        description="Display dive locations on your profile"
                        checked={formData.showLocationOnDives}
                        onChange={(checked) => handleInputChange("showLocationOnDives", checked)}
                        isLast
                    />
                </div>
            </div>
        </div>
    )
}

// Toggle Item Component
function ToggleItem({
    icon,
    label,
    description,
    checked,
    onChange,
    isLast = false,
}: {
    icon: React.ReactNode
    label: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
    isLast?: boolean
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 0",
                borderBottom: isLast ? "none" : "1px solid #E8EEF2",
            }}
        >
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: "#F0F7FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>

            <div style={{ flex: 1 }}>
                <p
                    style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#1A2744",
                        margin: 0,
                        marginBottom: "2px",
                    }}
                >
                    {label}
                </p>
                <p
                    style={{
                        fontSize: "13px",
                        color: "#5A6A7A",
                        margin: 0,
                    }}
                >
                    {description}
                </p>
            </div>

            {/* Custom Toggle Switch */}
            <button
                onClick={() => onChange(!checked)}
                style={{
                    width: "52px",
                    height: "32px",
                    borderRadius: "16px",
                    backgroundColor: checked ? "#1A2744" : "#E8EEF2",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background-color 0.2s",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "3px",
                        left: checked ? "23px" : "3px",
                        transition: "left 0.2s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    }}
                />
            </button>
        </div>
    )
}
