export default function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-mist px-6">
      <div className="card max-w-lg p-10">
        <h1 className="display mb-3 text-3xl">Site not configured</h1>
        <p className="text-mute text-sm leading-relaxed">
          The site could not find its backend settings. Set <code>VITE_SUPABASE_URL</code> and{" "}
          <code>VITE_SUPABASE_ANON_KEY</code>, or set <code>VITE_DEMO_MODE=true</code> for local
          development only.
        </p>
      </div>
    </div>
  );
}
