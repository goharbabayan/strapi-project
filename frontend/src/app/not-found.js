const NotFound = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you requested could not be found.</p>
      <p>Here are some options:</p>
      <ul>
        <li>
          <a href="/">Go to the homepage</a>
        </li>
        <li>
          <a href="/search">Search for what you're looking for</a>
        </li>
      </ul>
    </div>
  );
};

export default NotFound;
