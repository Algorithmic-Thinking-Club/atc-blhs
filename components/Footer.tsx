import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            {siteConfig.name} &middot; {siteConfig.school}
          </p>
          <p className="text-sm text-zinc-600">
            Founded {siteConfig.founded}
          </p>
        </div>
      </div>
    </footer>
  );
}
