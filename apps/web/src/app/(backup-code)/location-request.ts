// 'use client';

// import { useEffect, useState } from 'react';
// import { useStoreContext } from '../utility/StoreContext';

// interface Position {
//   coords: {
//     latitude: number;
//     longitude: number;
//   };
// }

// enum GeolocationErrorCode {
//   UNKNOWN_ERROR = 0,
//   PERMISSION_DENIED = 1,
//   POSITION_UNAVAILABLE = 2,
//   TIMEOUT = 3,
// }

// export const Geolocation = () => {
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const { setNearestStore } = useStoreContext();

//   useEffect(() => {
//     if (typeof setNearestStore !== 'function') {
//       console.error(
//         'setNearestStore is not a function. Check your StoreContext setup.',
//       );
//     }
//   }, [setNearestStore]);

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser');
//       return;
//     }

//     const handleSuccess = (position: Position) => {
//       setLatitude(position.coords.latitude);
//       setLongitude(position.coords.longitude);
//     };

//     const handleError = (error: GeolocationPositionError) => {
//       switch (error.code) {
//         case GeolocationErrorCode.PERMISSION_DENIED:
//           setError('User denied the request for Geolocation.');
//           break;
//         case GeolocationErrorCode.POSITION_UNAVAILABLE:
//           setError('Location information is unavailable.');
//           break;
//         case GeolocationErrorCode.TIMEOUT:
//           setError('The request to get user location timed out.');
//           break;
//         case GeolocationErrorCode.UNKNOWN_ERROR:
//           setError('An unknown error occurred.');
//           break;
//         default:
//           setError('An unexpected error occurred.');
//       }
//     };

//     navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
//   }, []);

//   useEffect(() => {
//     if (latitude !== null && longitude !== null) {
//       const url = `http://localhost:8000/api/v1/stores/nearest-store?latitudeUser=${latitude}&longitudeUser=${longitude}`;

//       fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           setNearestStore(data.data);
//         })
//         .catch((error) => {
//           console.error('There was a problem with the fetch operation:', error);
//           setError('Failed to fetch nearest store');
//         });
//     }
//   }, [latitude, longitude, setNearestStore]);

//   return null;
// };
