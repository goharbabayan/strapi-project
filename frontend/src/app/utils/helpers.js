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

export const buildQueriesForFilteredOptions = (data) => {
  let ind = 0;
  const queryParts = [];
  let fieldQuery = [];
  for (const field in data) {
    const fieldValues = data[field];
    if (!fieldValues.length) continue;
    if (fieldValues.length < 2) {
      if (field === 'services') {
        fieldQuery = fieldValues.map((value) => `[$and][${ind}][${field}][item]=${value}`).join(`&filters`);
      } else if (field === 'name' || field === 'lastName') {
        fieldQuery = fieldValues.map((value) => `[$or][${ind}][${field}][$containsi]=${value}`).join(`&filters`);
      } else {
        fieldQuery = fieldValues.map((value) => `[$and][${ind}][${field}][$eq]=${value}`).join(`&filters`);
      };
    } else {
      if (field === 'services') {
        fieldQuery = fieldValues.map((value, index) => `[$and][${ind}][$or][${index++}][${field}][item]=${value}`).join(`&filters`);
      } else {
        fieldQuery = fieldValues.map((value, index) => `[$and][${ind}][$or][${index++}][${field}]=${value}`).join(`&filters`);
      };
    }
    queryParts.push(fieldQuery);
    ind++;
  };
  const combinedQuery = queryParts.join(`&filters`);
  return combinedQuery;
};

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

export const inputValidation = (fieldName, value, requiredLength) => {
  let isUsername = false;
  if(fieldName === 'Username') isUsername = true;

  if (!value) return {
    isValid: false,
    errorMessage: `${fieldName} is required.`
  };
  if (value.includes(' ') && !isUsername) return {
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
