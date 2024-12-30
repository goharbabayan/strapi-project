import {
  AGE_OPTIONS,
  GENDER_OPTIONS,
  EYE_COLOR_OPTIONS,
  HAIR_COLOR_OPTIONS,
  BODY_TYPE_OPTIONS,
  BUST_OPTIONS,
  PLACE_OF_SERVICE_OPTIONS
} from "./userPhisicalDetails";

import { CITIES_OPTIONS } from "./cities";
import { SUBURBS } from "./suburbs";
import { SERVICES_OPTIONS } from "./userServices";
import { EXTRAS } from "./userPossibleOutfits";

export const CATEGORIES_LIST = [
  'city', 'suburbs', 'gender', 'services', 'hairColor', 'age', 'eyeColor', 'bodyType', 'bust', 'placeOfService', 'hourlyRate', 'extras'
];

export const DEFAULT_CATEGORIES_OPTIONS = {
  city: [],
  suburbs: [],
  gender: [],
  services: [],
  hairColor: [],
  age: [],
  eyeColor: [],
  bodyType: [],
  bust: [],
  placeOfService: [],
  hourlyRate: [],
  extras: [],
};

export const CATEGORY_FIELDS = [
  {
    category: 'City',
    name: 'city',
    get allOptions() {
      return CITIES_OPTIONS;
    },
  },
  {
    category: 'Suburbs',
    name: 'suburbs',
    get allOptions() {
      return [];
    },
  },
  {
    category: 'Gender',
    name: 'gender',
    get allOptions() {
      return GENDER_OPTIONS;
    },
  },
  {
    category: 'Services',
    name: 'services',
    get allOptions() {
      return SERVICES_OPTIONS;
    },
  },
  {
    category: 'Hair color',
    name: 'hairColor',
    get allOptions() {
      return HAIR_COLOR_OPTIONS;
    },
  },
  {
    category: 'Age',
    name: 'age',
    get allOptions() {
      return AGE_OPTIONS;
    },
  },
  {
    category: 'Eye color',
    name: 'eyeColor',
    get allOptions() {
      return EYE_COLOR_OPTIONS;
    },
  },
  {
    category: 'Body type',
    name: 'bodyType',
    get allOptions() {
      return BODY_TYPE_OPTIONS;
    },
  },
  {
    category: 'Bust',
    name: 'bust',
    get allOptions() {
      return BUST_OPTIONS;
    },
  },
  {
    category: 'Place of service',
    name: 'placeOfService',
    get allOptions() {
      return PLACE_OF_SERVICE_OPTIONS;
    },
  },
  {
    category: 'Hourly rate',
    name: 'hourlyRate',
    get allOptions() {
      return [];
    },
  },
  {
    category: 'Extras',
    name: 'extras',
    get allOptions() {
      return EXTRAS;
    },
  },
];
