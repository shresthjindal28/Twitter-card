"use client";
import { useState } from "react";

interface UsernameInputProps {
  onSubmit: (username: string) => void;
}

export default function UsernameInput({ onSubmit }: UsernameInputProps) {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && !isSubmitting) {
      setIsSubmitting(true);
      onSubmit(username.trim());
      setUsername("");
      // Reset submitting state after a short delay
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4">
            <svg 
              viewBox="0 0 24 24" 
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="currentColor"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl text-center mb-3 px-2">
            Get your <span className="text-[#1DA1F2]">Twitter</span> card and{" "}
            <span className="text-[#1DA1F2]">Flex</span> on your friends
          </h1>
        </div>
      </div>

      {/* Search Form */}
      <form
        className="flex border-2 border-gray-300 w-full max-w-2xl mx-auto rounded-full items-center gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-10 justify-between shadow-lg hover:shadow-xl transition-shadow duration-200"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 outline-none rounded-l-full text-sm sm:text-base md:text-lg"
          placeholder="Enter your twitter username"
          disabled={isSubmitting}
        />
        <button
          className="bg-[#1DA1F2] text-white font-bold text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full hover:bg-[#1a91da] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          type="submit"
          disabled={!username.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      
    </div>
  );
}
