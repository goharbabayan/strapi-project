'use client'

import { useState, useRef } from 'react';
import styles from './new-member.module.css';
import Text from '@/components/text/Text';
import NotificationBar from '@/components/notificationBar/NotificationBar';
import Image from '@/components/image/Image';
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

export default function NewMember({params, searchParams}) {
  const { user } = params;
  const { email, id } = searchParams;
  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const memberToken = process.env.NEXT_PUBLIC_API_TOKEN_MEMBER;

  const [showPopup, setShowPopup] = useState(false);
  const [userSelectedSuburbs, setUserSelectedSuburbs] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isCityDataChanged, setIsCityDataChanged] = useState(false);
  const [globalErrorText, setGlobalErrorText] = useState('');
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState(USER_FORM_NEW_MEMBER(email, id));
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
    setShowGlobalError(false);
    setErrorMessage('');
    setShowSuccessMessage(false);
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setHasUnsavedChanges(true);
  };

  const handleScheduleChange = (childFormData) => {
    setGlobalErrorText('');
    setShowGlobalError(false);
    setErrorMessage('');
    setShowSuccessMessage(false);
    setFormData({...formData, schedule: childFormData});
    setHasUnsavedChanges(true);
  }
// ToDo: can be merged in one function end

  const handleMemberFormSubmit = async (event) => {
    event.preventDefault();

    if (!formData.profilePicture) {
      setShowGlobalError(true);
      setGlobalErrorText(`Please, add member's profile picture.`);
      return;
    }
    if (!formData.coverPhoto) {
      setShowGlobalError(true);
      setGlobalErrorText(`Please, add member's cover photo.`);
      return;
    }

    const errors = validateForm(formData, false);
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setErrorMessage(errors);
      setShowGlobalError(true);
      setGlobalErrorText('Please correct the errors and try again.');
      return;
    } else {
      setErrorMessage('');
      setShowGlobalError(false);
      setGlobalErrorText('');
    }

    await fetch(`${strapiBaseUrl}/api/auth/local/registerMember?populate[profilePicture][fields]&populate[coverPhoto][fields]&populate[photos][fields]&populate[selfies][fields]&populate[interests][fields]&populate[wishlist][fields]&populate[favouriteThings][fields]&populate[digitalServices][fields]&populate[incallRates][fields]&populate[outcallRates][fields]&populate[services][fields]&populate[schedule][fields]&populate[additionalInfo][fields]&populate[reviews][fields]`, {
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
        const {data, error, user, jwt} = json;
        if (error) {
          const errorMessage = error.message;
          const notUniqueUserNameMessage = errorMessage.includes('This attribute must be unique');
          const userNameInvalidMessage = errorMessage.includes('username must be at least 3 characters');
          setShowGlobalError(true);
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

          setTimeout(() => {
            setShowSuccessMessage(false);
            setHasUnsavedChanges(false);
            // setFormData(USER_FORM_NEW_MEMBER(email, id));
            // setUserSelectedSuburbs([]);
            // setSelectedCity('');
            // setIsCityDataChanged(false);
            // setHasUnsavedChanges(false);
          }, 5000);
        }
      })
      .catch(err => {
        console.error('Error sending email confirmation:', err);
      });

      // await handleRequestReview(customerToken);
  }

  const handleRequestReview = async (customerToken) => {
    if (!user.isApprovedByAdmin) {
      console.log('customerToken: ', customerToken);

        await fetch(`${strapiBaseUrl}/api/profile-review/${customerToken}`,{
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${customerToken}`
          },
          body: JSON.stringify(formData),
        })
        .then(res => res.json())
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
    setShowGlobalError(false);
    setShowSuccessMessage(false);
    setErrorMessage('');
    setHasUnsavedChanges(showChange);
    setFormData(childFormData);
  }

  const handleScrollToSection = (sectionRef) => {
    let topPosition;
    if (window.innerWidth > 750) {
      topPosition = hasUnsavedChanges ? sectionRef.current.offsetTop - 80 : sectionRef.current.offsetTop - 40;
    } else {
      topPosition = hasUnsavedChanges ? sectionRef.current.offsetTop - 100 : sectionRef.current.offsetTop - 55;
    }

    if (sectionRef.current) {
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    };
  };

  const handleSettingIconClick = (e) => {
    setShowPopup(!showPopup);
    document.body.classList.add('overflow-hidden');
  };

  const handleModalClose = () => {
    setShowPopup(false);
    document.body.classList.remove('overflow-hidden');
  };

  const handleEditIconClick = (e, data) => {
    const input = (e.currentTarget).closest(`[${data}]`).querySelector('input');
    input.focus();
    setFormData({...formData, [input.name]: input.value})
  };

  const handleChildFormDataChange = (field, value) => {
    setGlobalErrorText('');
    setShowGlobalError(false);
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
    navigate(`members?id=${id}&email=${email}`);
  }

  const handleSaveButtonClick = async() => {
    // const unsavedUserData = {
    //   ...formData,
    //   isApprovedByAdmin: false
    // }

    // memberToken &&
    //   await fetch(`${strapiBaseUrl}/api/members/${id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-type': 'application/json',
    //       'Authorization': `Bearer ${memberToken}`
    //     },
    //     body: JSON.stringify(unsavedUserData),
    //   })
    //   .then(res => res.json());

    // setHasUnsavedChanges(false);
    console.log('Save button click');
    
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
            showErrorMessage={showGlobalError}
            errorMessageText={globalErrorText}
            userRole={'service provider'}
          />
        )}
        <section className='section page-width'>
          <div className='container buttonsWrap'>
            <Button children={'Back to dashboard'} onClick={navigateToDashboard} className='btn button'/>
            <Button children={'My members list'} onClick={navigateToMembers} className='btn button'/>
          </div>
          <Text
            tag={'h2'}
            className={'title'}
            children={'New member'}
          />
        </section>
        <section className='page-width'>
          <Image
            type='coverPhoto'
            formData={formData}
            onChildFormDataChange={handleChildFormDataChange}
          />
        </section>
        <section className='profileInfo page-width'>
          <Image
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
        {/* {showPopup &&
          <AccountInfoPopup
            onClose={handleModalClose}
            onEditIconClick={handleEditIconClick}
            onChange={handleChange}
            username={formData.username}
            password={formData.password}
            ressidentialAddress={formData.ressidentialAddress}
          />
        } */}
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
