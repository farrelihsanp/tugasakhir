'use client';

import { useEffect, useState } from 'react';
import { DiscountReport, User } from '@/types/types';

const DiscountReportPage = () => {
  const [reports, setReports] = useState<DiscountReport[]>([]);
  const [user, setUser] = useState<User[] | null>(null);
  console.log('isinya user', user);

  const [loading, setLoading] = useState<boolean>(true);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterDay, setFilterDay] = useState<number | null>(null);
  const [sortUserName, setSortUserName] = useState<string | null>(null);

  // Fetch discount reports from the backend
  useEffect(() => {
    const fetchDiscountReports = async () => {
      try {
        const res = await fetch(
          'http://localhost:8000/api/v1/discount-reports',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await res.json();
        if (!data.ok) throw new Error(data.message);
        if (data.ok) {
          setReports(data.data);
        }
      } catch (error) {
        console.error('Error fetching discount reports', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/users', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!data) throw new Error(data.message);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    fetchUser();
    fetchDiscountReports();
  }, []);

  // Sort reports based on user name selection
  const sortedReports = reports
    .filter((report) => {
      if (sortUserName) {
        return report.User.name
          .toLowerCase()
          .includes(sortUserName.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      const nameA = a.User.name.toLowerCase();
      const nameB = b.User.name.toLowerCase();

      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Filter reports based on date, month, and year
  const filteredReports = sortedReports.filter((report) => {
    const createdAt = new Date(report.createdAt);
    const reportYear = createdAt.getFullYear();
    const reportMonth = createdAt.getMonth() + 1; // Months are 0-indexed
    const reportDay = createdAt.getDate();

    const yearMatch = filterYear ? reportYear === filterYear : true;
    const monthMatch = filterMonth ? reportMonth === filterMonth : true;
    const dayMatch = filterDay ? reportDay === filterDay : true;

    return yearMatch && monthMatch && dayMatch;
  });

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Discount Reports</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="mb-4">
            <label className="mr-2">Filter by Year:</label>
            <select
              value={filterYear || ''}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="px-2 py-1 border"
            >
              <option value="">All</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>

            <label className="mr-2 ml-4">Filter by Month:</label>
            <select
              value={filterMonth || ''}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="px-2 py-1 border"
            >
              <option value="">All</option>
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>

            <label className="mr-2 ml-4">Filter by Day:</label>
            <select
              value={filterDay || ''}
              onChange={(e) => setFilterDay(Number(e.target.value))}
              className="px-2 py-1 border"
            >
              <option value="">All</option>
              {[...Array(31)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>

            <label className="mr-2 ml-4">Sort by User:</label>
            <select
              value={sortUserName || ''}
              onChange={(e) => setSortUserName(e.target.value)}
              className="px-2 py-1 border"
            >
              <option value="">All Users</option>
              {user?.map((userItem: User) => (
                <option key={userItem.id} value={userItem.name}>
                  {userItem.name}
                </option>
              ))}
            </select>
          </div>

          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Report ID</th>
                <th className="px-4 py-2 text-left">
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }
                    className="flex items-center"
                  >
                    User {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="px-4 py-2 text-left">Customer Benefits</th>
                <th className="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{report.id}</td>
                  <td className="px-4 py-2">{report.User.name}</td>
                  <td className="px-4 py-2">{report.customerBenefits}</td>
                  <td className="px-4 py-2">
                    {new Date(report.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default DiscountReportPage;
