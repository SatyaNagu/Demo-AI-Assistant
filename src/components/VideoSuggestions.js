import React from 'react';
import { usePolling } from '../hooks/usePolling';

export default function VideoSuggestions() {
  const videos = usePolling('http://localhost:5000/youtube-suggestions', 2000);

  if (!videos) return null;
  return (
    <div className="video-suggestions">
      <h4>YouTube Suggestions</h4>
      <ul>
        {videos.slice(0, 3).map((v, i) => (
          <li key={i}>
            <a href={v.url} target="_blank" rel="noopener noreferrer">{v.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
} 