import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface ApiResponse {
  longUrl: string;
}

const Redirect: React.FC = () => {
  const navigate = useNavigate();
  const { shortUrl } = useParams<{ shortUrl: string }>();

  useEffect(() => {
    const fetchLongUrl = async () => {
      try {
        const response = await axios.get<ApiResponse>(`/api/resolve/${shortUrl}`);
        const longUrl = response.data.longUrl;
        window.location.href = longUrl; 
      } catch (error) {
        console.error('Error fetching long URL:', error);
        navigate('*');
      }
    };

    if (shortUrl) {
      fetchLongUrl();
    }
  }, [shortUrl, navigate]);

  return <div>Redirecting...</div>;
};

export default Redirect;
