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
    type: 'GFE, PSE',
    id: 'gfePse',
    name: 'services',
    value: 'gfePse',
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
      componentTitle: 'GFE, PSE Services',
      type: 'services',
      subType1: 'GFE',
      subType2: 'PSE',
      id: 'gfepse',
      data1: services['GFE'] || [],
      data2: services['PSE'] || [],
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
      subType1: 'GFE',
      subType2: 'PSE',
      id: 'outcall-gfepse',
      data1: outcall['GFE'] || [],
      data2: outcall['PSE'] || [],
      optionsList: RATES_OPTIONS,
    },
    {
      componentTitle: 'Incall Rates',
      type: 'incall',
      subType1: 'GFE',
      subType2: 'PSE',
      id: 'incall-gfepse',
      data1: incall['GFE'] || [],
      data2: incall['PSE'] || [],
      optionsList: RATES_OPTIONS,
    },
  ];
};
