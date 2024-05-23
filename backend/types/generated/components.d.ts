import type { Schema, Attribute } from '@strapi/strapi';

export interface ButtoncategoryButtonTest extends Schema.Component {
  collectionName: 'components_buttoncategory_button_tests';
  info: {
    displayName: 'Button-test';
    icon: 'arrowDown';
  };
  attributes: {
    yes: Attribute.Boolean;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'buttoncategory.button-test': ButtoncategoryButtonTest;
    }
  }
}
