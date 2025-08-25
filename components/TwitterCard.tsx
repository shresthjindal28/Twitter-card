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
  const [isSharingTwitter, setIsSharingTwitter] = useState(false);
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

  const shareToTwitter = async () => {
    if (cardRef.current && !isSharingTwitter) {
      setIsSharingTwitter(true);
      try {
        // Generate image as blob
        const dataUrl = await htmlToImage.toPng(cardRef.current, {
          pixelRatio: 2,
          cacheBust: true,
        });

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `${username}-twitter-card.png`, {
          type: "image/png",
        });

        // Check if Web Share API is available and supports files
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          await navigator.share({
            title: `${user?.name}'s Twitter Card`,
            text: `Check out @${username}'s Twitter card! 🐦✨ #TwitterCard #SocialMedia`,
            files: [file],
          });
        } else {
          // Fallback: Copy image to clipboard and open Twitter
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ]);

            // Open Twitter with pre-filled text
            const tweetText = `Check out @${username}'s Twitter card! 🐦✨ #TwitterCard #SocialMedia\nView it at https://twitter-card.shresthjindal.com`;
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              tweetText
            )}`;
            window.open(twitterUrl, "_blank");

            alert(
              "Image copied to clipboard! 📋\nPaste it in your tweet on Twitter (Ctrl/Cmd + V)"
            );
          } catch {
            // If clipboard fails, download the image
            const link = document.createElement("a");
            link.download = `${username}-twitter-card.png`;
            link.href = dataUrl;
            link.click();

            const tweetText = `Check out @${username}'s Twitter card! 🐦✨ #TwitterCard #SocialMedia`;
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              tweetText
            )}`;
            window.open(twitterUrl, "_blank");

            alert(
              "Image downloaded! 📥\nAttach the downloaded image to your tweet on Twitter."
            );
          }
        }
      } catch (error) {
        console.error("Error sharing to Twitter:", error);
        alert("Failed to share. Please try downloading the image instead.");
      } finally {
        setIsSharingTwitter(false);
      }
    }
  };

 
  if (isLoading) {
    return (
      <div className="text-center p-4 sm:p-6 md:p-8">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm sm:text-base">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-4 sm:p-6 md:p-8 max-w-md mx-auto">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4"
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
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          Profile Not Found
        </h3>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-2">
          The username &ldquo;{username}&rdquo; could not be found or is
          private.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Try Another Username
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3 xs:space-y-4 md:space-y-6 px-3 xs:px-4 sm:px-0">
      {/* Header with Back Button */}
      <div className="flex flex-row items-center justify-start gap-2 xs:gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 xs:space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 p-1 xs:p-1.5 sm:p-2 rounded-md hover:bg-gray-100"
        >
          <svg
            className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
          <span className="text-xs xs:text-sm sm:text-base font-medium whitespace-nowrap">
            Back
          </span>
        </button>
      </div>

      {/* Card and Download Button Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-8">
        {/* Twitter Card */}
        <div
          ref={cardRef}
          className="relative w-full max-w-sm sm:max-w-md mx-auto lg:mx-0 shadow-2xl overflow-hidden"
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
          <div className="relative p-4 sm:p-6 md:p-8 m-3 sm:m-4 md:m-6">
            {/* Profile Section */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="relative inline-block mb-3 sm:mb-4">
                <Image
                  src={user.profile_image_url}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-300 mb-1">
                {user.name}
              </h2>
              <p className="text-blue-400 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                @{user.username}
              </p>

              {user.description && (
                <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 max-w-xs mx-auto px-2">
                  {user.description}
                </p>
              )}

              {user.location && (
                <div className="flex items-center justify-center text-gray-300 text-xs sm:text-sm">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
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

            {/* Stats Section - Responsive, no border boxes */}
            <div className="flex flex-row justify-center items-center gap-4 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full py-2 sm:py-3 md:py-4">
              {/* Followers */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
                  {formatNumber(user.public_metrics.followers_count)}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wide leading-tight mt-0.5">
                  Followers
                </div>
              </div>

              {/* Following */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
                  {formatNumber(user.public_metrics.following_count)}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wide leading-tight mt-0.5">
                  Following
                </div>
              </div>

              {/* Tweets */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
                  {formatNumber(user.public_metrics.tweet_count)}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wide leading-tight mt-0.5">
                  Tweets
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download and Share Buttons - Desktop: Right side (hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-4">
          <button
            onClick={downloadCard}
            disabled={isDownloading}
            className="flex gap-4 items-center px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl min-w-[140px] md:min-w-[220px]"
          >
            {isDownloading ? (
              <>
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Downloading...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-8 h-8"
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
                <span className="text-base">Download Card</span>
              </>
            )}
          </button>

          {/* Share to Twitter */}
          <button
            onClick={shareToTwitter}
            disabled={isSharingTwitter}
            className="flex gap-4 items-center px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl min-w-[140px] md:min-w-[220px]"
          >
            {isSharingTwitter ? (
              <>
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Sharing...</span>
              </>
            ) : (
              <>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M8.59 8.59l6.83 6.83M15.41 8.59l-6.83 6.83"
                />
              </svg>
                <span className="text-base">Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Download and Share Buttons - Mobile: Below card */}
      <div className="lg:hidden flex flex-col items-center space-y-3">
        <button
          onClick={downloadCard}
          disabled={isDownloading}
          className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium shadow-lg hover:shadow-xl w-full max-w-sm"
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download Card</span>
            </>
          )}
        </button>

        {/* Share to Twitter - Mobile */}
        <button
          onClick={shareToTwitter}
          disabled={isSharingTwitter}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium shadow-lg hover:shadow-xl w-full max-w-sm"
        >
          {isSharingTwitter ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sharing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M8.59 8.59l6.83 6.83M15.41 8.59l-6.83 6.83"
                />
              </svg>
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
