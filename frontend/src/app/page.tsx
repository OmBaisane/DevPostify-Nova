export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-3 font-mono text-sm text-blue-400">
            DEVPOSTIFY NOVA
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Where Developers Build
            <span className="block bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Their Identity.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400">
            A developer-first platform for sharing technical knowledge,
            showcasing projects, and building a professional identity.
          </p>
        </div>
      </div>
    </main>
  );
}
