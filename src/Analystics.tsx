// import React, { useEffect, useState } from 'react';
// import { db } from '../services/firebaseConfig';

// const Analytics: React.FC = () => {
//   const [clicks, setClicks] = useState(0);

//   useEffect(() => {
//     db.collection('analytics')
//       .doc('clicks')
//       .get()
//       .then((doc) => {
//         if (doc.exists) {
//           setClicks(doc.data()?.clicks || 0);
//         }
//       });
//   }, []);

//   return (
//     <div>
//       <h3>URL Clicks: {clicks}</h3>
//     </div>
//   );
// };

// export default Analytics;
