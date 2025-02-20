import { USER_REQUIRED_FIELDS, USER_REQUIRED_FIELDS_FOR_CLIENT_ROLE, USER_REQUIRED_FIELDS_FOR_ADDING_REVIEW, USER_REQUIRED_FIELDS_FOR_CREATING_NEW_Provider } from './constants/userForm';
import { CLIENT, MANAGER } from './constants/userRoles';

export const validateFormData = (formData) => {
  const errors = {};
  for (const fieldName in formData) {
    const fieldValue = formData[fieldName];
    const isRequired = USER_REQUIRED_FIELDS_FOR_ADDING_REVIEW.includes(fieldName);
    if (isRequired && fieldValue === '') {
      errors[fieldName] = 'This field is required';
    };
  };
  return errors;
};

export const formatFieldName = (fieldName) => {
  // Split the camelCase string into words using regex
  const words = fieldName.replace(/([A-Z])/g, ' $1').toLowerCase().trim();

  // Capitalize the first word and leave others in lowercase
  return words.charAt(0).toUpperCase() + words.slice(1);
}
export const validateServices = (services) => {
  let isValid = true;
  let error = null;

  // Check if General services is filled
  const isGeneralFilled = services?.general?.length > 0;
  
  // Check if Specialized and Experienced are filled properly
  const isPSEFilled = services?.Experienced?.length > 0;
  const isSpecializedFilled = services?.Specialized?.length > 0;

  // If General is selected, ensure at least one service is selected in General
  if (services?.general && !isGeneralFilled) {
    isValid = false;
    error = 'Please add at least one service under General';
  }

  // If both Experienced and Specialized are selected, ensure at least one service is selected for each
  if ((isPSEFilled || isSpecializedFilled) && !(isPSEFilled && isSpecializedFilled)) {
    isValid = false;
    error = 'Please add at least one service for both Experienced and Specialized';
  }

  // Ensure that at least one service is selected if neither General, Experienced, or Specialized is empty
  const servicesIsNotEmpty = 
    (services?.general && services?.general?.length > 0) || 
    (services?.Experienced && services?.Experienced?.length > 0) || 
    (services?.Specialized && services?.Specialized?.length > 0);

  if (!servicesIsNotEmpty) {
    isValid = false;
    error = 'Please, add at least one service';
  }

  return { isValid: isValid, error: error };
};

export const validateRates = (rates, type, selectedPlaceOfServiceType) => {
  let isValid = true;
  let error = null;
  let isSelectedOutcallPlaceOfServiceAndOutcallRatesAreEmpty, isSelectedIncallPlaceOfServiceAndIncallRatesAreEmpty;
  if (selectedPlaceOfServiceType && selectedPlaceOfServiceType != '') {
    isSelectedOutcallPlaceOfServiceAndOutcallRatesAreEmpty = selectedPlaceOfServiceType === 'Out-Call' && type === 'outcall' && (!rates || (!rates?.general?.length && !rates?.Experienced?.length && !rates?.Specialized?.length));
    isSelectedIncallPlaceOfServiceAndIncallRatesAreEmpty = selectedPlaceOfServiceType === 'In-Call' && type === 'incall' && (!rates || (!rates?.general?.length && !rates?.Experienced?.length && !rates?.Specialized?.length));
  };

  if (isSelectedIncallPlaceOfServiceAndIncallRatesAreEmpty || isSelectedOutcallPlaceOfServiceAndOutcallRatesAreEmpty) {
    error = `Please add at least one rate for ${type} rates`;
    isValid = false;
  } else {
    ['general', 'Experienced', 'Specialized'].forEach(category => {
      rates[category]?.forEach(rate => {
        // Ensure duration and price are filled
        if (!rate?.duration || rate?.duration === "") {
          error = `Please fill the duration for ${category} in ${type}`;
          isValid = false;
        }

        // Ensure price is not an empty string
        if (rate?.price === "" || rate?.price === null) {
          error = `Please fill the price for ${category} in ${type}`;
          isValid = false;
        }
      });
    });
  }
  return {isValid: isValid, error: error};
};

