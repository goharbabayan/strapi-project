'use client'

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './new-member.module.css';
import Text from '@/components/text/Text';
import NotificationBar from '@/components/notificationBar/NotificationBar';
import GalleryImages from '@/components/galleryImages/GalleryImages';
import MenuBar from '@/components/menuBar/MenuBar';
import AboutMe from '@/components/aboutMe/AboutMe';
import RatesAndServices from '@/components/ratesAndServices/RatesAndServices';
import Schedule from '@/components/schedule/Schedule';
import Button from '@/components/button/Button';
import PersonalDetails from '@/components/personalDetails/PersonalDetails';
import LocationDetails from '@/components/locationDetails/LocationDetails';
import ContactDetails from '@/components/contactDetails/ContactDetails';
import { navigate } from '@/app/actions';
import { validateForm } from '@/app/utils/validation';
import { CREATE_MENU_BAR } from '@/app/utils/constants/menuBar';
import { USER_FORM_NEW_MEMBER} from '@/app/utils/constants/userForm';
import ProfilePageImage from '@/components/profilePageImage/ProfilePageImage';

export default function NewMember({params}) {
  const { user } = params;
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const managerId = searchParams.get('id');

  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const memberToken = process.env.NEXT_PUBLIC_API_TOKEN_MEMBER;

  const [isMemberRegistered, setIsMemberRegistered] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userSelectedSuburbs, setUserSelectedSuburbs] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isCityDataChanged, setIsCityDataChanged] = useState(false);
  const [globalErrorText, setGlobalErrorText] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState(USER_FORM_NEW_MEMBER(email, managerId));
  const photosSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const ratesAndServicesSectionRef = useRef(null);
  const whenCanWeMetSectionRef = useRef(null);
  const selfiesSectionRef = useRef(null);

  const menuItems = [
    { name: 'Photos', sectionRef: photosSectionRef },
    { name: 'About Me', sectionRef: aboutSectionRef },
    { name: 'Rates & Services', sectionRef: ratesAndServicesSectionRef },
    { name: 'When can we meet', sectionRef: whenCanWeMetSectionRef },
    { name: 'Selfies', sectionRef: selfiesSectionRef },
  ];
  const menu = CREATE_MENU_BAR(menuItems);

// ToDo: can be merged in one function
  const handleChange = (event) => {
    setGlobalErrorText('');
    setErrorMessage('');
    setShowSuccessMessage(false);
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setHasUnsavedChanges(true);
  };

  const handleScheduleChange = (childFormData) => {
    setGlobalErrorText('');
    setErrorMessage('');
    setShowSuccessMessage(false);
    setFormData({...formData, schedule: childFormData});
    setHasUnsavedChanges(true);
  }
