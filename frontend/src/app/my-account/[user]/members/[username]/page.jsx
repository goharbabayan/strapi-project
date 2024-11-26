'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './member.module.css';
import { navigate } from '@/app/actions';
import Text from '@/components/text/Text';
import NotificationBar from '@/components/notificationBar/NotificationBar';
import GalleryImages from '@/components/galleryImages/GalleryImages';
import MenuBar from '@/components/menuBar/MenuBar';
import AboutMe from '@/components/aboutMe/AboutMe';
import Schedule from '@/components/schedule/Schedule';
import Button from '@/components/button/Button';
import PersonalDetails from '@/components/personalDetails/PersonalDetails';
import RatesAndServices from '@/components/ratesAndServices/RatesAndServices';
import LocationDetails from '@/components/locationDetails/LocationDetails';
import ContactDetails from '@/components/contactDetails/ContactDetails';
import { validateForm } from '@/app/utils/validation';
import { CREATE_MENU_BAR } from '@/app/utils/constants/menuBar';
import Reviews from '@/components/reviews/Reviews';
import ProfilePageImage from '@/components/profilePageImage/ProfilePageImage';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import { isInputLengthValid } from '@/app/utils/helpers';

export default function Member ({params}) {
  const { user, username } = params;
  const { replace } = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const [notificationBarMessageAndStatus, setNotificationBarMessageAndStatus] = useState({
    show: false,
    message: ''
  });
  const [errorMessage, setErrorMessage] = useState({});
  const [showSaveResetChangeBar, setShowSaveResetChangeBar] = useState(false);
  const [userSelectedSuburbs, setUserSelectedSuburbs] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isCityDataChanged, setIsCityDataChanged] = useState(false);
  const [formData, setFormData] = useState({});
  const [isApprovedByAdmin, setIsApprovedByAdmin] = useState(false);
  const photosSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const ratesAndServicesSectionRef = useRef(null);
  const whenCanWeMetSectionRef = useRef(null);
  const selfiesSectionRef = useRef(null);
  const reviewsSectionRef = useRef(null);

  const menuItems = [
    { name: 'Photos', sectionRef: photosSectionRef },
    { name: 'About Me', sectionRef: aboutSectionRef },
    { name: 'Rates & Services', sectionRef: ratesAndServicesSectionRef },
    { name: 'When can we meet', sectionRef: whenCanWeMetSectionRef },
    { name: 'Selfies', sectionRef: selfiesSectionRef },
  ];
  const menu = CREATE_MENU_BAR(menuItems);
  const memberToken = process.env.NEXT_PUBLIC_API_TOKEN_MEMBER;

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    user && fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[username][$eq]=${username}&populate=*`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setFormData(data[0]);
        setUserSelectedSuburbs(data[0].suburbs);
        setSelectedCity(data[0].city);
        setIsApprovedByAdmin(data[0]?.isApprovedByAdmin);
      });
  }, []);

  const handleChange = (event) => {
    setErrorMessage('');
    setShowSaveResetChangeBar(true);
    setNotificationBarMessageAndStatus({
      show: false,
      message: ''
    });

    const isUsernameEreased = event.target.name === 'username' && event.target.value === '';
    if (isUsernameEreased) {
      setShowSaveResetChangeBar(false);
      setNotificationBarMessageAndStatus({
        show: true,
        message: 'Username must be at least 3 characters'
      })
      return;
    };
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleMouseDown = async (name, value) => {
    setErrorMessage('');
    setShowSaveResetChangeBar(true);
    setNotificationBarMessageAndStatus({
      show: false,
      message: ''
    });
    if (name === 'city') {
      setSelectedCity(value);
      setUserSelectedSuburbs([]);
      setIsCityDataChanged(true);
    };

    setFormData({ ...formData, [name]: value });
  };

  const handleScheduleChange = (childFormData) => {
    setNotificationBarMessageAndStatus({
      show: false,
      message: ''
    });
    setFormData({...formData, schedule: childFormData});
    setShowSaveResetChangeBar(true);
  };

  const handleMemberFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.profilePicture || !formData.coverPhoto) {
      setShowSaveResetChangeBar(false);
      setNotificationBarMessageAndStatus({
        show: true,
        message: 'Cover photo and Profile picture are required fields.'
      });
      return;
    };

    const errors = validateForm(formData, false);
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setErrorMessage(errors);
      setShowSaveResetChangeBar(false);
      setNotificationBarMessageAndStatus({
        show: true,
        message: 'Please correct the errors and try again.'
      });
      return;
    } else {
      setErrorMessage('');
    };

    const isUsernameLengthValid = isInputLengthValid(formData.username, 3);
      if (!isUsernameLengthValid) {
        setShowSaveResetChangeBar(false);
        setNotificationBarMessageAndStatus({
          show: true,
          message: 'Username must be at least 3 characters.'
        });
        return;
      };

    memberToken && formData.id &&
      useFetchData(`${baseUrl}/api/members/${formData.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json',
          'authorization': `Bearer ${memberToken}`
        }
      }).then(data => {
        setShowSaveResetChangeBar(false);
        if (data.error || data.errors) {
          const errorMessage = data.error.message;
          setNotificationBarMessageAndStatus({
            show: true,
            message: errorMessage
          });
          return;
        } else {
          if (!isApprovedByAdmin) {
            user &&
              useFetchData(`${baseUrl}/api/profile-review/${process.env.NEXT_PUBLIC_API_TOKEN_MEMBER}`, {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json',
                  'authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_MEMBER}`
                },
                body: JSON.stringify(formData),
              }).then(() => {
                setShowSaveResetChangeBar(false);
                setNotificationBarMessageAndStatus({
                  show: true,
                  message: 'Request was sent successfuly'
                });
                setTimeout(() => {
                  setNotificationBarMessageAndStatus({
                    show: false,
                    message: ''
                  });
                }, 3000)})
          };
          setTimeout(() => {
            // if changed username the url params should be changed
            replace(`/my-account/${user}/members/${formData.username}`);
          }, 5000)
        }
      })
  };

  const handleChildFormDataChange = (field, value) => {
    setErrorMessage('');
    setNotificationBarMessageAndStatus({
      show: false,
      message: ''
    });
    setShowSaveResetChangeBar(true);
    setFormData({...formData, [field]: value});
  };

  const handleCancelChangesButtonClick = () => {
    setShowSaveResetChangeBar(false);
    setNotificationBarMessageAndStatus({
      show: false,
      message: ''
    });
    window.location.reload();
  };

  const navigateToDashboard = () => {
    navigate(`/my-account/${user}`);
  };

  const navigateToMembers = () => {
    navigate(`/my-account/${user}/members?id=${formData.managerID}&email=${formData.email}`);
  };

  const handleScrollToSection = (sectionRef) => {
    let topPosition;
    if (window.innerWidth > 750) {
      topPosition = sectionRef.current.offsetTop - 140;
    } else {
      topPosition = sectionRef.current.offsetTop - 152;
    };

    if (sectionRef.current) {
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    };
  };

  const handleSaveButtonClick = async () => {
    const unsavedUserData = {
      ...formData,
      isApprovedByAdmin: false
    }

    if (!formData.profilePicture || !formData.coverPhoto) {
      setShowSaveResetChangeBar(false);
      setNotificationBarMessageAndStatus({
        show: true,
        message: 'Cover picture and Profile picture are required fields.'
      });
      return;
    };

    const isUsernameLengthValid = isInputLengthValid(formData.username, 3);
    if (!isUsernameLengthValid) {
      setShowSaveResetChangeBar(false);
      setNotificationBarMessageAndStatus({
        show: true,
        message: 'Username must be at least 3 characters.'
      });
      return;
    };

    memberToken &&
      useFetchData(`${baseUrl}/api/members/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${memberToken}`
        },
        body: JSON.stringify(unsavedUserData),
      }).then((res) => {
        if (res?.error) {
          setShowSaveResetChangeBar(false);
          setNotificationBarMessageAndStatus({
            show: true,
            message: res?.error?.message
          });
          return;
        };

        setIsApprovedByAdmin(false);
        setShowSaveResetChangeBar(false);
        setNotificationBarMessageAndStatus({
          show: true,
          message: 'Changes applied successfully.'
        });
        setTimeout(() => {
          setNotificationBarMessageAndStatus({
            show: false,
            message: ''
          });
        }, 2000);
      })
  };

  return (
    <div>
      <form onSubmit={handleMemberFormSubmit}>
        {(showSaveResetChangeBar || notificationBarMessageAndStatus.show) && (
          <NotificationBar
            notificationBarMessageAndStatus={notificationBarMessageAndStatus}
            showSaveResetChangeBar={showSaveResetChangeBar}
            onCancelButtonClick={handleCancelChangesButtonClick}
            onSaveButtonClick={handleSaveButtonClick}
          />
        )}
        <section className={`${styles.section} page-width`}>
          <div className={`${styles.container} ${styles.buttonsWrap}`}>
            <Button
              children={'Back to dashboard'}
              onClick={navigateToDashboard}
              variant={'general'}
              className={styles.btn}
            />
            {!isApprovedByAdmin &&
              <div className={styles.button}>
                <Button
                  type='submit'
                  children={'Request to review'}
                  variant={'main'}
                  className={styles.btn}
                />
              </div>
            }
          </div>
        </section>
        <section>
          <div className={`${styles.container}`}>
            {(formData.username || formData.username === '') &&
              <div>
                <div className='page-width'>
                  <Text
                    tag={'h2'}
                    className={'title'}
                    children={`${formData.username}'s Dashboard`}
                  />
                </div>
                <div>
                  {formData && formData.username &&
                    <>
                      <section className='page-width'>
                        <ProfilePageImage
                          type='coverPhoto'
                          formData={formData}
                          onChildFormDataChange={handleChildFormDataChange}
                        />
                      </section>
                      <section className='profileInfo page-width'>
                        <ProfilePageImage
                          type='profilePicture'
                          formData={formData}
                          onChildFormDataChange={handleChildFormDataChange}
                        />
                        <div className={styles.details}>
                          <Text
                            tag={'h2'}
                            className={`${styles.title} title`}
                            children={'Personal details'}
                          />
                          <PersonalDetails
                            formData={formData}
                            onChange={handleChange}
                            onMouseDown={handleMouseDown}
                            errorMessage={errorMessage}
                            showUsername={true}
                          />
                        </div>
                      </section>
                      <section className='page-width'>
                        <LocationDetails
                          formData={formData}
                          onChange={handleChange}
                          onMouseDown={handleMouseDown}
                          userSuburbs={userSelectedSuburbs}
                          userSelectedCity={selectedCity}
                          isCityDataChanged={isCityDataChanged}
                          errorMessage={errorMessage}
                        />
                      </section>
                      <section className={`page-width`}>
                        <ContactDetails
                          formData={formData}
                          onChange={handleChange}
                          role={'manager-member'}
                          errorMessage={errorMessage}
                        />
                      </section>
                      <MenuBar
                        onScrollToSection={handleScrollToSection}
                        items={menu}
                      />
                      <section className='formGroups'>
                        <GalleryImages
                          id={'photos'}
                          children={'Photos*'}
                          type='photos'
                          images={formData.photos}
                          onChildFormDataChange={handleChildFormDataChange}
                          ref={photosSectionRef}
                          error={errorMessage?.photos}
                        />
                        <AboutMe
                          formData={formData}
                          onChildFormDataChange={handleChildFormDataChange}
                          ref={aboutSectionRef}
                          error={errorMessage}
                        />
                        <RatesAndServices
                          memberFormData={formData}
                          incallRates={formData.incallRates}
                          outcallRates={formData.outcallRates}
                          onChildFormDataChange={handleChildFormDataChange}
                          ref={ratesAndServicesSectionRef}
                          error={errorMessage}
                        />
                        <Schedule
                          userSchedule={formData.schedule}
                          onPreferencesChange={handleChildFormDataChange}
                          formData={formData}
                          onChildFormDataChange={handleScheduleChange}
                          ref={whenCanWeMetSectionRef}
                          error={errorMessage}
                        />
                        <GalleryImages
                          id={'selfies'}
                          children={'Selfies'}
                          images={formData.selfies}
                          type='selfies'
                          onChildFormDataChange={handleChildFormDataChange}
                          ref={selfiesSectionRef}
                          error={errorMessage?.selfies}
                        />
                        <Reviews
                          user={user}
                          reviews={user.reviews ? user.reviews : []}
                          onChildFormDataChange={handleChildFormDataChange}
                          ref={reviewsSectionRef}
                          errorMessage={errorMessage}
                        />
                      </section>
                    </>
                  }
                </div>
              </div>
            }
          </div>
        </section>
      </form>
    </div>
  )
}
