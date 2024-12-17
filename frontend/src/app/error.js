'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import Button from '@/components/button/Button';
import Text from '@/components/text/Text';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="page-width">
      <div className="wrapper">
        <Text
          tag={'h2'}
          className={'text'}
          children={'Something went wrong!'}
        />
        <Button
          onClick={() => reset()}
          children={'Try again'}
          className={'button'}
        />
      </div>
    </div>
  )
}
