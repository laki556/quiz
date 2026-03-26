import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
};

const AdminGuard: React.FC<Props> = ({ children }) => {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("admin_auth") === "true";
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("admin_token");

  if (!token) {
    localStorage.removeItem("admin_auth");
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_token", data.token);

        setIsAuthenticated(true);
      } else {
        setError(data.message || "Invalid PIN");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Admin Access</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter PIN to continue
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
          />

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg font-medium transition flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Unlock"
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminGuard;