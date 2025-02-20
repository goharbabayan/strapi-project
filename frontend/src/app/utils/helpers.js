import { useFetchData } from "./hooks/useFetch";
import { DEFAULT_CATEGORIES_OPTIONS, CATEGORIES_LIST } from "./constants/categories"; 
import GoldenBadge from "@/components/icons/badges/GoldenBadge";
import SilverBadge from "@/components/icons/badges/SilverBadge";
import BronzeBadge from "@/components/icons/badges/BronzeBadge";
import { ADMIN_APPROVAL_FIELDS } from "./constants/userAdminApprovalFields";
import { USER_FIELDS_IN_PROFILE_EDIT_FORM, USER_FORM_NEW_MEMBER, USER_REQUIRED_FIELDS } from "./constants/userForm";
import { CLIENT, MANAGER, SERVICE_PROVIDER } from "./constants/userRoles";
import { formatFieldName } from "./validation";

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
        if (field === 'services') {
          fieldQuery = fieldValues.map((value) => `[$and][${ind}][${field}][item]=${value}`).join(`&filters`);
        } else if (field === 'nameOrLastName') {
          fieldQuery = fieldValues.map((value) => `[$and][${ind}][$or][0][name][$containsi]=${value}&filters[$and][${ind}][$or][1][lastName][$containsi]=${value}`).join(`&filters`);
        } else if (field === 'suburbs') {
          fieldQuery = fieldValues.map((value) => `[$and][${ind}][${field}][name]=${value}`).join(`&filters`);
        } else {
          fieldQuery = fieldValues.map((value) => `[$and][${ind}][${field}][$eq]=${value}`).join(`&filters`);
        };
      } else {
        if (field === 'services') {
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

export const generateTextFromArray = (arrayDaya, addQuotes) => {
  const text = Array.isArray(arrayDaya) ? arrayDaya.map((key) => `${addQuotes ? " ' " : ''} ${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} ${addQuotes ? " ' " : ''}`).join(', ') : '';
  return text;
};

export const generateListOfOptionsForExistingResults = (results) => {
  let options = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES_OPTIONS)) || [];
  results.map(provider => {
    CATEGORIES_LIST.forEach(categoryName => {
      const isCategoryArrayField = Array.isArray(provider[categoryName]);
      const isEmptyCategoryArrayValue = isCategoryArrayField && provider[categoryName].length === 0;
      const optionIsNotExistingInOptionsListAndIsNotServicesOption = provider[categoryName] && categoryName !== 'services' && !options[categoryName].includes(provider[categoryName]);

      if (isEmptyCategoryArrayValue) return;
      if (provider[categoryName] && categoryName === 'services') {
        if (!provider[categoryName]) return;
        const { general, Specialized, Experienced } = provider[categoryName];
        [general, Specialized, Experienced].forEach(category => {
          if (Array.isArray(category)) {
            category.forEach(service => {
              const itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty = service.item && !options[categoryName].includes(service.item);
              itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty && options[categoryName].push(service.item);
          });
          }
        });
      } else if (isCategoryArrayField && categoryName === 'suburbs') {
        provider[categoryName].forEach(item => {
          const itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty = item.name && !options[categoryName].includes(item.name);
          itemIsNotIncludedInOptionsListAndItemValueIsNotEmpty && options[categoryName].push(item.name);
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

export async function uploadImageWithWatermark (e, token, canBeUploadedMoreThanOneImage) {
  
  const isUploadedMultipleFiles = e.target.files.length > 1;
  const form = new FormData();

  if (isUploadedMultipleFiles && canBeUploadedMoreThanOneImage) {
    for (const key in e.target.files) {
      form.append('images', e.target.files[key]);
    }
  } else {
    const imageFile = e.target.files[0];
    form.append('images', imageFile);
  }

  if (e.target.files.length === 0) return;

  try {
    const watermarkResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/watermark-images`, {
      method: 'POST',
      body: form,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const watermarkData = await watermarkResponse.json();

    if (!watermarkResponse.ok || !watermarkData.watermarkedImages) {
      throw new Error('Failed to apply watermark');
    }

    const uploadFormData = new FormData();
    for (let i = 0; i < watermarkData.watermarkedImages.length; i++) {
      const watermarkedImageUrl = watermarkData.watermarkedImages[i].url;
      const watermarkedImageBlob = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}${watermarkedImageUrl}`).then(res => res.blob());
      const fileName = watermarkedImageUrl.split('/').pop();
      const customFile = new File([watermarkedImageBlob], fileName, {
        type: watermarkedImageBlob.type,
        lastModified: Date.now(),
      });

      uploadFormData.append('files', customFile);
    }

    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload?populate=*`, {
      method: 'POST',
      headers: {
          Authorization: `Bearer ${token}`,
      },
      body: uploadFormData,
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadData[0]) {
      throw new Error('Failed to upload watermarked image');
    }

    return(uploadData);
  } catch (error) {
    console.error('Error during image processing or upload:', error);
  } finally {
    e.target.value = '';
  }
}

export async function uploadImage(e, token) {
  const imageFile = e.target.files[0];
  const form = new FormData();
  form.append('files', imageFile);
  if (!imageFile) return;

  const jsonData = await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload?populate=*`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`
    },
    body: form,
  });

  return jsonData ? jsonData[0] : null;
}

export function getVerificationBadge (verificationStatus) {
  if (!verificationStatus) {
    return null;
  };

  const {hasBronzeBadge, hasSilverBadge, hasGoldBadge} = verificationStatus;

  if (hasGoldBadge) {
    return (<GoldenBadge/>);
  } else if (hasSilverBadge) {
    return (<SilverBadge />);
  } else if (hasBronzeBadge) return (<BronzeBadge />);
};

export function getVerificationBadgeText (verificationStatus) {
  if (!verificationStatus) {
    return '';
  };

  const {hasBronzeBadge, hasSilverBadge, hasGoldBadge} = verificationStatus;

  if (hasGoldBadge) {
    return 'SNEAKY photoshoot verified';
  } else if (hasSilverBadge) {
    return 'Video verified';
  } else if (hasBronzeBadge) return 'Photos verified';
};

export const getVerificationStatus = (verificationStatus) => {
  if (!verificationStatus) {
    return { verifiedLevel: null, badgeIcon: <BronzeBadge /> };
  };

  const { hasGoldBadge, hasSilverBadge, hasBronzeBadge } = verificationStatus;

  if (hasGoldBadge) return { verifiedLevel: 'golden', badgeIcon: null };
  if (hasSilverBadge) return { verifiedLevel: 'silver', badgeIcon: <GoldenBadge /> };
  if (hasBronzeBadge) return { verifiedLevel: 'bronze', badgeIcon: <SilverBadge /> };
  return { verifiedLevel: null, badgeIcon: <BronzeBadge /> };
};


export const upgradeVerificationStatus = (verificationStatus) => {
  // Destructure the current badge status
  const { hasBronzeBadge, hasSilverBadge, hasGoldBadge } = verificationStatus;

  // Create a copy of the current status
  const updatedStatus = { ...verificationStatus };

  // Detect the current highest badge and update the next level
  if (!hasBronzeBadge) {
    updatedStatus.hasBronzeBadge = true;
  } else if (!hasSilverBadge) {
    updatedStatus.hasSilverBadge = true;
  } else if (!hasGoldBadge) {
    updatedStatus.hasGoldBadge = true;
  } else {
    console.log("User already has the highest verification level (Gold).");
  }

  return updatedStatus;
};

export const generatePagination = (currentPage, totalPages) => {
  const pages = [];
  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

export const checkIsAdminApprovalField = (field) => {
  if (!field) return false;

  return ADMIN_APPROVAL_FIELDS.includes(field);
};

export const checkIsRequiredField = (field) => {
  if (!field) return false;

  return USER_REQUIRED_FIELDS.includes(field);
};

export const getUserPendingFieldsNames = (pendingDataJSON) => {
  const pendingData = typeof pendingDataJSON === 'string' ? JSON.parse(pendingDataJSON) : pendingDataJSON === null ? {} : pendingDataJSON;
  const fieldsNames = Object.keys(pendingData).map(fieldName => formatFieldName(fieldName)).join(', ');
  return fieldsNames;
};

export const transformUserWithPendingOverrides = (user, pendingDataJSON) => {
  let pendingData = {};
  if (typeof pendingDataJSON === 'string') {
    pendingData = JSON.parse(pendingDataJSON);
  } else if (pendingDataJSON !== null) {
    pendingData = pendingDataJSON;
  };
  const transformedUser = {
      ...user,
      ...pendingData,
  }
  return transformedUser;
};

export const fetchUserRatesAndServices = async (customerToken, username, userId) => {
  if (!customerToken && !username && !userId) return null;
  try {
    let data;
    if (username) {
      const ratesDataArray = await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[username][$eq]=${username}&populate[services][populate][0]=general&populate[services][populate][1]=Experienced&populate[services][populate][2]=Specialized&populate[incall][populate][0]=general&populate[incall][populate][1]=Experienced&populate[incall][populate][2]=Specialized&populate[outcall][populate][0]=general&populate[outcall][populate][1]=Experienced&populate[outcall][populate][2]=Specialized`, {
        method: 'GET',
      });
      data = ratesDataArray[0];
    } else if (userId) {
      const ratesDataArray = await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[id][$eq]=${userId}&populate[services][populate][0]=general&populate[services][populate][1]=Experienced&populate[services][populate][2]=Specialized&populate[incall][populate][0]=general&populate[incall][populate][1]=Experienced&populate[incall][populate][2]=Specialized&populate[outcall][populate][0]=general&populate[outcall][populate][1]=Experienced&populate[outcall][populate][2]=Specialized`, {
        method: 'GET',
      });
      data = ratesDataArray[0];
    } else if (customerToken) {
      data = await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate[services][populate][0]=general&populate[services][populate][1]=Experienced&populate[services][populate][2]=Specialized&populate[incall][populate][0]=general&populate[incall][populate][1]=Experienced&populate[incall][populate][2]=Specialized&populate[outcall][populate][0]=general&populate[outcall][populate][1]=Experienced&populate[outcall][populate][2]=Specialized`, {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${customerToken}`
        }
      });
    }

    const services = await data?.services || {
      Specialized: [],
      Experienced: [],
      general: [],
    };

    const incall = await data?.incall || {
      Specialized: [],
      Experienced: [],
      general: [],
    };

    const outcall = await data?.outcall || {
      Specialized: [],
      Experienced: [],
      general: [],
    };

    return { services, incall, outcall };
  } catch (error) {
    return {
      services: {
        Specialized: [],
        Experienced: [],
        general: [],
      }, incall: {
        Specialized: [],
        Experienced: [],
        general: [],
      }, outcall: {
        Specialized: [],
        Experienced: [],
        general: [],
      }
    };
  }
};

export const fetchUserUpdatedData = async (customerToken, userData, username) => {
  try {
    if (!customerToken && !username) return null;
    let data;
    if (username) {
      const dataArray = await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[username][$eq]=${username}&populate=*`, {
        method: 'GET',
      });
      data = dataArray[0];
    } else if (customerToken) {
      data = await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=*`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${customerToken}`,
        },
      });
      console.log('data', data);
      
    };
    // Handle error case
    if (data.error) {
      return null;
    };

    const { id, blocked, createdAt, updatedAt, confirmed, role, ...user } = data;
    const isProviderRole = role.type === SERVICE_PROVIDER.type;
    const isManagerRole = role.type === MANAGER.type;
    const isClientRole = role.type === CLIENT.type;
    let userRatesAndServicesData = {};
    let transformedUser = {}
    if (!isClientRole) {
      userRatesAndServicesData = await fetchUserRatesAndServices(customerToken, username);
    };
    // Added ratesAndServices, as they are 2 level deep info and can't be populate with '*', also i can't populate it from backend
    const userInfo = { ...user, ...userRatesAndServicesData  };
    if (!isClientRole) {
      transformedUser = transformUserWithPendingOverrides(userInfo, userInfo.pendingData);
    };
    // returned 2 different data based on user role
    if (isManagerRole) {
      console.log(USER_FORM_NEW_MEMBER(userInfo.email, `${id}`));
      
      return {
        ...userData,
        originalUser: userInfo,
        manager: userInfo,
        managerId: id,
        managerEmail: userInfo.email,
        role: role?.type.toLowerCase(),
        managerNewProvider: USER_FORM_NEW_MEMBER(userInfo.email, `${id}`),
        user: USER_FORM_NEW_MEMBER(userInfo.email, `${id}`),
        userWithPendingOverrides: USER_FORM_NEW_MEMBER(userInfo.email, `${id}`),
        userVerificationStatus: getVerificationStatus(null),
        customSelectedProvider: {},
        customSelectedProviderId: null,
      };
    } else if (isProviderRole) {
      return {
        ...userData,
        originalUser: userInfo,
        user: userInfo,
        userId: id,
        role: role?.type.toLowerCase(),
        ...(isProviderRole && {
          userVerificationStatus: getVerificationStatus(userInfo?.verificationStatus),
          userWithPendingOverrides: transformedUser,
        }),
      };
    } else {
      const {username, email, profilePicture, name, lastName, gender, favoriteProvidersIds, ...rest} = userInfo;
      return {
        ...userData,
        user: {
          username: username,
          profilePicture: profilePicture,
          email: email,
          name: name,
          lastName: lastName,
          gender: gender,
          favoriteProvidersIds: favoriteProvidersIds,
        },
        userId: id,
        role: role?.type.toLowerCase(),
      };
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    return null;
  };
};

export const fetchUserData = async (customerToken, userData, username) => {
  const userUpdatedData = await fetchUserUpdatedData(customerToken, userData, username);
  return userUpdatedData;
};

export const checkHasProfileInfoErroros = (errors) => {
  if (!errors) return false;
  const EditProfileFieldsArray = USER_FIELDS_IN_PROFILE_EDIT_FORM;
  return EditProfileFieldsArray.some((field) => errors[field]);
};

// Function to build the GraphQL query dynamically
export const buildDynamicQuery = (minRate, maxRate) => {
  const isMinRateOrMaxRatesExisting = !(minRate === '' && maxRate === '') && !!(minRate || maxRate);
  let queryParameters = `
    $city: [String]
    $name: String
    $lastName: String
    $suburbs: [String]
    $gender: [String]
    $services: [String]
    $hairColor: [String]
    $age: [String]
    $eyeColor: [String]
    $placeOfService: [String]
  `;

  if (isMinRateOrMaxRatesExisting) {
    queryParameters += `
      $minRate: Int
      $maxRate: Int
    `;
  };

  let ratesCondition;
  if (isMinRateOrMaxRatesExisting) {
    ratesCondition = `
      { 
        or: [
          { incall: { general: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
          { incall: { Specialized: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
          { incall: { Experienced: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
          { outcall: { general: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
          { outcall: { Specialized: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
          { outcall: { Experienced: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } }
        ]
      }`;
  };

  let query = `
    query GetProviders(${queryParameters}) {
      usersPermissionsUsers(
        filters: {
        and: [
          { isApprovedByAdmin: { eq: true } },
          { role: { type: { eq: "provider" } } },
          {
            or: [
              { city: { in: $city } }
            ]
          },
          ${ratesCondition ? ratesCondition : null},
          {
            or: [
              { name: { containsi: $name } },
              { lastName: { containsi: $lastName } }
            ]
          },
          {
            or: [
              { suburbs: { name: { in: $suburbs } } }
            ]
          },
          {
            or: [
              { gender: { in: $gender } }
            ]
          },
          {
            or: [
              { hairColor: { in: $hairColor } }
            ]
          },
          {
            or: [
              { age: { in: $age } }
            ]
          },
          {
            or: [
              { eyeColor: { in: $eyeColor } }
            ]
          },
          {
            or: [
              { placeOfService: { in: $placeOfService } }
            ]
          },
          {
            or: [
              { services: { general: { item: { in: $services } } } },
              { services: { Specialized: { item: { in: $services } } } },
              { services: { Experienced: { item: { in: $services } } } }
            ]
          },
        ]
      }
        pagination: { pageSize: 100 }
      ) {
        data {
          id
          attributes {
            username
            name
            lastName
            isApprovedByAdmin
            verificationStatus {
              hasBronzeBadge
              hasGoldBadge
              hasSilverBadge
            }
            availableNow
            digitalService
            suburbs {
              name
            }
            gender
            services {
              general {
                item
              }
              Specialized {
                item
              }
              Experienced {
                item
              }
            }
            hairColor
            age
            eyeColor
            placeOfService
            isApprovedByAdmin
            availableNow
            digitalService
            verificationStatus {
              hasBronzeBadge
              hasSilverBadge
              hasGoldBadge
            }
            role {
              data {
                attributes {
                  type
                }
              }
            }
            incall {
              general {
                id
                duration
                price
                additionalInfo
              }
              Specialized {
                id
                duration
                price
                additionalInfo
              }
              Experienced {
                id
                duration
                price
                additionalInfo
              }
            }
            outcall {
              general {
                id
                duration
                price
                additionalInfo
              }
              Specialized {
                id
                duration
                price
                additionalInfo
              }
              Experienced {
                id
                duration
                price
                additionalInfo
              }
            }
            profilePicture {
              data {
                attributes {
                  name
                  alternativeText
                  width
                  height
                  url
                }
              }
            }
          }
        }
      }
    }
  `;
  return query;
};

export const buildDynamicVariables = (options) =>  {
  let minRate, maxRate;
  return Object.fromEntries( 
    Object.entries(options)
      .filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        } else if (typeof value === "object" && value !== null) {
          return Object.keys(value).length > 0;
        }
        return value !== undefined && value !== null && value !== "";
      })
      .flatMap(([key, value]) => {
        if (key === "hourlyRate" && typeof value === "object") {
          minRate = value.from ? Number(value.from) : 0;
          maxRate = value.to ? Number(value.to) : 10000000;
      
          const isMinRateOrMaxRatesExisting = !(value.from === '' && value.to === '') && !!(value.from || value.to);
          if (!isMinRateOrMaxRatesExisting) {
            minRate = undefined;
            maxRate = undefined;
          };
          return isMinRateOrMaxRatesExisting ? [["minRate", minRate], ["maxRate", maxRate]] : [];
        }
        return [[key, value]];
      })
  );
};
