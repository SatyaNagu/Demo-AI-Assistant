import { useState, useEffect } from 'react';

export function usePolling(url, interval = 2000) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      fetch(url)
        .then(res => res.json())
        .then(json => { if (isMounted) setData(json); });
    };
    fetchData();
    const id = setInterval(fetchData, interval);
    return () => { isMounted = false; clearInterval(id); };
  }, [url, interval]);

  return data;
} 