'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StockData, Product, User, Store } from '@/types/types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const StockReportPage = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { storeSlug } = useParams();

  useEffect(() => {
    if (!storeSlug) return;

    const fetchStockData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/report-stock/store/${storeSlug}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
        if (response.ok) {
          const data = await response.json();
          setStockData(data.data);
        } else {
          throw new Error('Failed to load stock report data.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/products-store-slug/${storeSlug}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
        } else {
          throw new Error('Failed to load product data.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/all-users', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data);
        } else {
          throw new Error('Failed to load user data.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      }
    };

    const fetchStores = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/stores/store-slug/${storeSlug}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setStores(data.data);
        } else {
          throw new Error('Failed to load store data.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      }
    };

    fetchStores();
    fetchUser();
    fetchProducts();
    fetchStockData();
  }, [storeSlug, error]);

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'Product Not Found';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'User Not Found';
  };

  const getUserRole = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.role : 'Role Not Found';
  };

  const filterData = (data: StockData[]) => {
    let filteredData = data;

    // Filter by year
    if (selectedYear) {
      filteredData = filteredData.filter(
        (item) =>
          new Date(item.createdAt).getFullYear().toString() === selectedYear,
      );
    }

    // Filter by month
    if (selectedMonth) {
      filteredData = filteredData.filter(
        (item) =>
          new Date(item.createdAt).getMonth().toString() === selectedMonth,
      );
    }

    // Filter by product name
    if (selectedProduct) {
      filteredData = filteredData.filter(
        (item) => item.productId === selectedProduct,
      );
    }

    return filteredData;
  };

  const paginateData = (data: StockData[]) => {
    const offset = (currentPage - 1) * itemsPerPage;
    return data.slice(offset, offset + itemsPerPage);
  };

  const totalPages = Math.ceil(filterData(stockData).length / itemsPerPage);

  return (
    <div className="container mx-auto px-20 mt-20 min-h-screen">
      <div className="flex flex-col items-center">
        <p className="text-2xl font-semibold">Store Stock Report</p>
        <h1 className="text-5xl font-semibold mb-10 mt-2">{stores?.name}</h1>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Dropdowns for filters */}
      <div className="mb-4">
        <label htmlFor="year" className="mr-2">
          Year:
        </label>
        <select
          id="year"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>

        {/* Dropdown for selecting month */}
        <label htmlFor="month" className="mr-2 ml-4">
          Month:
        </label>
        <select
          id="month"
          value={selectedMonth || ''}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Month</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>

        {/* Dropdown for selecting product */}
        <label htmlFor="product" className="mr-2 ml-4">
          Product Name:
        </label>
        <select
          id="product"
          value={selectedProduct || ''}
          onChange={(e) => setSelectedProduct(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg text-center">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Product Name</th>
            <th className="px-4 py-2 border-b">Input Value Stock</th>
            <th className="px-4 py-2 border-b">Last Stock</th>
            <th className="px-4 py-2 border-b">Difference</th>
            <th className="px-4 py-2 border-b">Final Stock</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Change Type</th>
            <th className="px-4 py-2 border-b">User</th>
            <th className="px-4 py-2 border-b">Role</th>
          </tr>
        </thead>
        <tbody>
          {paginateData(filterData(stockData)).map((stock) => (
            <tr
              key={stock.id}
              className={`hover:bg-gray-100 ${
                stock.typeOfChange === 'PENGURANGAN' ||
                stock.typeOfChange === 'PEMBELIAN'
                  ? 'bg-red-100'
                  : 'bg-green-100'
              }`}
            >
              <td className="px-4 py-2 border-b">{stock.id}</td>
              <td className="px-4 py-2 border-b text-left">
                {getProductName(stock.productId)}
              </td>
              <td className="px-4 py-2 border-b">{stock.stock}</td>
              <td className="px-4 py-2 border-b">{stock.lastStock}</td>
              <td className="px-4 py-2 border-b">{stock.difference}</td>
              <td className="px-4 py-2 border-b">{stock.finalStock}</td>
              <td className="px-4 py-2 border-b">
                {formatDate(stock.createdAt)}
              </td>
              <td className="px-4 py-2 border-b">{stock.typeOfChange}</td>
              <td className="px-4 py-2 border-b">
                {getUserName(stock.userId)}
              </td>
              <td className="px-4 py-2 border-b">
                {getUserRole(stock.userId)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaChevronLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default StockReportPage;
