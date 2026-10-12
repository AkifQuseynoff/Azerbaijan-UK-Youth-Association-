import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-transition flex min-h-[60vh] items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-3">404</p>
        <h1 className="display mb-4 text-5xl">Page not found</h1>
        <p className="mb-8 text-mute">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="btn btn-blue">Back to home</Link>
      </div>
    </div>
  );
}
