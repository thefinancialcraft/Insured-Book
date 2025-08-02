import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 px-4 py-8">
      <div className="text-center bg-white/90 rounded-2xl shadow-xl border border-white/50 p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-700">404</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-purple-600 hover:text-purple-800 underline font-medium">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
