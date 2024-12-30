import { DEFAULT_CATEGORIES_OPTIONS, CATEGORIES_LIST } from "./constants/categories"; 

export async function debounce(callback, delay) {
  let timeoutId;

  return function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  }
}

export const calculateImageAspectRatio = (width, height) => {
  return width / height;
}

const hasBothIncallAndOutcall = (placeOfService) => {
  const requiredOptions = ['In-Call', 'Out-Call'];
  return requiredOptions.every(option => placeOfService.includes(option));
};

export const buildQueriesForFilteredOptions = (data) => {
  let ind = 0;
  const queryParts = [];
  let fieldQuery = [];
  
  for (const field in data) {
    const fieldValues = data[field];
    const isFilteredPlaceOfServiceField = data?.placeOfService.length > 0;
    const isBothIncallAndOutCallOptionsAreFiltered = hasBothIncallAndOutcall(data?.placeOfService);
    const queryParameter = {
      "In-Call": "incallRates",
      "Out-Call": "outcallRates",
    };
    const selectedOption = queryParameter[data?.placeOfService[0]]
    const isFilledFromOrToValueOfHourlyRate = field === 'hourlyRate' && (fieldValues?.from && fieldValues?.from !== '' || fieldValues?.to && fieldValues?.to !== '');
    if (isFilledFromOrToValueOfHourlyRate) {
      const fromValue = Number(fieldValues?.from) || 0;
      const toValue = Number(fieldValues?.to) || 1000000000;
      // check is filtered both inCall and outCall options case
      if (!isFilteredPlaceOfServiceField || isBothIncallAndOutCallOptionsAreFiltered) {
        fieldQuery = `[$and][${ind}][$or][0][incallRates][duration][$eq]=1 hour&filters[$and][${ind}][$or][0][incallRates][price][$gte]=${fromValue}&filters[$and][${ind}][$or][0][incallRates][price][$lte]=${toValue}&filters[$and][${ind}][$or][1][outcallRates][duration][$eq]=1 hour&filters[$and][${ind}][$or][1][outcallRates][price][$gte]=${fromValue}&filters[$and][${ind}][$or][1][outcallRates][price][$lte]=${toValue}`;
        ind++;
      } else if (isFilteredPlaceOfServiceField) {
        fieldQuery = `[$and][${ind}][${selectedOption}][duration][$eq]=1 hour&filters[$and][${ind}][${selectedOption}][price][$gte]=${fromValue}&filters[$and][${ind}][${selectedOption}][price][$lte]=${toValue}`;
        ind++;
      };
    } else {
      if (!fieldValues.length) continue;
      if (fieldValues.length < 2) {
        if (field === 'services' || field === 'extras') {
          fieldQuery = fieldValues.map((value) => `[$and][${ind}][${field}][item]=${value}`).join(`&filters`);
        } else if (field === 'nameOrLastName') {
          fieldQuery = fieldValues.map((value) => `[$and][${ind}][$or][0][name][$containsi]=${value}&filters[$and][${ind}][$or][1][lastName][$containsi]=${value}`).join(`&filters`);
        } else if (field === 'suburbs') {
          fieldQuery = fieldValues.map((value) => `[$and][${ind}][${field}][name]=${value}`).join(`&filters`);
        } else {
          fieldQuery = fieldValues.map((value) => `[$and][${ind}][${field}][$eq]=${value}`).join(`&filters`);
        };
      } else {
        if (field === 'services' || field === 'extras') {
          fieldQuery = fieldValues.map((value, index) => `[$and][${ind}][$or][${index++}][${field}][item]=${value}`).join(`&filters`);
        } else if (field === 'suburbs') {
          fieldQuery = fieldValues.map((value, index) => `[$and][${ind}][$or][${index++}][${field}][name]=${value}`).join(`&filters`);
        } else if (field === 'placeOfService' && isBothIncallAndOutCallOptionsAreFiltered) {
          fieldQuery = `[$and][${ind}][$or][0][placeOfService][$eq]=In-Call&filters[$and][${ind}][$or][1][placeOfService][$eq]=Out-Call`;
        } else {
          fieldQuery = fieldValues.map((value, index) => `[$and][${ind}][$or][${index++}][${field}]=${value}`).join(`&filters`);
        };
      }
    };
    queryParts.push(fieldQuery);
    ind++;
  };

  const combinedQuery = queryParts.join(`&filters`);
  return combinedQuery;
};

export const generateListOfOptionsForExistingResults = (results) => {
  let options = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES_OPTIONS)) || [];
  results.map(provider => {
    CATEGORIES_LIST.forEach(categoryName => {
      const isCategoryArrayField = Array.isArray(provider[categoryName]);
      const isEmptyCategoryArrayValue = isCategoryArrayField && provider[categoryName].length === 0;
      const optionIsNotExistingInOptionsListAndIsNotServicesOption = provider[categoryName] && categoryName !== 'services' && !options[categoryName].includes(provider[categoryName]);

      if (isEmptyCategoryArrayValue) return;
      if (isCategoryArrayField && categoryName === 'services') {
        provider[categoryName].forEach(item => {
          const itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty = item.item && !options[categoryName].includes(item.item);
          itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty && options[categoryName].push(item.item);
        });
      } else if (isCategoryArrayField && categoryName === 'suburbs') {
        provider[categoryName].forEach(item => {
          const itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty = item.name && !options[categoryName].includes(item.name);
          itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty && options[categoryName].push(item.name);
        });
      } else if (isCategoryArrayField && categoryName === 'extras') {
        provider[categoryName].forEach(item => {
          const itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty = item.item && !options[categoryName].includes(item.item);
          itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty && options[categoryName].push(item.item);
        });
      } else if (optionIsNotExistingInOptionsListAndIsNotServicesOption) {
        options[categoryName].push(provider[categoryName]);
      };
    });
  });
  return options;
}

export const isInputLengthValid = (inputValue, requiredLength) => {
  return inputValue.length >= requiredLength;
};

const emailRegex = /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

export const emailValidation = (value) => {
  if (!value) return {
    isValid: false,
    errorMessage: `Email is required.`
  };
  if (emailRegex.test(value) === false) return {
    isValid: false,
    errorMessage: 'Email is invalid.'
  }
  return {
    isValid: true,
    errorMessage: '',
  }
};

export const inputValidation = (fieldName, value, requiredLength, mayIncludeSpaces) => {
  let isUsername = false;
  if(fieldName === 'Username') isUsername = true;

  if (!value) return {
    isValid: false,
    errorMessage: `${fieldName} is required.`
  };
  if (!mayIncludeSpaces && value.includes(' ') && !isUsername) return {
    isValid: false,
    errorMessage: `${fieldName} is invalid.`
  };
  if (value.length < requiredLength) return {
    isValid: false,
    errorMessage: `${fieldName} must be at least ${requiredLength} characters.`
  };
  return {
    isValid: true,
    errorMessage: '',
  }
};

export const confirmPasswordValidation = (confirmPasswordValue, passwordValue) => {
  if (!confirmPasswordValue) return {
    isValid: false,
    errorMessage: 'Password confirmation is required.'
  };
  if (confirmPasswordValue.includes(' ')) return {
    isValid: false,
    errorMessage: 'Password confirmation is invalid.'
  };
  if (confirmPasswordValue !== passwordValue) return {
    isValid: false,
    errorMessage: 'Passwords do not match.'
  };
  if (confirmPasswordValue.length < 6) return {
    isValid: false,
    errorMessage: 'Password confirmation must be at least 6 characters.'
  };
  return {
    isValid: true,
    errorMessage: '',
  }
};
