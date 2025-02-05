import styles from './reviews.module.css';
import Text from '../text/Text';
import Button from '../button/Button';
import { useEffect, useState } from 'react';
import Checkbox from '../checkbox/CheckBox';
import PopUpCloseIcon from '../icons/PopUpCloseIcon';
import EditContentIcon from '../icons/EditContent';
import EditIcon from '../icons/Edit';
import PlusIcon from '../icons/plusIcon';

export default function Reviews ({
  userReviews,
  updateChange,
  title,
  showEditAndDeleteButtons,
  setShowEditReviewsPopup,
}) {
  const [reviewsCheckboxesState, setReviewsCheckboxesState] = useState([]);
  const [updatedReviews, setUpdatedReviews] = useState(userReviews);

  useEffect(() => {
    setReviewsCheckboxesState(updatedReviews.map(review => ({ id: review.id, isChecked: review.show })));
  }, [userReviews]);

  const saveChanges = () => {
    updateChange({'reviews': updatedReviews});
    setShowEditReviewsPopup && setShowEditReviewsPopup(false);
  };

  const cancelChanges = () => {
    setUpdatedReviews(userReviews);
    setReviewsCheckboxesState(userReviews.map(review => ({ id: review.id, isChecked: review.show })));
  };

  const onCheckboxChange = (reviewId, review, isChecked) => {
    setReviewsCheckboxesState((prevState) =>
      prevState.map((item) =>
        item.id === reviewId ? { ...item, isChecked: !item.isChecked } : item
      )
    );
    setUpdatedReviews((prevState) =>
      prevState.map((item) =>
        item.id === reviewId ? { ...item, show: !item.show } : item
      )
    );
  };

  return (
    <>
      <div
        className={`${styles.mainWrapper}`}
      >
        {showEditAndDeleteButtons && title &&
          <div className={styles.title}>
            <Text
              tag={'span'}
              className={styles.subtitle}
              children={title}
            />
            <div className={styles.edit}>
              <PopUpCloseIcon/>
            </div>
          </div>
        }
        {Array.isArray(updatedReviews) && updatedReviews.length > 0 &&
        <div>
          <ul className={`${styles.options} unstyled-list`}>
            <li className={`${styles.review} ${styles.header} text-small`}>
              <Text tag="span" className={`${styles.title} ${styles.text}`} children="Author" />
              <Text tag="span" className={`${styles.title} ${styles.text}`} children="Review" />
              <Text tag="span" className={`${styles.title} ${styles.text}`} children="Date" />
              <Text tag="span" className={`${styles.title} ${styles.text}`} children="Show/Hide" />
            </li>
          </ul>
          <ul id="reviewsList" className={`${styles.options} unstyled-list`}>
            {updatedReviews.map((review, index) => {
              const {author, text, date, show, id} = review;
              const isChecked = reviewsCheckboxesState.find(item => item.id === id)?.isChecked || false;
              return (
                <li key={index} className={`${styles.review} text-small`}>
                  <Text
                    tag={'span'}
                    className={styles.text}
                    children={author}
                  />
                  <Text
                    tag={'span'}
                    className={styles.text}
                    children={text}
                  />
                  <Text
                    tag={'span'}
                    className={styles.text}
                    children={date}
                  />
                <input type="text" value={id} readOnly={true} hidden/>
                  <Checkbox
                    props={{
                      containerClassName: styles.checkboxContainer,
                      value: id,
                      onChange: (e) => onCheckboxChange(id, review, !reviewsCheckboxesState.includes(id)),
                      isChecked: isChecked,
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </div>
        }
        <div className={styles.buttons}>
          <Button
            children={'Cancel'}
            variant={'general'}
            onClick={cancelChanges}
          />
          <Button
            type={'button'}
            children={'Save changes'}
            variant={'main'}
            onClick={saveChanges}
          />
        </div>
      </div>
    </>
  )
};
