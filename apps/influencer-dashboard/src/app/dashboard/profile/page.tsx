"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  Link2,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phoneNumber: profile?.phoneNumber || "",
    bio: profile?.bio || "",
    socialMedia: {
      instagram: profile?.socialMedia?.instagram || "",
      youtube: profile?.socialMedia?.youtube || "",
      twitter: profile?.socialMedia?.twitter || "",
      facebook: profile?.socialMedia?.facebook || "",
    },
    followers: {
      instagram: profile?.followers?.instagram || 0,
      youtube: profile?.followers?.youtube || 0,
      twitter: profile?.followers?.twitter || 0,
      facebook: profile?.followers?.facebook || 0,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put("/api/influencers/profile", formData);
      toast.success("Profile updated successfully!");
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleFollowersChange = (platform: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      followers: {
        ...prev.followers,
        [platform]: value,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and social media accounts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="+91 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl shadow-sm p-6 border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Your Referral Code
              </h3>
              <p className="text-sm text-gray-600">
                Share this code with your audience to earn commissions
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">
                {profile?.referralCode || "---"}
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Social Media Accounts
          </h3>
          <div className="space-y-4">
            {/* Instagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Instagram className="inline h-4 w-4 mr-2 text-pink-600" />
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.socialMedia.instagram}
                  onChange={(e) =>
                    handleSocialChange("instagram", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="@yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Followers
                </label>
                <input
                  type="number"
                  value={formData.followers.instagram}
                  onChange={(e) =>
                    handleFollowersChange(
                      "instagram",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>

            {/* YouTube */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Youtube className="inline h-4 w-4 mr-2 text-red-600" />
                  YouTube Channel
                </label>
                <input
                  type="text"
                  value={formData.socialMedia.youtube}
                  onChange={(e) =>
                    handleSocialChange("youtube", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Channel URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscribers
                </label>
                <input
                  type="number"
                  value={formData.followers.youtube}
                  onChange={(e) =>
                    handleFollowersChange(
                      "youtube",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Twitter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Twitter className="inline h-4 w-4 mr-2 text-blue-400" />
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={formData.socialMedia.twitter}
                  onChange={(e) =>
                    handleSocialChange("twitter", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="@yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Followers
                </label>
                <input
                  type="number"
                  value={formData.followers.twitter}
                  onChange={(e) =>
                    handleFollowersChange(
                      "twitter",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Facebook className="inline h-4 w-4 mr-2 text-blue-600" />
                  Facebook Page
                </label>
                <input
                  type="text"
                  value={formData.socialMedia.facebook}
                  onChange={(e) =>
                    handleSocialChange("facebook", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Page URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Followers
                </label>
                <input
                  type="number"
                  value={formData.followers.facebook}
                  onChange={(e) =>
                    handleFollowersChange(
                      "facebook",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
