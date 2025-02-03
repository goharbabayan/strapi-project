import { useSwiper } from 'swiper/react';

export const SwiperNavButtons = ({className}) => {
  const swiper = useSwiper();

  return (
    <div className="swiper-nav-buttons">
      <button className={`swiper-button-prev ${className ? className : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M10.5 19.5L3 12M3 12L10.5 4.5M3 12L21 12" stroke="#772A40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className={`swiper-button-next ${className ? className : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="#772A40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
