'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// Define the options with proper TypeScript types
const options: ChartOptions<'bar' | 'line'> = {
  responsive: true,
  maintainAspectRatio: true, // Set to true to maintain aspect ratio
  scales: {
    x: {
      type: 'category',
      title: {
        display: true,
        text: 'Date',
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Value',
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem: TooltipItem<'bar' | 'line'>) {
          return `Value: ${tooltipItem.raw}`;
        },
      },
    },
  },
};

// Define TypeScript interface for stock data
interface StockData {
  date: string;
  id: string;
  trade_code: string;
  high: string;
  low: string;
  open: string;
  close: string;
  volume: string;
}

export default function Home() {
  const [datas, setDatas] = useState<StockData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadPath, setDownloadPath] = useState({ Path: '' });
  const [selectedTradeCode, setSelectedTradeCode] = useState<string>('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<StockData[]>('https://www.janata-wifi-sqlmodel.somee.com/api/all');
        setDatas(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteBook = async (id: string) => {
    try {
      await axios.delete(`https://www.janata-wifi-sqlmodel.somee.com/api/stock/delete/${id}`);
      setDatas((prev) => prev.filter((data) => data.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const filteredData = datas.filter((data) =>
    (selectedTradeCode ? data.trade_code === selectedTradeCode : true) &&
    data.trade_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        'https://www.janata-wifi-sqlmodel.somee.com/api/stock/export',
        { path: downloadPath.Path },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(downloadPath.Path);
      const data = response.data;
      if (data) {
        alert(data);
      }
    } catch (error: any) {
      alert('Error: ' + error.response?.data || error.message);
    }
  };

  const tradeCodes = Array.from(new Set(datas.map((data) => data.trade_code)));

  return (
    <div className="container mx-auto p-6 relative">
      {/* Download Section */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <input
          type="text"
          name="Path"
          placeholder="enter_path-ex:E:/path/"
          className="px-4 py-2 border rounded-md"
          value={downloadPath.Path}
          onChange={(e) => setDownloadPath({ ...downloadPath, Path: e.target.value })}
        />
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Download
        </button>
      </div>

      {/* Navigation Button */}
      <div className="mb-6">
        <Link href="/components/create">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Create New Data
          </button>
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by Trade Code"
          className="px-4 py-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setSearchQuery('')}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      <select
        className="px-4 py-2 border rounded-md"
        value={selectedTradeCode}
        onChange={(e) => setSelectedTradeCode(e.target.value)}
      >
        <option value="">All Trade Codes</option>
        {tradeCodes.map((tradeCode) => (
          <option key={tradeCode} value={tradeCode}>
            {tradeCode}
          </option>
        ))}
      </select>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="font-semibold text-lg mb-4">Line Chart</div>
          <div className="chart-container">
            {currentItems.length > 0 ? (
              <Line
                data={{
                  labels: currentItems.map((data) => data.date),
                  datasets: [
                    {
                      label: 'Close',
                      data: currentItems.map((data) => data.close),
                      backgroundColor: '#064FF0',
                      borderColor: '#064FF0',
                    },
                  ],
                }}
                options={options}
              />
            ) : (
              <p>No data available for the Line Chart.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="font-semibold text-lg mb-4">Bar Chart</div>
          <div className="chart-container">
            {currentItems.length > 0 ? (
              <Bar
                data={{
                  labels: currentItems.map((data) => data.date),
                  datasets: [
                    {
                      label: 'Volume',
                      data: currentItems.map((data) => data.volume),
                      backgroundColor: [
                        'rgba(43, 63, 229, 0.8)',
                        'rgba(250, 192, 19, 0.8)',
                        'rgba(253, 135, 135, 0.8)',
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
                options={options}
              />
            ) : (
              <p>No data available for the Bar Chart.</p>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Id</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Trade Code</th>
              <th className="border px-4 py-2 text-left">High</th>
              <th className="border px-4 py-2 text-left">Low</th>
              <th className="border px-4 py-2 text-left">Open</th>
              <th className="border px-4 py-2 text-left">Close</th>
              <th className="border px-4 py-2 text-left">Volume</th>
              <th className="border px-4 py-2 text-left" colSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((data, index) => (
              <tr key={data.id || index}>
                <td className="border px-4 py-2">{data.id}</td>
                <td className="border px-4 py-2">{data.date}</td>
                <td className="border px-4 py-2">{data.trade_code}</td>
                <td className="border px-4 py-2">{data.high}</td>
                <td className="border px-4 py-2">{data.low}</td>
                <td className="border px-4 py-2">{data.open}</td>
                <td className="border px-4 py-2">{data.close}</td>
                <td className="border px-4 py-2">{data.volume}</td>
                <td className="border px-4 py-2">
                  <Link href={`/components/update/${data.id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                      Edit
                    </button>
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteBook(data.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Previous
        </button>
        <span className="mx-4">{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}