export const validateForm = (formData, isClientDashboardPage) => {
  const errors = {};
  const requiredFields = isClientDashboardPage
    ? USER_REQUIRED_FIELDS_FOR_CLIENT_ROLE
    : USER_REQUIRED_FIELDS;

  if (Object.keys(formData).length === 0) {
    requiredFields.forEach(fieldName => {
      errors[fieldName] = `The ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    });
    return errors;
  }

  for (const fieldName in formData) {
    const fieldValue = formData[fieldName];
    const isRequired = requiredFields.includes(fieldName);

    if (isRequired && fieldValue === '') {
      errors[fieldName] = `The ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }

    // Validation for services field
    if (fieldName === 'services') {
      const isGeneralFilled = fieldValue?.general?.length > 0;
      const isPSEFilled = fieldValue?.Experienced?.length > 0;
      const isSpecializedFilled = fieldValue?.Specialized?.length > 0;

      // Case 1: If 'general' is selected, make sure it has at least one service
      if (fieldValue?.general && isGeneralFilled && fieldValue?.general?.length === 0) {
        errors[fieldName] = 'Please add at least one service under General';
      }

      // Case 2: If both 'Specialized' and 'Experienced' are selected, each must have at least one service
      if ((isPSEFilled || isSpecializedFilled) && !(isPSEFilled && isSpecializedFilled)) {
        errors[fieldName] = 'Please add at least one service for both Experienced and Specialized';
      }

      // Final Check: If no services are added at all in general, Experienced, or Specialized
      const servicesIsNotEmpty =
        (fieldValue?.general && fieldValue?.general?.length > 0) ||
        (fieldValue?.Experienced && fieldValue?.Experienced?.length > 0) ||
        (fieldValue?.Specialized && fieldValue?.Specialized?.length > 0);

      if (!servicesIsNotEmpty) {
        errors[fieldName] = 'Please, add at least one service';
      }
    }
  }

  //  Validate incall and outcall rates
  if (formData.placeOfService) {
    const validateRates = (rates, type, selectedPlaceOfServiceType) => {
      if (!rates || !rates.general.length && !rates.Experienced.length && !rates.Specialized.length) {
        if (!errors['services']) {
          errors['services'] = `Please add at least one rate for ${type} rates`;
        } else {
          errors['services'] += ` and ${type} rates`;
        }
        // errors['services'] = `Please add at least one rate for ${type} rates`;
      } else {
        ['general', 'Experienced', 'Specialized'].forEach(category => {
          rates[category]?.forEach(rate => {
            // Ensure duration and price are filled
            if (!rate.duration || rate.duration === "") {
              errors[type] = `Please fill the duration for ${category} in ${type}`;
            }
    
            // Ensure price is not an empty string
            if (rate.price === "" || rate.price === null) {
              errors[type] = `Please fill the price for ${category} in ${type}`;
            }
          });
        });
      }
    };

    if (formData.placeOfService.includes('In-Call')) {
      if (formData.incall) {
        validateRates(formData.incall, 'incall', formData.placeOfService);
      } else {
        errors['incall'] = 'Please add at least one rate for incall rates';
      }
    }

    if (formData.placeOfService.includes('Out-Call')) {
      if (formData.outcall) {
        validateRates(formData.outcall, 'outcall', formData.placeOfService);
      } else {
        errors['outcall'] = 'Please add at least one rate for outcall rates';
      }
    }
  }

  // Additional field validations
  for (const fieldName in formData) {
    const fieldValue = formData[fieldName];

    switch (fieldName) {
      case 'profilePicture':
      case 'coverPhoto':
      case 'country':
      case 'city':
      case 'gender':
      case 'name':
      case 'lastName':
      case 'age':
      case 'eyeColor':
      case 'hairColor':
      case 'height':
      case 'placeOfService':
      case 'phoneNumber':
        if (!fieldValue) {
          errors[fieldName] = `Please, add ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
        }
        break;

      // Schedule validation
      case 'schedule': {
        let hasAtLeastOneFilledSchedule = false;
        let isTimeFilledIncorrect = false;
        let isStartTimeExistAndEndTimeEmpty = false;
        let isStartTimeEmptyAndEndTimeExist = false;

        fieldValue.forEach(workdaySchedule => {
          const isScheduleStartEmpty = workdaySchedule.start === '';
          const isScheduleEndEmpty = workdaySchedule.end === '';
          const startAndEndTimeComparison =
            Number(workdaySchedule.start.slice(0, 2)) >
              Number(workdaySchedule.end.slice(0, 2)) &&
            Number(workdaySchedule.start.slice(0, 2)) !== 0 &&
            Number(workdaySchedule.end.slice(0, 2)) !== 0;

          if (startAndEndTimeComparison) isTimeFilledIncorrect = true;

          if (!isScheduleStartEmpty && !isScheduleEndEmpty) {
            hasAtLeastOneFilledSchedule = true;
          } else if (!isScheduleStartEmpty && isScheduleEndEmpty) {
            isStartTimeExistAndEndTimeEmpty = true;
          } else if (isScheduleStartEmpty && !isScheduleEndEmpty) {
            isStartTimeEmptyAndEndTimeExist = true;
          }
        });

        if (!hasAtLeastOneFilledSchedule) {
          errors[fieldName] = `Fill in at least one workday with both 'Start' and 'End' times.`;
        } else if (isTimeFilledIncorrect) {
          errors[fieldName] = `'Start' time is greater than 'End' time.`;
        } else if (isStartTimeExistAndEndTimeEmpty) {
          errors[fieldName] = `Fill the 'End' time for workday.`;
        } else if (isStartTimeEmptyAndEndTimeExist) {
          errors[fieldName] = `Fill the 'Start' time for workday.`;
        }
        break;
      }

      // Photos validation
      case 'photos': {
        const isPhotosEmpty = !fieldValue || fieldValue.length === 0;
        if (isPhotosEmpty) {
          errors[fieldName] = 'Please add Photos';
        }
        break;
      }

      // Services validation
      case 'services': {
        const isGeneralOSpecializedPSEServicesFilled =
          fieldValue && (fieldValue?.general?.length !== 0 || (fieldValue?.Experienced?.length !== 0 && fieldValue?.Specialized?.length !== 0));
        if (!isGeneralOSpecializedPSEServicesFilled) {
          errors[fieldName] = 'Please, add at least one service';
        }
        break;
      }
    }
  }

  return errors;
};



export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@[a-z A-Z . 0-9]+([\.-]?\w+)$/;
  return emailRegex.test(email);
};

export const validateRequiredFieldValue = (fieldName, fieldValue) => {
  let error = null;
  const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

  switch (fieldName) {
    case 'profilePicture':
    case 'coverPhoto':
    case 'country':
    case 'city':
    case 'gender':
    case 'name':
    case 'lastName':
    case 'age':
    case 'eyeColor':
    case 'hairColor':
    case 'height':
    case 'placeOfService':
    case 'phoneNumber':
      if (!fieldValue || fieldValue === '') {
        error = {[fieldName]: `The ${capitalizedFieldName} is a required field.`};
      }
      break;
    case 'schedule':
      let hasAtLeastOneFilledSchedule, isTimeFilledIncorrect, isStartTimeExistAndEndTimeEmpty, isStartTimeEmptyAndEndTimeExist = false;
        fieldValue.map(workdaySchedule => {
          const isScheduleStartEmpty = workdaySchedule.start === '';
          const isScheduleEndEmpty = workdaySchedule.end === '';
          const startAndEndTimeComparison = Number(workdaySchedule.start.slice(0, 2)) > Number(workdaySchedule.end.slice(0, 2)) && Number(workdaySchedule.start.slice(0, 2)) != 0 &&  Number(workdaySchedule.end.slice(0, 2)) != 0;
          startAndEndTimeComparison ? isTimeFilledIncorrect = true : null;

          if (!isScheduleStartEmpty && !isScheduleEndEmpty) {
            hasAtLeastOneFilledSchedule = true;
          } else if (!isScheduleStartEmpty && isScheduleEndEmpty) {
            isStartTimeExistAndEndTimeEmpty = true;
          } else if (isScheduleStartEmpty && !isScheduleEndEmpty) {
            isStartTimeEmptyAndEndTimeExist = true;
          }
        });
        if (!hasAtLeastOneFilledSchedule) {
          error = {[fieldName]: `Fill in at least one workday with both 'Start' and 'End' times.`};
        } else if (isTimeFilledIncorrect) {
          error = {[fieldName]: `'Start' time is greater than 'End' time.`};
        } else if (isStartTimeExistAndEndTimeEmpty) {
          error = {[fieldName]: `Fill the 'End' time for workday.`};
        } else if (isStartTimeEmptyAndEndTimeExist) {
          error = {[fieldName]: `Fill the 'Start' time for workday.`};
        }
        break;
    case 'photos':
      const isPhotosEmpty = fieldValue && fieldValue.length === 0 || fieldValue === null;
      if (isPhotosEmpty) {
        error = {[fieldName]: 'Photos are required.'};
      }
      break;
    case 'services':
      const isGeneralOSpecializedPSEServicesFilled = fieldValue && (fieldValue?.general?.length !== 0 || (fieldValue?.Experienced?.length !== 0 && fieldValue?.Specialized?.length !== 0));
      if (!isGeneralOSpecializedPSEServicesFilled) {
        error = {[fieldName]: 'Services are required.'};
      };
      break;
    }
  return error;
};
