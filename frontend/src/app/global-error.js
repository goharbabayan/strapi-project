'use client'
//global-error.js is only enabled in production. In development, our error overlay will show instead.
export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className='page-width'>
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  )
}
