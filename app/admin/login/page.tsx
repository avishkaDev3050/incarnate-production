"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send data to backend API for authentication
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // සාර්ථක නම් dashboard එකට redirect කරනවා
        router.push("/admin"); 
      } else {
        // Backend එකෙන් එවන message එක පෙන්වනවා
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Server connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Top Accent Bar (Blue & Yellow) */}
        <div className="h-2 w-full flex">
          <div className="h-full w-2/3 bg-blue-600"></div>
          <div className="h-full w-1/3 bg-yellow-400"></div>
        </div>

        <div className="p-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <Image 
              src="/logo2.png" 
              alt="Incarnet Logo" 
              width={120} 
              height={120} 
              className="mb-4 object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-gray-500 text-sm">Please sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter admin username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder:text-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-200 transition-all transform active:scale-[0.98] disabled:bg-gray-400"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                  Processing...
                </span>
              ) : "Sign In"}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
              Powered by Incarnet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}