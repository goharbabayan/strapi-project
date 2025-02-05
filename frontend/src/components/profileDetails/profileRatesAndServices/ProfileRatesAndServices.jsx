import styles from './profileRatesAndServices.module.css';
import ProviderInterests from '../providerInterests/ProviderInterests';
import React, { useEffect, useState } from 'react';
import Text from '@/components/text/Text';
import RadioButton from '@/components/radioButton/RadioButton';
import FormModal from '@/components/formModal/FormModal';
import Interest from '@/components/interests/Interest';
import { RATES_AND_SERVICES, SERVICE_TYPES } from '@/app/utils/constants/ratesAndServices';
import Rates from '@/components/rates/Rates';
import CombinedRates from '@/components/combinedRates/CombinedRates';
import CombinedServices from '@/components/combinedServices/CombinedServices';
import Modal from '@/components/modal/Modal';
import ErrorInfo from '@/components/errorInfo/ErrorInfo';
import { generateTextFromArray } from '@/app/utils/helpers';
import { validateRates, validateServices } from '@/app/utils/validation';

export default function ProfileRatesAndServices({
  incall,
  outcall,
  services,
  selectedPlaceOfServiceType,
  isVerifiedUser,
  isDashboardPage,
  showEditButton,
  updateUserPendingOvverridesAndSubmitUserData,
  updateUserPendingOverrides,
  onDataChanges,
  errors,
  setErrors,
  updateServicesTypeChange,
}) {

  const [selectedServiceOptionType, setSelectedServiceOptionType] = useState(null);
  const [incallRates, setIncallRates] = useState({ general: [], PSE: [], GFE: [] });
  const [outcallRates, setOutcallRates] = useState({ general: [], PSE: [], GFE: [] });
  const [selectedServices, setSelectedServices] = useState({ general: [], PSE: [], GFE: [] });
  const [showServiceTypeChangeConfirmationPopup, setShowServiceTypeChangeConfirmationPopup] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: '',
  });
  const [update, setUpdate] = useState({
    isValid : true,
    error: '',
  })
  const serviceTypeChangeContent = [
    {
      title: '',
      text: isVerifiedUser ? 'Changes need to be reviewed and approved by admin.' : '',
      showButtons: true,
      showButtonsCentered: true,
      buttons: [
        {
          children: 'No',
          variant: 'general',
          type: 'button',
          onClick: () => {
            handleCancelChanges();
          },
        },
        {
          children: 'Save changes',
          variant: 'main',
          type: 'button',
          onClick: () => {
            handleConfirmChanges();
          },
        },
      ]
    }
  ];

  useEffect(() => {
    const hasInCallRate = checkHasAtLeastOneData(incall);
    const hasOutCallRate = checkHasAtLeastOneData(outcall);
    const hasService = checkHasAtLeastOneData(services);
    if (hasService) {
      const userServiceType = services?.general?.length > 0 ? 'general' : 'gfePse';
      setSelectedServiceOptionType(userServiceType);
      setSelectedServices(services);
    };
    hasInCallRate && setIncallRates(incall);
    hasOutCallRate && setOutcallRates(outcall);
  }, []);

  const handleCancelChanges = () => {
    handleModalClose();
  };

  const handleConfirmChanges = () => {
    setSelectedServiceOptionType((prevType) =>
      prevType === 'general' ? 'gfePse' : 'general'
    );
    setIncallRates({ general: [], PSE: [], GFE: [] });
    setOutcallRates({ general: [], PSE: [], GFE: [] });
    setSelectedServices({ general: [], PSE: [], GFE: [] });

    if (isVerifiedUser) {
      updateServicesTypeChange();
    } else {
      // remove all data
      updateUserPendingOvverridesAndSubmitUserData({
        'services': { general: [], PSE: [], GFE: [] },
        'incall': { general: [], PSE: [], GFE: [] },
        'outcall': { general: [], PSE: [], GFE: [] },
      });
    }
    handleModalClose();
  };

  const handleModalClose = () => {
    setShowServiceTypeChangeConfirmationPopup(false);
  };

  const checkHasAtLeastOneData = (data) => {
    return data?.general?.length > 0 || (data?.PSE?.length > 0 && data?.GFE?.length > 0);
  };

  const handleEditIconClick = (title, id) => {
    setModalInfo({
      show: true,
      title: title,
      id: id,
    });
  };

  const onChanges = (type, updatedSubTypes) => {
    setUpdate({
      error: '',
      isValid: true,
    });
    if (isVerifiedUser) {
      const {isValid, error} = (type === 'incall' || type === 'outcall') ? validateRates(updatedSubTypes, type, selectedPlaceOfServiceType) : validateServices(updatedSubTypes);
      if (!isValid) {
        setUpdate({
          isValid: isValid,
          error: error,
        });
        return;
      }
    }
    const userSelectedData = {
      services: selectedServices,
      incall: incallRates,
      outcall: outcallRates,
    };

    if (userSelectedData[type]) {
      onDataChanges(type, {
        ...userSelectedData[type],
        ...updatedSubTypes,
      });
    }
    setModalInfo({
      show: false,
      title: '',
    });
  };

  return (
    <div className="page-width">
      <div className={styles.mainWrapper}>
        {isDashboardPage &&
          <div className={styles.serviceTypesWrapper}>
            <Text
              tag={'h4'}
              className={styles.title}
              children={'Select the type of services'}
            />
            <div className={styles.services}>
              {SERVICE_TYPES.map((item, index) => {
                const {id, name, type, value} = item;
                return (
                  <RadioButton
                    key={index}
                    props={{
                      label: type,
                      id: id,
                      value: value,
                      name: name,
                      type: selectedServiceOptionType,
                      onSelectType: (e) => {
                        !selectedServiceOptionType && setSelectedServiceOptionType(e.target.value);
                        selectedServiceOptionType && setShowServiceTypeChangeConfirmationPopup(true);
                      },
                    }}
                  />
                )
              })}
            </div>
          </div>
        }
        {showServiceTypeChangeConfirmationPopup &&
          <Modal
            title={'Are you sure you want to do to this change?'}
            content={serviceTypeChangeContent}
            closeModal={handleModalClose}
          />
        }
        {selectedServiceOptionType && selectedServiceOptionType === 'general' &&
          <>
            <ProviderInterests
              componentTitle="General Services"
              data={services?.general}
              showEditButton={showEditButton}
              onClick={() => handleEditIconClick('General Services', 'general-services')}
            />
            <div className={styles.rates}>
              <ProviderInterests
                componentTitle="Incall"
                data={incall?.general}
                isRateData={true}
                showEditButton={showEditButton}
                onClick={() => handleEditIconClick('Incall Rates', 'incall-general')}
              />
              <ProviderInterests
                componentTitle="Outcall"
                data={outcall?.general}
                isRateData={true}
                showEditButton={showEditButton}
                onClick={() => handleEditIconClick('Outcall Rates', 'outcall-general')}
              />
            </div>
          </>
        }
        {selectedServiceOptionType && selectedServiceOptionType === 'gfePse' &&
          <>
            <ProviderInterests
              componentTitle='GFE, PSE Services'
              data={services?.GFE}
              data2={services?.PSE}
              showEditButton={showEditButton}
              dataTitle={'GFE'}
              dataTitle2={'PSE'}
              onClick={() => handleEditIconClick('GFE, PSE services', 'gfepse')}
            />
            <div className={styles.rates}>
              <ProviderInterests
                componentTitle="Incall"
                data={incall?.GFE}
                data2={incall?.PSE}
                dataTitle={'GFE'}
                dataTitle2={'PSE'}
                isRateData={true}
                showEditButton={showEditButton}
                onClick={() => handleEditIconClick('Incall Rates', 'incall-gfepse')}
              />
              <ProviderInterests
                componentTitle="Outcall"
                dataTitle={'GFE'}
                dataTitle2={'PSE'}
                data={outcall?.GFE}
                data2={outcall?.PSE}
                isRateData={true}
                showEditButton={showEditButton}
                onClick={() => handleEditIconClick('Outcall Rates', 'outcall-gfepse')}
              />
            </div>
          </>
        }
      </div>
      {modalInfo?.show &&
        <FormModal
          title={modalInfo?.title}
          className={styles.locationForm}
          onClose={() => {
            setModalInfo({
              show: false,
              title: '',
            });
          }}
        >
        {!update.isValid &&
          <Text
            tag={'span'}
            className={styles.error}
            children={update.error}
          />
        }
        {RATES_AND_SERVICES(services, incall, outcall, onChanges).filter((item) => item.id === modalInfo.id).map((item, index) => {
          const {id, data, data1, data2, type, subType, subType1, subType2, optionsList, updateChange} = item;
          
          if (subType === 'general') {
            return type === 'services' ? (
              <Interest
                key={id}
                userSelectedInterests={data}
                optionsList={optionsList}
                updateChange={updateChange}
                showServicesOptions={true}
              />
            ) : (
              <Rates
                key={id}
                type={type}
                subType={subType}
                userRates={data}
                updateChange={updateChange}
                optionsList={optionsList}
              />
            )
          } else {
            return type === 'services' ? (
              <div key={index}>
                <CombinedServices
                  type={type}
                  subType1={subType1}
                  subType2={subType2}
                  userServices1={data1}
                  userServices2={data2}
                  updateChange={(type, updatedSubTypes) => onChanges(type, updatedSubTypes)}
                  optionsList={optionsList}
                />
              </div>
            ) : (
              <div key={index}>
                <CombinedRates
                  type={type}
                  subType1={subType1}
                  subType2={subType2}
                  userRates1={data1}
                  userRates2={data2}
                  updateChange={(type, updatedSubTypes) => onChanges(type, updatedSubTypes)}
                  optionsList={optionsList}
                />
              </div>
            )
          }
        })}
        </FormModal>
      }
      {errors &&
        <div className={styles.infoMessage}>
          <Text
            tag={'span'}
            children={errors && Object.values(errors).filter(Boolean).join(', ')}
          />
        </div>
      }
    </div>
  )
}
