export default function LinkArticle({className, stroke}) {
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 17L17 7M17 7H7M17 7V17" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}
