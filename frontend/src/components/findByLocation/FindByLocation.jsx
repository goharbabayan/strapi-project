import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BY_LOCATION_QUERIES } from '@/app/graphql/findByLocationQueries';
import styles from './findByLocation.module.css';
import LocationCard from '../locationCard/LocationCard';
import { SwiperNavButtons } from '../swiperNavButtons/SwiperNavButtons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function FindByLocation () {
  const [cards, setCards] = useState([]);
  const [heading, setHeading] = useState('');
  const {loading, data, error} = useQuery(GET_BY_LOCATION_QUERIES);
  useEffect(() => {
    if (data != undefined) {
      setHeading(data?.home?.data?.attributes?.Find_by_location?.heading);
      setCards(data?.home?.data?.attributes?.Find_by_location?.card);
    }
  }, [data]);


  const myBreakpoints = {
    200: {
      slidesPerView: 1,
    },
    370: {
      slidesPerView: 2,
    },
    570: {
      slidesPerView: 3.5,
    },
    650: {
      slidesPerView: 4.5,
    },
    850: {
      slidesPerView: 5.5,
    },
    1024: {
      slidesPerView: 6.5,
    },
  };

  const isAtLeastOneCardExist = cards && Array.isArray(cards) && cards.length > 0;
  return (
    <>
      {isAtLeastOneCardExist &&
        <section className={`${styles.mainWrap} location`}>
          {heading && <h3 className={styles.heading}>{heading}</h3>}
          <div className={styles.container}>
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={24}
              slidesPerView={7}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              breakpoints={myBreakpoints}
              data-slides={7}
              className={`${styles.swiper} ${cards && cards.length < 7 ? styles.center : ''}`}
            >
              {isAtLeastOneCardExist &&
                cards.map((card, index) => (
                  <SwiperSlide key={index} virtualIndex={index}>
                    <LocationCard key={index} card={card}/>
                  </SwiperSlide>
                ))
              }
              <SwiperNavButtons />
            </Swiper>
          </div>
        </section>
      }
    </>
  )
}
