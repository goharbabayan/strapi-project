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
      label: 'Place of service',
      data: userData?.placeOfService
    },
    {
      label: 'Height',
      data: userData?.height
    },
    {
      label: 'Gender',
      data: userData?.gender
    },
  ]
};
