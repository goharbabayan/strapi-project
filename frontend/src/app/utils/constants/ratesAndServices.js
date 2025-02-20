import { RATES_OPTIONS } from "./ratesOptions";
import { SERVICES_OPTIONS } from "./userServices";

export const SERVICE_TYPES = [
  {
    type: 'General',
    id: 'general',
    name: 'services',
    value: 'general',
  },
  {
    type: 'Specialized, Experienced',
    id: 'specializedPse',
    name: 'services',
    value: 'specializedPse',
  },
];

export const RATES_AND_SERVICES = (services, incall, outcall, onChanges) => {
  return [
    {
      componentTitle: 'General Services',
      type: 'services',
      subType: 'general',
      id: 'general-services',
      data: services['general'] || [],
      optionsList: SERVICES_OPTIONS,
      updateChange: (data) => onChanges('services', {'general': data}),
    },
    {
      componentTitle: 'Specialized, Experienced Services',
      type: 'services',
      subType1: 'Specialized',
      subType2: 'Experienced',
      id: 'specializedexperienced',
      data1: services['Specialized'] || [],
      data2: services['Experienced'] || [],
      optionsList: SERVICES_OPTIONS,
    },
    {
      componentTitle: 'Incall Rates',
      type: 'incall',
      subType: 'general',
      id: 'incall-general',
      data: incall['general'] || [],
      optionsList: RATES_OPTIONS,
      updateChange: (data) => onChanges('incall', {'general': data}),
    },
    {
      componentTitle: 'Outcall Rates',
      type: 'outcall',
      subType: 'general',
      id: 'outcall-general',
      data: outcall['general'] || [],
      optionsList: RATES_OPTIONS,
      updateChange: (data) => onChanges('outcall', {'general': data}),
    },
    {
      componentTitle: 'Outcall Rates',
      type: 'outcall',
      subType1: 'Specialized',
      subType2: 'Experienced',
      id: 'outcall-specializedexperienced',
      data1: outcall['Specialized'] || [],
      data2: outcall['Experienced'] || [],
      optionsList: RATES_OPTIONS,
    },
    {
      componentTitle: 'Incall Rates',
      type: 'incall',
      subType1: 'Specialized',
      subType2: 'Experienced',
      id: 'incall-specializedexperienced',
      data1: incall['Specialized'] || [],
      data2: incall['Experienced'] || [],
      optionsList: RATES_OPTIONS,
    },
  ];
};
