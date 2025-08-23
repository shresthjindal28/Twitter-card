"use client";
import { useState } from "react";
import UsernameInput from "@/components/UsernameInput";
import TwitterCard from "@/components/TwitterCard";
import Loader from "@/components/Loader";

type AppState = 'input' | 'loading' | 'card';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('input');
  const [username, setUsername] = useState<string | null>(null);

  const handleUsernameSubmit = (uname: string) => {
    setUsername(uname);
    setAppState('loading');
    
    // Simulate loading time and then show the card
    setTimeout(() => {
      setAppState('card');
    }, 2000);
  };

  const handleBackToInput = () => {
    setAppState('input');
    setUsername(null);
  };

  return (
    <main className="min-h-screen">
      {/* Input Page */}
      {appState === 'input' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <UsernameInput onSubmit={handleUsernameSubmit} />
          </div>
        </div>
      )}

      {/* Loading Page */}
      {appState === 'loading' && <Loader />}

      {/* Card Page */}
      {appState === 'card' && username && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <TwitterCard username={username} onBack={handleBackToInput} />
        </div>
      )}
    </main>
  );
}
