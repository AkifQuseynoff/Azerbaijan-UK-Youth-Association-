import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-transition min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-3">404</p>
        <h1 className="text-4xl text-[#0D1B2A] font-display mb-4">Page not found</h1>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="px-6 py-3 bg-[#003580] text-white font-semibold rounded-xl">Back to home</Link>
      </div>
    </div>
  );
}
