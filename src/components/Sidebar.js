import React from 'react';
import { usePolling } from '../hooks/usePolling';

export default function Sidebar() {
  const stats = usePolling('http://localhost:5000/search-stats', 2000);

  if (!stats) return <div>Loading...</div>;
  const top5 = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="sidebar">
      <h3>Top Categories</h3>
      <ul>
        {top5.map(([cat, count]) => (
          <li key={cat}>{cat}: {count}%</li>
        ))}
      </ul>
    </div>
  );
} 