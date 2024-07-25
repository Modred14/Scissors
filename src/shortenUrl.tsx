import React, { useState } from 'react';
import axios from 'axios';

const ShortenURL: React.FC = () => {
  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');

  const handleShorten = async () => {
    const response = await axios.post('/api/shorten', { longURL });
    setShortURL(response.data.shortURL);
  };

  return (
    <div>
      <input
        type="text"
        value={longURL}
        onChange={(e) => setLongURL(e.target.value)}
        placeholder="Enter long URL"
      />
      <button onClick={handleShorten}>Shorten</button>
      {shortURL && <div>Short URL: {shortURL}</div>}
    </div>
  );
};

export default ShortenURL;
