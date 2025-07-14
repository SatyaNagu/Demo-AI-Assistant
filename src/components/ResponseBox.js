import React from 'react';
import { usePolling } from '../hooks/usePolling';

export default function ResponseBox() {
  const data = usePolling('http://localhost:5000/last-response', 2000);

  return (
    <div className="response-box">
      <h4>Assistant says:</h4>
      <p>{data ? data.response : '...'}</p>
    </div>
  );
} 