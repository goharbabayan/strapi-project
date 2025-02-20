import { useState } from 'react';
import Text from '@/components/text/Text';
import ProviderInterests from '../providerInterests/ProviderInterests';
import styles from './profileAboutMe.module.css';
import EditContentIcon from '@/components/icons/EditContent';
import FormModal from '@/components/formModal/FormModal';
import AboutMe from '@/components/aboutMe/AboutMe';
import Interest from '@/components/interests/Interest';
import { QUALIFICATIONS_OPTIONS, EXPERIENCE_OPTIONS } from '@/app/utils/constants/userPossibleOutfits';

export default function ProfileAboutMe ({aboutMeDescription, providerExperience, providerQualififcations, data}) {
  const {
    showEditButton,
    showEmptyStateForDashboardPage,
    onChanges,
  } = data || {};

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);

  const handleEditIconClick = (modalTitle) => {
    setShowModal(true);
    setModalTitle(modalTitle);
  };

  const interestsContent = [
    {
      componentTitle: 'My Experience',
      data: providerExperience,
      optionsList: EXPERIENCE_OPTIONS,
      updateChange: (value) => {
        onChanges('experience', value);
        setShowModal(false);
      }
    },
    {
      componentTitle: 'My Qualifications',
      data: providerQualififcations,
      optionsList: QUALIFICATIONS_OPTIONS,
      updateChange: (value) => {
        onChanges('qualifications', value);
        setShowModal(false);
      }
    },
  ];

  return (
    <div className="page-width">
      {showModal &&
        <FormModal
          title={modalTitle}
          className={styles.locationForm}
          onClose={() => {
            setShowModal(false);
            setModalTitle(null);
          }}
        >
          {modalTitle === 'About Me' &&
            <AboutMe
              aboutMeData={aboutMeDescription}
              onSaveChanges={onChanges}
              setShowModal={setShowModal}
            />
          }
          {interestsContent.filter(item => item.componentTitle === modalTitle).map((item, index) => (
            <Interest
              key={index}
              showServicesOptions={true}
              userSelectedInterests={item.data}
              optionsList={item.optionsList}
              updateChange={item.updateChange}
            />
          ))}
        </FormModal>
      }
      {!!aboutMeDescription &&
        <div className={styles.aboutMeContainer}>
          <div className={styles.titleAndIconWrapper}>
            <Text
              tag={'h3'}
              children={'About me'}
              className={styles.aboutMeTitle}
            />
            {showEditButton &&
            <>
              <EditContentIcon
                className={styles.editIcon}
                onClick={() => handleEditIconClick('About Me')}
              />
            </>
            }
          </div>
          <Text
            tag={'p'}
            children={aboutMeDescription}
            className={styles.aboutMeText}
          />
        </div>
      }
      {!aboutMeDescription && showEmptyStateForDashboardPage &&
        <div className={styles.aboutMeContainer}>
          <div className={styles.titleAndIconWrapper}>
            <Text
              tag={'h3'}
              children={'About me'}
              className={styles.aboutMeTitle}
            />
            {showEditButton &&
              <EditContentIcon
                className={styles.editIcon}
                onClick={() => handleEditIconClick('About Me')}
              />
            }
          </div>
        </div>
      }
      <div className={styles.aboutMeInterestsContainer}>
        {interestsContent.map((interest, index) => {
          const {componentTitle, data} = interest;
          if (!showEmptyStateForDashboardPage && data?.length === 0) return null;
          return (
            <ProviderInterests
              key={index}
              componentTitle={componentTitle}
              data={data}
              showEmptyStateForDashboardPage={showEmptyStateForDashboardPage}
              showEditButton={showEditButton}
              onClick={() => handleEditIconClick(componentTitle)}
            />
          )
        })}
      </div>
    </div>
  )
}
