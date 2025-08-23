"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import * as htmlToImage from "html-to-image";

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  description: string;
  location?: string;
  profile_image_url: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

interface TwitterCardProps {
  username: string;
  onBack: () => void;
}

export default function TwitterCard({ username, onBack }: TwitterCardProps) {
  const [user, setUser] = useState<TwitterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/twitter/${username}`);
        const data = await res.json();
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const downloadCard = async () => {
    if (cardRef.current && !isDownloading) {
      setIsDownloading(true);
      try {
        const dataUrl = await htmlToImage.toPng(cardRef.current, {
          pixelRatio: 2,
          // preserve the card's radial background by not forcing a backgroundColor
          cacheBust: true,
        });

        const link = document.createElement("a");
        link.download = `${username}-twitter-card.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error downloading card:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Profile Not Found
        </h3>
        <p className="text-gray-600 mb-6">
          The username &ldquo;{username}&rdquo; could not be found or is
          private.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Try Another Username
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Search</span>
        </button>

        <button
          onClick={downloadCard}
          disabled={isDownloading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download Card</span>
            </>
          )}
        </button>
      </div>

      {/* Twitter Card */}
      <div
        ref={cardRef}
        className="relative max-w-md mx-auto  shadow-2xl overflow-hidden border border-gray-100"
      >
        
          {/* Emerald Depths Background with Top Glow */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16, 185, 129, 0.25), transparent 70%), #000000",
            }}
          />

         

        {/* Content (white surface sits above the radial background) */}
        <div className="relative p-8   m-6">
          {/* Profile Section */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <Image
                src={user.profile_image_url}
                alt={user.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-300 mb-1">
              {user.name}
            </h2>
            <p className="text-blue-400 font-medium mb-3">@{user.username}</p>

            {user.description && (
              <p className="text-gray-200 text-sm leading-relaxed mb-3 max-w-xs mx-auto">
                {user.description}
              </p>
            )}

            {user.location && (
              <div className="flex items-center justify-center text-gray-300 text-sm">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {user.location}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(user.public_metrics.followers_count)}
              </div>
              <div className="text-xs text-gray-300 font-medium uppercase tracking-wide">
                Followers
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(user.public_metrics.following_count)}
              </div>
              <div className="text-xs text-gray-300 font-medium uppercase tracking-wide">
                Following
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(user.public_metrics.tweet_count)}
              </div>
              <div className="text-xs text-gray-300 font-medium uppercase tracking-wide">
                Tweets
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="mt-6 text-center">
            <div className="text-xs text-gray-400 font-medium">
              Created with ❤️ by Shresth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
