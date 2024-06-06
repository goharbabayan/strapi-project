import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace 'your-single-type' with the actual name of your Strapi Single Type
  const singleTypeEndpoint = `http://localhost:1337/your-single-type`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(singleTypeEndpoint);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... your component logic and rendering

  return (
    <div>
      {isLoading && <p>Loading data...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <>
          <h1>{data.attributes.title}</h1> {/* Access data based on your Strapi field names */}
          {/* Display other data fields as needed */}
        </>
      )}
    </div>
  );
}
