import type { Metadata } from "next";
import { Suspense } from "react";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

import QueryProvider from "@/providers/QueryProvider";
import { MobileFloatingMenu } from "@/components/layout/MobileFloatingMenu";
import { MobileStickyCart } from "@/components/layout/MobileStickyCart";
import { getMenuServer } from "@/lib/fetch-menu";

export const metadata: Metadata = {
  title: "Pizza Wale",
  description: "Order delicious pizza online",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { categories, products } = await getMenuServer().catch(() => ({ categories: [], products: [] }));

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <MobileFloatingMenu categories={categories} products={products} />
          <Suspense fallback={null}>
            <MobileStickyCart />
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
