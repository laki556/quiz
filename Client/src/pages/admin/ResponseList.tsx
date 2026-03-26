import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {API} from "../../constants/api.ts";

interface ResponseItem {
  _id: string;
  name: string;
  responses: {
    year?: string;
    jlpt?: string;
  };
  totalTime?: number;
  createdAt?: string;
}

const ResponseList: React.FC = () => {
  const [data, setData] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/responses");
        setData(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (ms?: number) => {
    if (!ms) return "-";
    return (ms / 1000).toFixed(1) + "s";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              All Responses
            </h2>

            <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
              {data.length} Responses
            </span>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("admin_auth");
              localStorage.removeItem("admin_token");
              window.location.href = "/admin";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading responses...
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Year</th>
                <th className="text-left px-4 py-3">JLPT</th>
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
              </thead>

              <tbody>
              {data.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {item.name}
                  </td>

                  <td className="px-4 py-3">
                    {item.responses?.year || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.responses?.jlpt || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {formatTime(item.totalTime)}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString("en-LK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/admin/${item._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            {data.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No responses found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseList;