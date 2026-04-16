import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/layout/MobileHeader";
import Footer from "@/components/layout/Footer";
import { getSiteConfig } from "@/lib/strapi";
import { site } from "@/data/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  const name = siteConfig?.name ?? site.name;
  const title = siteConfig?.title ?? site.title;
  const bio = siteConfig?.bio ?? site.bio;

  return {
    title: { default: `${name} — ${title}`, template: `%s — ${name}` },
    description: bio,
    metadataBase: new URL("https://johndoe.example.com"),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch site config on the server — this runs at request time (ISR cached).
  // If Strapi is unavailable, siteConfig is null and layout falls back to static data.
  const siteConfig = await getSiteConfig();

  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        {/* External so CSP can stay strict: script-src 'self' */}
        <script src="/theme-init.js" />
      </head>
      <body className="min-h-screen w-full font-sans antialiased">
        <Sidebar siteConfig={siteConfig} />
        <MobileHeader siteConfig={siteConfig} />
        <main className="lg:pl-80">
          <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
            {children}
            <Footer siteConfig={siteConfig} />
          </div>
        </main>
      </body>
    </html>
  );
}
