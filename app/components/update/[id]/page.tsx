'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();
  const navigate = useRouter();
  const [posts, setPosts] = useState({
    trade_code: "",
    high: "",
    low: "",
    open: "",
    close: "",
    volume: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://www.janata-wifi-sqlmodel.somee.com/api/stock/${id}`);
        // If the response is not an array, wrap it in one for consistency
        const post = Array.isArray(response.data) ? response.data[0] : response.data;
        const { open, close, trade_code, high, low, volume } = post;

        // Update state with fetched post data
        setPosts({ trade_code, high, low, open, close, volume });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.put(`https://www.janata-wifi-sqlmodel.somee.com/api/stock/update/${id}`, posts);
      console.log("Response:", response);
      navigate.push(`/`);
    } catch (error: any) {
      console.error("Error updating post:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
    }
  };

  return (
    <div className="bg-white w-full max-w-2xl mx-auto p-6 rounded-lg shadow-lg space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Edit Stock Data</h2>
        <button
          onClick={() => navigate.push('/')}
          className="text-blue-500 hover:underline text-sm"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trade Code Input */}
        <div>
          <label htmlFor="trade_code" className="block text-sm font-medium text-gray-700">
            Trade Code
          </label>
          <input
            type="text"
            id="trade_code"
            name="trade_code"
            value={posts.trade_code}
            onChange={(e) => setPosts({ ...posts, trade_code: e.target.value })}
            placeholder="Enter trade code"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* High Input */}
        <div>
          <label htmlFor="high" className="block text-sm font-medium text-gray-700">
            High
          </label>
          <input
            type="text"
            id="high"
            name="high"
            value={posts.high}
            onChange={(e) => setPosts({ ...posts, high: e.target.value })}
            placeholder="Enter high value"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Low Input */}
        <div>
          <label htmlFor="low" className="block text-sm font-medium text-gray-700">
            Low
          </label>
          <input
            type="text"
            id="low"
            name="low"
            value={posts.low}
            onChange={(e) => setPosts({ ...posts, low: e.target.value })}
            placeholder="Enter low value"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Open Input */}
        <div>
          <label htmlFor="open" className="block text-sm font-medium text-gray-700">
            Open
          </label>
          <input
            type="text"
            id="open"
            name="open"
            value={posts.open}
            onChange={(e) => setPosts({ ...posts, open: e.target.value })}
            placeholder="Enter open value"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Close Input */}
        <div>
          <label htmlFor="close" className="block text-sm font-medium text-gray-700">
            Close
          </label>
          <input
            type="text"
            id="close"
            name="close"
            value={posts.close}
            onChange={(e) => setPosts({ ...posts, close: e.target.value })}
            placeholder="Enter close value"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Volume Input */}
        <div>
          <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
            Volume
          </label>
          <input
            type="text"
            id="volume"
            name="volume"
            value={posts.volume}
            onChange={(e) => setPosts({ ...posts, volume: e.target.value })}
            placeholder="Enter volume value"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-8 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Update Stock Data
          </button>
        </div>
      </form>
    </div>
  );
}
