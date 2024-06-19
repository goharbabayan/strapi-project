export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <>
      <header>Header should be here</header>
      <main>
        <section>{children}</section>
      </main>
      <footer>Footer</footer>
    </>
  )
}
