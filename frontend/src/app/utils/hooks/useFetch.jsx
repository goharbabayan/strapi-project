export const useFetchData = (url, options) => {
  const fetchData = async () => {
    const response = await fetch(url, options);
    const jsonData = await response.json();
    
    return jsonData;
  };

  return fetchData();
}
