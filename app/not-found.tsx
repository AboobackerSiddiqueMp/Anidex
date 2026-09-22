import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border-2 border-red-600/50 shadow-2xl space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 font-mono text-xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Fauna Signal Lost
        </h1>
        <p className="text-sm text-slate-400">
          The requested AniDex coordinates could not be located in this wildlife sector.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide transition-colors cursor-pointer"
        >
          Return to Scanner
        </Link>
      </div>
    </div>
  );
}
