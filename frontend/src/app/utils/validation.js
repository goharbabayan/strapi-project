import { USER_REQUIRED_FIELDS, USER_REQUIRED_FIELDS_FOR_CLIENT_ROLE, USER_REQUIRED_FIELDS_FOR_ADDING_REVIEW } from './constants/userForm';

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

export const validateForm = (formData, isClientDashboardPage) => {
  const errors = {};
  const requiredFields = isClientDashboardPage ? USER_REQUIRED_FIELDS_FOR_CLIENT_ROLE : USER_REQUIRED_FIELDS;
  const isFormDataEmpty = Object.keys(formData).length === 0;

  if (isFormDataEmpty) {
    requiredFields.forEach(fieldName => {
      const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      errors[fieldName] = `The ${capitalizedFieldName} is required.`;
    });
    return errors;
  } else {
    for (const fieldName in formData) {
      const fieldValue = formData[fieldName];
      const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      const isRequired = isClientDashboardPage ? USER_REQUIRED_FIELDS_FOR_CLIENT_ROLE.includes(fieldName) : USER_REQUIRED_FIELDS.includes(fieldName);
      if (isRequired && fieldValue === '') {
        errors[fieldName] = `The ${capitalizedFieldName} is required.`;
      };

      switch (fieldName) {
        case 'profilePicture':
          if (!fieldValue) errors[fieldName] = 'Please, add profile picture.'
          break;
      // schedule validation checking
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
            errors[fieldName] = 'Fill in at least one workday with both start and end times.';
          } else if (isTimeFilledIncorrect) {
            errors[fieldName] = 'Start time is greater than end time.';
          } else if (isStartTimeExistAndEndTimeEmpty) {
            errors[fieldName] = 'Please, fill end time for workday.';
          } else if (isStartTimeEmptyAndEndTimeExist) {
            errors[fieldName] = 'Please, fill start time for workday.';
          }
          break;
        case 'country':
          const isCountryEmpty = fieldValue === null;
          if (isCountryEmpty) {
            errors[fieldName] = 'Please select country';
          }
          break;
        case 'city':
          const isCityEmpty = fieldValue === null;
          if (isCityEmpty) {
            errors[fieldName] = 'Please choose city';
          }
          break;
        case 'bust':
          const isBustEmpty = fieldValue === null;
          if (isBustEmpty) {
            errors[fieldName] = 'Please choose bust size';
          }
          break;
        case 'gender':
          const isGenderFieldEmpty = fieldValue === null;
          if (isGenderFieldEmpty) {
            errors[fieldName] = 'Please choose gender';
          }
          break;
        case 'photos':
          const isPhotosEmpty = fieldValue && fieldValue.length === 0 || fieldValue === null;
          if (isPhotosEmpty) {
            errors[fieldName] = 'Please add photos';
          }
          break;
        // case 'selfies':
        //   const isSelfiesEmpty = fieldValue && fieldValue.length === 0 || fieldValue === null;
        //   if (isSelfiesEmpty) {
        //     errors[fieldName] = 'Please add selfy images';
        //   }
        // break;
        // case 'interests':
        //   const isInterestsEmpty = fieldValue && fieldValue.length === 0;
        //   if (isInterestsEmpty) {
        //     errors[fieldName] = 'Please add some interests';
        //   }
        //   break;
        case 'services':
          const isServicesEmpty = fieldValue && fieldValue.length === 0;
          if (isServicesEmpty) {
            errors[fieldName] = 'Please add some services';
          }
          break;
        // ToDo: here should be logic, working with selected Place of service
        // case 'incallRates':
        //   const isIncallRatesEmpty = fieldValue && fieldValue.length === 0;
        //   if (isIncallRatesEmpty) {
        //     errors[fieldName] = 'Please fill incall rates';
        //   }
        //   break;
        // case 'outcallRates':
        //   const isOutcallRatesEmpty = fieldValue && fieldValue.length === 0;
        //   if (isOutcallRatesEmpty) {
        //     errors[fieldName] = 'Please fill outcall rates';
        //   }
        //   break;
      }
    }
  };

  return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@[a-z A-Z . 0-9]+([\.-]?\w+)$/;
  return emailRegex.test(email);
};
