export const USER_PROFILE_DATA = (userData) => {
  return [
    {
      label: 'Location',
      data: userData?.city,
    },
    {
      label: 'Age',
      data: userData?.age,
    },
    {
      label: 'Eyes',
      data: userData?.eyeColor,
    },
    {
      label: 'Hair',
      data: userData?.hairColor,
    },
    {
      label: 'Bust size',
      data: userData?.bust,
    },
    {
      label: 'Place of service',
      data: userData?.placeOfService
    },
    {
      label: 'Height',
      data: userData?.height
    },
    {
      label: 'Dress size',
      data: userData?.dressSize
    },
    {
      label: 'Body type',
      data: userData?.bodyType
    },
    {
      label: 'Gender',
      data: userData?.gender
    },
  ]
};
