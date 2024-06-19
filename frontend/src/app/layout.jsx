export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <section className="main-wrapper">{children}</section>
      </body>
    </html>
  )
}
