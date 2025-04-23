'use client';

import { useEffect, useState } from 'react';
import { useStoreContext } from '../utility/StoreContext';

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

enum GeolocationErrorCode {
  UNKNOWN_ERROR = 0,
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
}

export const Geolocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [hasTriedLocation, setHasTriedLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setNearestStore } = useStoreContext();

  if (error) {
    console.error(error);
  }

  useEffect(() => {
    if (!window.navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setHasTriedLocation(true);
      return;
    }

    window.navigator.geolocation.getCurrentPosition(
      (position: Position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setHasTriedLocation(true);
      },
      (error: GeolocationPositionError) => {
        switch (error.code) {
          case GeolocationErrorCode.PERMISSION_DENIED:
            setError('User denied the request for Geolocation.');
            break;
          case GeolocationErrorCode.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case GeolocationErrorCode.TIMEOUT:
            setError('The request to get user location timed out.');
            break;
          case GeolocationErrorCode.UNKNOWN_ERROR:
            setError('An unknown error occurred.');
            break;
          default:
            setError('An unexpected error occurred.');
        }
        setHasTriedLocation(true);
      },
    );
  }, []);

  useEffect(() => {
    if (!hasTriedLocation) return;

    const fetchNearestStore = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/stores/nearest-store`;

        if (latitude !== null && longitude !== null) {
          url += `?latitudeUser=${latitude}&longitudeUser=${longitude}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            setError(data.message || 'Jarak lokasi terlalu jauh dari store.');
            setNearestStore(null);
          } else {
            throw new Error(data.message || 'Failed to fetch nearest store.');
          }
          return;
        }

        setNearestStore(data.data);
      } catch (err: unknown) {
        console.error('Fetch error:', err);
        setError((err as Error).message || 'Failed to fetch nearest store');
      }
    };

    fetchNearestStore();
  }, [hasTriedLocation, latitude, longitude, setNearestStore]);

  return null;
};
