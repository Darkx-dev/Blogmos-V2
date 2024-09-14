import { useState, useEffect } from 'react';

export default function OverviewStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalComments: 0,
    totalSubscribers: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    }
    fetchStats();
  }, []);

  return (
    <div className="overview-stats">
      <h2>Overview</h2>
      <div className="stat-grid">
        <div className="stat-item">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-item">
          <h3>Total Blogs</h3>
          <p>{stats.totalBlogs}</p>
        </div>
        <div className="stat-item">
          <h3>Total Comments</h3>
          <p>{stats.totalComments}</p>
        </div>
        <div className="stat-item">
          <h3>Total Subscribers</h3>
          <p>{stats.totalSubscribers}</p>
        </div>
      </div>
    </div>
  );
}