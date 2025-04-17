"use client"
import Link from "next/link";
import React from "react";
// import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <div className="bg-[#ECE5DD] font-sans h-full min-h-screen">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-[#075E54] sm:text-7xl">
              Connect. Share. Grow.
            </h1>
            <p className="mt-6 text-lg text-gray-700">
              Just like WhatsApp connects people, we connect your business with the
              power of data and digital tools.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth"
                className="rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#1ebe5d] transition"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
