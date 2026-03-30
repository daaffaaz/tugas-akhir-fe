export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Welcome
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Edit <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">src/app/page.tsx</code>{" "}
        to get started.
      </p>
    </main>
  );
}
