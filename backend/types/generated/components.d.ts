import type { Schema, Attribute } from '@strapi/strapi';

export interface BlockLocationCard extends Schema.Component {
  collectionName: 'components_block_location_cards';
  info: {
    displayName: 'LocationCard';
    description: '';
  };
  attributes: {
    image: Attribute.Media & Attribute.Required;
    badge: Attribute.Text;
    url: Attribute.String & Attribute.Required;
  };
}

export interface BlockProviderType extends Schema.Component {
  collectionName: 'components_block_provider_types';
  info: {
    displayName: 'EscortType';
    description: '';
  };
  attributes: {
    text: Attribute.String & Attribute.Required & Attribute.DefaultTo<'Type'>;
    link: Attribute.String & Attribute.Required;
  };
}

export interface BlockServiceProviderCard extends Schema.Component {
  collectionName: 'components_block_service_provider_cards';
  info: {
    displayName: 'EscortCard';
    description: '';
  };
  attributes: {
    badge: Attribute.String;
    image: Attribute.Media & Attribute.Required;
    name: Attribute.String;
    location: Attribute.String;
    cost: Attribute.String;
  };
}

export interface ElementsButtonLink extends Schema.Component {
  collectionName: 'components_elements_button_links';
  info: {
    displayName: 'Button link';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    type: Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
    link: Attribute.String;
  };
}

export interface ElementsHeading extends Schema.Component {
  collectionName: 'components_elements_headings';
  info: {
    displayName: 'Heading';
  };
  attributes: {
    Heading: Attribute.String & Attribute.Required;
  };
}

export interface ElementsLink extends Schema.Component {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    redirection_url: Attribute.String & Attribute.Required;
  };
}

export interface SectionBanner extends Schema.Component {
  collectionName: 'components_section_banners';
  info: {
    displayName: 'Banner';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    image: Attribute.Media;
  };
}

export interface SectionFindByLocation extends Schema.Component {
  collectionName: 'components_section_find_by_locations';
  info: {
    displayName: 'FindByLocation';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    card: Attribute.Component<'block.location-card', true> & Attribute.Required;
    activateBlackMode: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface SectionFindByType extends Schema.Component {
  collectionName: 'components_section_find_by_types';
  info: {
    displayName: 'FindByType';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.DefaultTo<'Section title'>;
    type: Attribute.Component<'block.provider-type', true>;
    card: Attribute.Component<'block.service-provider-card', true>;
    activateBlackMode: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface SectionFooter extends Schema.Component {
  collectionName: 'components_elements_footers';
  info: {
    displayName: 'Footer';
    description: '';
  };
  attributes: {
    info: Attribute.Text;
    menu_items: Attribute.Relation<
      'section.footer',
      'oneToMany',
      'api::menu-item.menu-item'
    >;
    text: Attribute.String;
    link: Attribute.Component<'elements.link'>;
  };
}

export interface SectionHeader extends Schema.Component {
  collectionName: 'components_section_headers';
  info: {
    displayName: 'Header';
    description: '';
  };
  attributes: {
    logo: Attribute.Media & Attribute.Required;
    menuItem1: Attribute.String;
    menuItem2: Attribute.String;
    Button: Attribute.Component<'elements.button-link', true>;
  };
}

export interface SectionList extends Schema.Component {
  collectionName: 'components_section_lists';
  info: {
    displayName: 'list';
  };
  attributes: {
    Heading: Attribute.Component<'elements.heading'>;
  };
}

export interface SectionSlider extends Schema.Component {
  collectionName: 'components_section_sliders';
  info: {
    displayName: 'Section';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.DefaultTo<'Section title'>;
    card: Attribute.Component<'block.service-provider-card', true> &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    activateBlackMode: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'block.location-card': BlockLocationCard;
      'block.provider-type': BlockProviderType;
      'block.service-provider-card': BlockServiceProviderCard;
      'elements.button-link': ElementsButtonLink;
      'elements.heading': ElementsHeading;
      'elements.link': ElementsLink;
      'section.banner': SectionBanner;
      'section.find-by-location': SectionFindByLocation;
      'section.find-by-type': SectionFindByType;
      'section.footer': SectionFooter;
      'section.header': SectionHeader;
      'section.list': SectionList;
      'section.slider': SectionSlider;
    }
  }
}
