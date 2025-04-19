import opencage from 'opencage-api-client';

export async function convertCoordinatesToAddress(
  latitude: number,
  longitude: number,
) {
  try {
    const data = await opencage.geocode({
      q: `${latitude}, ${longitude}`,
      language: 'en',
      key: process.env.OPENCAGE_API_KEY,
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
      language: 'en',
      key: process.env.OPENCAGE_API_KEY,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}

// console.log(
//   await convertCoordinatesToAddress(-6.289169504340975, 106.83223534481418),
// );
// console.log(await convertAddressToCoordinates('Jl. Ahmad Yani, Jakarta'));
