import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-indigo-600 mb-4 leading-none">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <FaHome size={13} />
            Go Home
          </Link>
          <Link
            to="/?q="
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <FaSearch size={13} />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
