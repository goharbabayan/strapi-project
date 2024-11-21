'use client'

import {useState, useEffect} from 'react';
import styles from './profileReviews.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Text from '../text/Text';
import ProviderReview from '../providerReview/ProviderReview';
import Button from '../button/Button';
import { SwiperNavButtons } from '../swiperNavButtons/SwiperNavButtons';
import ProfileReviewPopup from '../profileReviewPopup/ProfileReviewPopup';

export default function ProfileReviews ({reviews, providerId}) {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const handleShowReviewPopup = () => {
    setShowReviewPopup(true);
    document.body.classList.add('overflow_hidden');
  };

  const myBreakpoints = {
    200: {
      slidesPerView: 1.2,
    },
    481: {
      slidesPerView: 2.2,
    },
    800: {
      slidesPerView: 3.2,
    },
    1024: {
      slidesPerView: 4,
    },
  };

  return (
    <div className={styles.mainWrap}>
      <div className={`${styles.newReview} page-width`}>
        <Text
          tag={'h3'}
          className={styles.heading}
          children={'Reviews'}
        />
        <Button
          children={'Add Review'}
          onClick={handleShowReviewPopup}
          className={`${styles.button} button_general`}
        />
      </div>
      {showReviewPopup &&
        <ProfileReviewPopup
          setShowReviewPopup={setShowReviewPopup}
          providerId={providerId}
        />
      }
      {reviews.length > 0 ? (
          <div className={`${styles.reviews} page-width`}>
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={24}
              slidesPerView={2.8}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              scrollbar={{ draggable: true }}
              breakpoints={myBreakpoints}
              margin={25}
              data-slides={2.5}
            >
              {reviews.map((review, index) => {
                const {id, author, date, text, show} = review;
                if (!show) return;
                return (
                  <SwiperSlide
                    key={id}
                    virtualIndex={id}
                    clssName={styles.slide}
                  >
                    <ProviderReview
                      author={author}
                      date={date}
                      text={text}
                      isLastChild={index === reviews.length-1 ? true : false}
                    />
                  </SwiperSlide>
                )
              })}
              <SwiperNavButtons/>
            </Swiper>
          </div>
        ) : (
        <div className="page-width">
          <div className={styles.container}>
            <Text
              tag={'h4'}
              children={'No Reviews'}
              className={styles.title}
            />
            <Text
              tag={'span'}
              children={'There are no reviews yet.'}
              className={styles.text}
            />
          </div>
        </div>)
      }
    </div>
  )
}
