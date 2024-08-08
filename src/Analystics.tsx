import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig'; // Ensure this points to the correct config file
import { doc, getDoc } from 'firebase/firestore';

const Analytics: React.FC = () => {
  const [clicks, setClicks] = useState<number>(0);

  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const docRef = doc(db, 'analytics', 'clicks');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setClicks(data?.clicks || 0);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };

    fetchClicks();
  }, []);

  return (
    <div>
      <h3>URL Clicks: {clicks}</h3>
    </div>
  );
};

export default Analytics;
