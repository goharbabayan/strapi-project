'use client'

import { useState, forwardRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import styles from './reviews.module.css';
import InputField from '../inputField/InputField';
import Text from '../text/Text';
import { SwiperNavButtons } from '../swiperNavButtons/SwiperNavButtons';

const Reviews = forwardRef(({reviews, onChildFormDataChange, errorMessage}, ref) => {
  const [updatedReviews, setUpdatedReviews] = useState(reviews);

  const myBreakpoints = {
    200: {
      slidesPerView: 1,
    },
    375: {
      slidesPerView: 1.2,
    },
    500: {
      slidesPerView: 1.5,
    },
    750: {
      slidesPerView: 1.8,
    },
    800: {
      slidesPerView: 2.2,
    },
    1024: {
      slidesPerView: 2.8,
    },
  };

  // ToDo: remove setTimeout from handleShowHide function
  const handleShowHide = (target, reviewId, currentShowValue) => {
    const showValue = currentShowValue || false;
    const newReviews = updatedReviews.map((review) => review.id === reviewId ? { ...review, show: !showValue } : review);
    setUpdatedReviews(newReviews);
    setTimeout(() => {
      onChildFormDataChange('reviews', newReviews);
    });
  };

  return (
    <section
      className="page-width"
      id="Reviews"
      ref={ref}
    >
      <div className={`reviews ${styles.reviews}`}>
        <Text
          tag={'h2'}
          className={`${styles.title}`}
          children={'Reviews'}
        />
        {Array.isArray(reviews) && reviews.length === 0
        ?
          <Text
            tag={'h4'}
            className={'text-middle'}
            children={`You don't have reviews yet.`}
          />
        :
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
            {updatedReviews.map((review, index) => {
              return (
                <SwiperSlide
                  key={index}
                  virtualIndex={index}
                >
                  <div key={review.id} className={styles.review}>
                    <div className={styles.author}>
                      <span>{review.author}</span>
                      <span>{review.date}</span>
                    </div>
                    <span className='text-small'>{review.text}</span>
                    <InputField
                      label='Show review'
                      type='checkbox'
                      name='review'
                      id={`review-${review.id}`}
                      checked={review.show}
                      onChange={(e) => handleShowHide(e.target, review.id, review.show)}
                      fieldClassName={styles.checkbox}
                      labelClassName={styles.label}
                      inputClassName={styles.input}
                      errorMessage={errorMessage}
                    />
                  </div>
                </SwiperSlide>
              )
            })}
            <SwiperNavButtons/>
          </Swiper>
        }
      </div>
    </section>
  )
});

export default Reviews;
