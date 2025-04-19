import opencage from 'opencage-api-client';

export async function convertCoordinatesToAddress(
  latitude: number,
  longitude: number,
) {
  try {
    const data = await opencage.geocode({
      q: `${latitude}, ${longitude}`,
      key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
      language: 'en',
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function convertAddressToCoordinates(address: string) {
  try {
    const data = await opencage.geocode({
      q: address,
      key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
      language: 'en',
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}
