'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
  const navigate = useRouter();
  const [posts, setPosts] = useState({
    trade_code: '',
    high: '',
    low: '',
    open: '',
    close: '',
    volume: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://www.janata-wifi-sqlmodel.somee.com/api/stock/create', posts);
      const { id } = response.data;
      setPosts({
        trade_code: '',
        high: '',
        low: '',
        open: '',
        close: '',
        volume: '',
      });
      navigate.push(`/`);
    } catch (error) {
      console.error('Error creating stock data:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 to-indigo-300 p-4"
    >
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Add Stock Data</h2>
        <div className="flex justify-between items-center border-b pb-4 mb-6">
        <button
          onClick={() => navigate.push('/')}
          className="text-blue-500 hover:underline text-sm"
        >
          Back to Dashboard
        </button>
      </div>

        <div className="space-y-4">
          {/* Trade Code Input */}
          <div>
            <label htmlFor="trade_code" className="block text-lg text-gray-700 mb-1">Trade Code</label>
            <input
              type="text"
              name="trade_code"
              id="trade_code"
              value={posts.trade_code}
              onChange={(e) => setPosts({ ...posts, trade_code: e.target.value })}
              placeholder="Enter stock trade code"
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
            />
          </div>

          {/* High Input */}
          <div>
            <label htmlFor="high" className="block text-lg text-gray-700 mb-1">High Value</label>
            <textarea
              name="high"
              id="high"
              value={posts.high}
              onChange={(e) => setPosts({ ...posts, high: e.target.value })}
              placeholder="Enter high value"
              rows={2}
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
            />
          </div>

          {/* Low Input */}
          <div>
            <label htmlFor="low" className="block text-lg text-gray-700 mb-1">Low Value</label>
            <textarea
              name="low"
              id="low"
              value={posts.low}
              onChange={(e) => setPosts({ ...posts, low: e.target.value })}
              placeholder="Enter low value"
              rows={2}
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
            />
          </div>

          {/* Open Value */}
          <div>
            <label htmlFor="open" className="block text-lg text-gray-700 mb-1">Open Value</label>
            <textarea
              name="open"
              id="open"
              value={posts.open}
              onChange={(e) => setPosts({ ...posts, open: e.target.value })}
              placeholder="Enter opening value"
              rows={2}
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
            />
          </div>

          {/* Close Value */}
          <div>
            <label htmlFor="close" className="block text-lg text-gray-700 mb-1">Close Value</label>
            <textarea
              name="close"
              id="close"
              value={posts.close}
              onChange={(e) => setPosts({ ...posts, close: e.target.value })}
              placeholder="Enter closing value"
              rows={2}
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
            />
          </div>

          {/* Volume Input */}
          <div>
            <label htmlFor="volume" className="block text-lg text-gray-700 mb-1">Volume</label>
            <textarea
              name="volume"
              id="volume"
              value={posts.volume}
              onChange={(e) => setPosts({ ...posts, volume: e.target.value })}
              placeholder="Enter volume"
              rows={2}
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
