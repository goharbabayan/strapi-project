const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <h2>Home</h2>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  )
}

export default Layout;
