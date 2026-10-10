export default function ConfigError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB] px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-lg">
        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-3">Site not configured</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          The site could not find its backend settings. Set <code>VITE_SUPABASE_URL</code> and{" "}
          <code>VITE_SUPABASE_ANON_KEY</code>, or set <code>VITE_DEMO_MODE=true</code> for local
          development only.
        </p>
      </div>
    </div>
  );
}
