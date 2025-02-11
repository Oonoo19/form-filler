"use client";
import Link from "next/link";

export default function FormFillerPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 row-start-2 items-center sm:items-start">
        <h2 className="text-2xl">Document builder</h2>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href={"/contract"}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Go to Editor
          </Link>
        </div>
      </main>
    </div>
  );
}