// ToDo: can be merged in one function end

  const handleMemberFormSubmit = async (event) => {
    event.preventDefault();
    if (!formData.profilePicture) {
      setGlobalErrorText(`Please, add member's profile picture.`);
      return;
    };
    if (!formData.coverPhoto) {
      setGlobalErrorText(`Please, add member's cover photo.`);
      return;
    };

    const errors = validateForm(formData, false);
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setErrorMessage(errors);
      setGlobalErrorText('Please correct the errors and try again.');
      return;
    } else {
      setErrorMessage('');
      setGlobalErrorText('');
    };

    if (!isMemberRegistered) {
      await fetch(`${strapiBaseUrl}/api/auth/local/registerMember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${memberToken}`
        },
        body: JSON.stringify({
          ...formData,
          confirmed: true
        }),
        })
        .then(response => response.json())
        .then(json => {
          const {error, user} = json;
          if (error) {
            const errorMessage = error.message;
            const notUniqueUserNameMessage = errorMessage.includes('This attribute must be unique');
            const userNameInvalidMessage = errorMessage.includes('username must be at least 3 characters');
            if (notUniqueUserNameMessage) {
              setGlobalErrorText('This username is already in use.');
            } else if (userNameInvalidMessage) {
              setGlobalErrorText('Username must be at least 3 characters.');
            } else {
              setGlobalErrorText(errorMessage);
            }
          } else if (user) {
            setHasUnsavedChanges(true);
            setShowSuccessMessage(true);
            const userId = user.id;
            setUserId(userId);
            setTimeout(() => {
              setShowSuccessMessage(false);
              setHasUnsavedChanges(false);
            }, 5000);
          }
        })
        .catch(err => {
          console.error('Error sending email confirmation:', err);
        });
    }
      await handleRequestReview(userId);
  }

  const handleRequestReview = async (userId) => {
    if (!user.isApprovedByAdmin) {
      await fetch(`${strapiBaseUrl}/api/profile-review/${process.env.NEXT_PUBLIC_API_TOKEN_MEMBER}`,{
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_MEMBER}`
        },
        body: JSON.stringify({
          ...formData,
          id: userId
        }),
      })
    }
  }

  const handleMouseDown = async (name, value, showChange = true) => {
    setErrorMessage('');
    if (name === 'city') {
      setSelectedCity(value);
      setUserSelectedSuburbs([]);
      setIsCityDataChanged(true);
    }
    setFormData({ ...formData, [name]: value });
    setChanges(showChange, { ...formData, [name]: value });
    setHasUnsavedChanges(true);
  };

  const setChanges = (showChange, childFormData) => {
    setGlobalErrorText('');
    setShowSuccessMessage(false);
    setErrorMessage('');
    setHasUnsavedChanges(showChange);
    setFormData(childFormData);
  }

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

  const handleChildFormDataChange = (field, value) => {
    setGlobalErrorText('');
    setErrorMessage('');
    setShowSuccessMessage(false);
    setHasUnsavedChanges(true);
    setFormData({...formData, [field]: value});
  }

  const handleCancelChangesButtonClick = () => {
    setHasUnsavedChanges(false);
  };

  const navigateToDashboard = () => {
    navigate(`/my-account/${user}`);
  }

  const navigateToMembers = () => {
    navigate(`members?id=${managerId}&email=${email}`);
  }

  // ToDo: should be one function with register member
  const handleSaveButtonClick = async() => {
    const unsavedUserData = {
      ...formData,
      isApprovedByAdmin: false
    };

    if (!formData.profilePicture || !formData.coverPhoto || !formData.username) {
      setGlobalErrorText('The profile picture, cover photo and Username are requerd to fill');
      return;
    }

    if (!isMemberRegistered) {
      await updateOrRegisterMember("/api/auth/local/registerMember", unsavedUserData, 'POST', true);
    } else {
      await updateOrRegisterMember(`/api/members/${userId}`, unsavedUserData, 'PUT', false);
      setShowSuccessMessage(false);
      setHasUnsavedChanges(false);
    };
  };

  const updateOrRegisterMember = async(path, unsavedUserData, method, isRegistering) => {
    await fetch(`${strapiBaseUrl}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${memberToken}`
      },
      body: JSON.stringify({
        ...unsavedUserData,
        confirmed: true
        })
      })
      .then(response => response.json())
      .then(json => {
        const {error, user} = json;
        if (error) {
          const errorMessage = error.message;
          const notUniqueUserNameMessage = errorMessage.includes('This attribute must be unique');
          const userNameInvalidMessage = errorMessage.includes('username must be at least 3 characters');
          if (notUniqueUserNameMessage) {
            setGlobalErrorText('This username is already in use.');
          } else if (userNameInvalidMessage) {
            setGlobalErrorText('Username must be at least 3 characters.');
          } else {
            setGlobalErrorText(errorMessage);
          }
        } else if (user) {
          setHasUnsavedChanges(true);
          setShowSuccessMessage(true);
          if (isRegistering) {
            setIsMemberRegistered(true);
            setUserId(user.id);
            setFormData({
              ...formData,
              id: user.id
            })
          }
          setTimeout(() => {
            setShowSuccessMessage(false);
            setHasUnsavedChanges(false);
          }, 5000);
        }
      })
      .catch(err => {
        console.error('Error sending email confirmation:', err);
      });
  }

  return (
    <div>
      <form onSubmit={handleMemberFormSubmit}>
        {hasUnsavedChanges && (
          <NotificationBar
            isApprovedByAdmin={formData.isApprovedByAdmin}
            onCancelButtonClick={handleCancelChangesButtonClick}
            onSaveButtonClick={handleSaveButtonClick}
            showSuccessfullMessage={showSuccessMessage}
            successfullMessageText={'All changes have been applied successfully.'}
            errorMessageText={globalErrorText}
            userRole={'service provider'}
          />
        )}
        <section className='section page-width'>
          <div className='container buttonsWrap'>
            <Button children={'Back to dashboard'} onClick={navigateToDashboard} className='button_general'/>
            <Button children={'My members list'} onClick={navigateToMembers} className='button_general'/>
            {isMemberRegistered &&
              <div className={styles.buttonWrap}>
                <Button
                  type='submit'
                  className={`button_main ${styles.submitButton}`}
                  children={'Request to review'}
                />
              </div>
            }
          </div>
          <Text
            tag={'h2'}
            className={'title'}
            children={'New member'}
          />
        </section>
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
            isCityDataChanged={isCityDataChanged}
            userSelectedCity={selectedCity}
            errorMessage={errorMessage}
          />
        </section>
        <section className={`page-width`}>
          <ContactDetails
            formData={formData}
            onChange={handleChange}
            role={'new-member'}
            errorMessage={errorMessage}
          />
        </section>
        <MenuBar
          isNotificationBarOpen={hasUnsavedChanges}
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
        </section>
      </form>
    </div>
  )
}
