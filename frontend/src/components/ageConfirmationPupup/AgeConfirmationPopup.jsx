import { useState, useEffect } from 'react';
import styles from './ageConfirmationPopup.module.css';
import Text from '../text/Text';
import Button from '../button/Button';
import { useQuery } from '@apollo/client';
import { GET_CONFIRMATION_POPUP_INFO } from '@/app/graphql/ageConfirmationQuery';
import Loading from '@/app/loading';
import Error from '@/app/error';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from '../image/Image';

export const AgeConfirmationPopup = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const confirmation = localStorage.getItem('ageConfirmed');
    if (confirmation !== 'true') {
      setIsVisible(true);
      document.body.classList.add('overflow_hidden');
    } else {
      setIsConfirmed(true);
    }
  }, []);
  
  const { data, loading, error } = useQuery(GET_CONFIRMATION_POPUP_INFO, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const handleConfirm = () => {
    localStorage.setItem('ageConfirmed', 'true');
    document.body.classList.remove('overflow_hidden');
    setIsConfirmed(true);
    setIsVisible(false);
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible || isConfirmed) return null;
  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {data.ageConfirmationPopUp.data.attributes.logo.data && 
          <div className={styles.popupImageContainer}>
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${data.ageConfirmationPopUp.data.attributes.logo.data.attributes.url}`}
              alt={data.ageConfirmationPopUp.data.attributes.logo.data.attributes.alternativeText || 'logo'}
              height={data.ageConfirmationPopUp.data.attributes.logo.data.attributes.height}
              width={data.ageConfirmationPopUp.data.attributes.logo.data.attributes.width}
            />
         </div>
        }
        {data.ageConfirmationPopUp.data.attributes.heading &&
          <Text
            tag={'h2'}
            className={styles.popupTitle}
            children={data.ageConfirmationPopUp.data.attributes.heading}
          />
        }
        <div className={styles.popupDesc}>
          {data.ageConfirmationPopUp.data.attributes.description &&
            <BlocksRenderer content={data.ageConfirmationPopUp.data.attributes.description} />
          }
        </div>
        <div className={styles.buttons}>
          <Button
            type="submit"
            variant={'main'}
            onClick={handleConfirm}
            className={styles.popUpButton}
          >
            Agree and Enter
          </Button>
          <Button
            type="submit"
            variant={'general'}
            onClick={handleDeny}
            className={styles.popUpButton}
          >
            Exit the platform
          </Button>
        </div>
      </div>
    </div>
  );
};
