export default function ArrowRight({color}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path d="M13.5 5L21 12.5M21 12.5L13.5 20M21 12.5H3" stroke={`${color ? color : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
