async function fetchDataWithHeader() {
  const player = `Mint Blitz`;
  const params = new URLSearchParams({
    count: 10,
    'include-times': true,
    modes: 'arena',
    start: 1,
  }).toString();

  const url = `https://www.haloapi.com/stats/h5/players/${player}/matches?${params}`; // Replace with your actual API URL
  const primaryKey = '758b86d45bc04d5b86c719af2019eb2d'; // Replace with your actual primary key


  try {
    const response = await fetch(url, {
      method: 'GET', // Optional: specify method, default is 'GET'
      headers: {
        'Ocp-Apim-Subscription-Key': primaryKey,
        'Content-Type': 'application/json' // Example of another common header
        // Add other headers here if needed
      }
    });

    if (!response.ok) {
      // Log more details if the response is not OK
      const errorBody = await response.text(); // Try to read error body as text
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorBody}`);
    }

    // Assuming the response is JSON. If it might not be, add checks.
    const data = await response.json();
    console.log('Fetched data with header:', data);

  } catch (error) {
    console.error('Could not fetch data:', error);
  }
}

fetchDataWithHeader();
