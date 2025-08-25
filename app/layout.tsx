import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import "./globals.css";

const siteUrl = "https://twitter-card.shresthjindal.com";

export const metadata: Metadata = {
  title: "Twitter Stats Card — Check a profile's stats quickly",
  description: "Generate a clean, shareable Twitter-style stats card for any public Twitter username.",
  keywords: [
    "twitter card",
    "twitter stats",
    "twitter profile",
    "social preview",
    "open graph",
    "twitter card generator",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Twitter Stats Card",
    description: "Generate a clean, shareable Twitter-style stats card for any public Twitter username.",
    url: siteUrl,
    siteName: "Twitter Stats Card",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Twitter Stats Card preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter Stats Card",
    description: "Generate a clean, shareable Twitter-style stats card for any public Twitter username.",
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Twitter Stats Card",
        "description": "Generate a clean, shareable Twitter-style stats card for any public Twitter username.",
        "inLanguage": "en",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        "url": siteUrl,
        "name": "Twitter Stats Card — Home",
        "isPartOf": { "@id": `${siteUrl}/#website` },
        "inLanguage": "en",
        "description": "Generate a clean, shareable Twitter-style stats card for any public Twitter username.",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#ffffff" />
        {/* Favicon and touch icons - place your provided logo at /public/logo.png */}
  <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        {/* Ensure favicon is replaced at runtime in case /favicon.ico is still present */}
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(){try{var l=document.querySelector('link[rel~=\"icon\"]'); if(l){l.href='/logo.png';} else {var n=document.createElement('link'); n.rel='icon'; n.href='/logo.png'; document.head.appendChild(n);} }catch(e){} })();",
          }}
        />
        <script
          type="application/ld+json"
          // dangerouslySetInnerHTML is required to inject raw JSON-LD in app layout
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <main className="flex justify-center items-start p-3 sm:p-4 md:p-6">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
