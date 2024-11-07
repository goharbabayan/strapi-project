import { useState, useRef } from 'react';
import styles from './serviceProviderDetails.module.css'
import SettingIcon from '../icons/Setting';
import Schedule from '../../components/schedule/Schedule';
import Reviews from '../reviews/Reviews';
import MenuBar from '../menuBar/MenuBar';
import AccountInfoPopup from '../accountInfoPopup/AccountInfoPopup';
import Text from '../text/Text';
import GalleryImages from '../galleryImages/GalleryImages';
import AboutMe from '../aboutMe/AboutMe';
import RatesAndServices from '../ratesAndServices/RatesAndServices';
import PersonalDetails from '../personalDetails/PersonalDetails';
import LocationDetails from '../locationDetails/LocationDetails';
import ContactDetails from '../contactDetails/ContactDetails';
import { CREATE_MENU_BAR } from '@/app/utils/constants/menuBar';
import { USER_FORM, USER_FORM_WITH_DATA } from '@/app/utils/constants/userForm';
import ProfilePageImage from '../profilePageImage/ProfilePageImage';

function ServiceProviderDetails ({user, onChanges, hasUnsavedChanges, errorMessage}) {
  const [showPopup, setShowPopup] = useState(false);
  const [userSelectedSuburbs, setUserSelectedSuburbs] = useState(user.suburbs || []);
  const [selectedCity, setSelectedCity] = useState(user.city);
  const [isCityDataChanged, setIsCityDataChanged] = useState(false);
  const [formData, setFormData] = useState(user ? USER_FORM_WITH_DATA(user) : USER_FORM(user));
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
    { name: 'Reviews', sectionRef: reviewsSectionRef },
  ];
  const menu = CREATE_MENU_BAR(menuItems);

  const handleChange = (event) => {
    event.preventDefault();
    setFormData({ ...formData, [event.target.name]: event.target.value });
    onChanges(true, { ...formData, [event.target.name]: event.target.value });
  };

  const handleMouseDown = async (name, value) => {
    if (name === 'city') {
      setSelectedCity(value);
      setUserSelectedSuburbs([]);
      setIsCityDataChanged(true);
    }
      setFormData({ ...formData, [name]: value });
      onChanges(true, { ...formData, [name]: value });
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
    setFormData({...formData, [field]: value});
    onChanges(true, {...formData, [field]: value});
  };

  const handleScheduleChange = (childFormData) => {
    setFormData({...formData, schedule: childFormData});
    onChanges(true, {...formData, schedule: childFormData});
  };

  const handleScrollToSection = (sectionRef) => {
    const topPosition = hasUnsavedChanges ? sectionRef.current.offsetTop - 10 : sectionRef.current.offsetTop + 35;
    if (sectionRef.current) {
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    };
  };

  return (
    <>
      <section className='page-width'>
        <ProfilePageImage
          type='coverPhoto'
          formData={formData}
          onChildFormDataChange={handleChildFormDataChange}
        />
      </section>
      <section className={`profileInfo page-width`}>
        <ProfilePageImage
          type='profilePicture'
          formData={formData}
          onChildFormDataChange={handleChildFormDataChange}
        />
        <div className={styles.details}>
          <Text
            tag={'h2'}
            className={styles.title}
            children={'Personal details'}
          />
          <div className={styles.settingIconWrap}>
            <Text
              tag={'span'}
              children={'Settings'}
              className={`text-middle ${styles.settings}`}
            />
            <SettingIcon
              className={styles.settingIcon}
              onClick={() => handleSettingIconClick()}
            />
          </div>
          <PersonalDetails
            formData={formData}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            errorMessage={errorMessage}
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
          role={'service-provider'}
          errorMessage={errorMessage}
        />
      </section>
      {showPopup &&
        <AccountInfoPopup
          onClose={handleModalClose}
          onEditIconClick={handleEditIconClick}
          onChange={handleChange}
          username={formData.username}
          password={formData.password}
        />
      }
      <MenuBar
        isNotificationBarOpen={hasUnsavedChanges}
        onScrollToSection={handleScrollToSection}
        items={menu}
      />
      <GalleryImages
        id={'photos'}
        children={'Photos'}
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
    </>
  );
}

export default ServiceProviderDetails;
