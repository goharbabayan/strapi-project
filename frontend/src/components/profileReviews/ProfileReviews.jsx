'use client'

import {useState} from 'react';
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
import EditContentIcon from '../icons/EditContent';
import FormModal from '../formModal/FormModal';
import Reviews from '../reviews/Reviews';

export default function ProfileReviews ({
  reviews,
  providerId,
  isDashboardPage,
  updateUserPendingOvverridesAndSubmitUserData,
  hideAddReviewButton,
}) {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showEditReviewsPopup, setShowEditReviewsPopup] = useState(false);
  const [updatedReviews, setUpdatedReviews] = useState(reviews);

  const handleEditIconClick = () => {
    setShowEditReviewsPopup(!showEditReviewsPopup);
  };

  const handleShowReviewPopup = () => {
    setShowReviewPopup(true);
    document.body.classList.add('overflow_hidden');
  };

  const handleShowHide = (target, reviewId, currentShowValue) => {
    const showValue = currentShowValue || false;
    const newReviews = updatedReviews.map((review) => review.id === reviewId ? { ...review, show: !showValue } : review);
    setUpdatedReviews(newReviews);
  };

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

  return (
    <div className="page-width">
      <div className={`${styles.mainWrap}`}>
        {!(isDashboardPage && updatedReviews.length === 0) &&
          <div className={`${styles.newReview} ${isDashboardPage ? styles.dashbaordPage : ''}`}>
            <Text
              tag={'h3'}
              className={styles.heading}
              children={'Reviews'}
            />
            {isDashboardPage
              ?
                <>
                  {updatedReviews.length > 0 &&
                    <EditContentIcon
                      className={styles.editIcon}
                      onClick={handleEditIconClick}
                    />
                  }
                </>
              :
              <>
                {!hideAddReviewButton &&
                  <Button
                    children={'Add Review'}
                    onClick={handleShowReviewPopup}
                    className={styles.button}
                    variant={'general'}
                  />
                }
              </>
            }
          </div>
        }
        {showReviewPopup &&
          <ProfileReviewPopup
            setShowReviewPopup={setShowReviewPopup}
            providerId={providerId}
          />
        }
        {showEditReviewsPopup &&
          <FormModal
            title={'My Reviews'}
            className={styles.locationForm}
            onClose={() => {
              setShowEditReviewsPopup(false);
            }}
          >
            <Reviews
              showServicesOptions={true}
              userSelectedInterests={null}
              userReviews={reviews}
              updateChange={updateUserPendingOvverridesAndSubmitUserData}
              setShowEditReviewsPopup={setShowEditReviewsPopup}
            />
          </FormModal>
        }
        {updatedReviews.length > 0 ? (
          <div className={`${styles.reviews} profileReviews`}>
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
              className={styles.swipperWrapper}
            >
              {updatedReviews.map((review, index) => {
                const {id, author, date, text, show} = review;
                if (!isDashboardPage && !show) return;
                return (
                  <SwiperSlide
                    key={id}
                    virtualIndex={id}
                    className={styles.swiperSlide}
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
              <SwiperNavButtons className={styles.reviewButton}/>
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
    </div>
  )
}
