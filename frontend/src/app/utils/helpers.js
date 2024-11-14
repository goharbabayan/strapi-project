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
