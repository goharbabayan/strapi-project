'use client'

import Button from "@/components/button/Button";
import Text from "@/components/text/Text";

//global-error.js is only enabled in production. In development, our error overlay will show instead.
export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="page-width">
          <div className="wrapper">

          </div>
          <Text
            tag={'h2'}
            className={'text-middle'}
            children={'Something went wrong!'}
          />
          <Button
            onClick={() => reset()}
            children={'Try again'}
          />
        </div>
      </body>
    </html>
  )
}
