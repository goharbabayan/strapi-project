import type { Schema, Attribute } from '@strapi/strapi';

export interface BlockAccordion extends Schema.Component {
  collectionName: 'components_block_accordions';
  info: {
    displayName: 'Accordion';
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.Text;
  };
}

export interface BlockFavoritesIds extends Schema.Component {
  collectionName: 'components_block_favorites_ids';
  info: {
    displayName: 'favoritesIds';
  };
  attributes: {};
}

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

export interface BlockRichText extends Schema.Component {
  collectionName: 'components_block_rich_texts';
  info: {
    displayName: 'RichText';
  };
  attributes: {
    heading: Attribute.String;
    text: Attribute.Blocks;
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

export interface BlockSkill extends Schema.Component {
  collectionName: 'components_block_skills';
  info: {
    displayName: 'Skill';
  };
  attributes: {
    name: Attribute.String;
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

export interface ElementsData extends Schema.Component {
  collectionName: 'components_elements_data';
  info: {
    displayName: 'data';
  };
  attributes: {
    duration: Attribute.String;
    price: Attribute.Integer;
    additionalInfo: Attribute.String;
  };
}

export interface ElementsHeading extends Schema.Component {
  collectionName: 'components_elements_headings';
  info: {
    displayName: 'Heading';
    description: '';
  };
  attributes: {
    Heading: Attribute.String & Attribute.Required;
  };
}

export interface ElementsLink extends Schema.Component {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
    description: '';
  };
  attributes: {
    redirection_url: Attribute.String;
  };
}

export interface ElementsReview extends Schema.Component {
  collectionName: 'components_elements_reviews';
  info: {
    displayName: 'Review';
    description: '';
  };
  attributes: {
    author: Attribute.String;
    text: Attribute.Text;
    date: Attribute.Date;
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface ElementsText extends Schema.Component {
  collectionName: 'components_elements_texts';
  info: {
    displayName: 'Text';
    description: '';
  };
  attributes: {
    item: Attribute.String;
  };
}

export interface ElementsWorkingTime extends Schema.Component {
  collectionName: 'components_elements_working_times';
  info: {
    displayName: 'WorkingTime';
    description: '';
  };
  attributes: {
    workday: Attribute.String;
    start: Attribute.String;
    end: Attribute.String;
  };
}

export interface EntryStateEntry extends Schema.Component {
  collectionName: 'components_entry_state_entries';
  info: {
    displayName: 'StateEntry';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    code: Attribute.String;
  };
}

export interface EntrySuburb extends Schema.Component {
  collectionName: 'components_entry_suburbs';
  info: {
    displayName: 'suburb';
    description: '';
  };
  attributes: {
    name: Attribute.String;
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

export interface SectionImageBanner extends Schema.Component {
  collectionName: 'components_section_image_banners';
  info: {
    displayName: 'imageBanner';
    description: '';
  };
  attributes: {
    image: Attribute.Media;
  };
}

export interface SectionInfo extends Schema.Component {
  collectionName: 'components_section_infos';
  info: {
    displayName: 'TextWithTitle';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.Text;
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
      'block.accordion': BlockAccordion;
      'block.favorites-ids': BlockFavoritesIds;
      'block.location-card': BlockLocationCard;
      'block.provider-type': BlockProviderType;
      'block.rich-text': BlockRichText;
      'block.service-provider-card': BlockServiceProviderCard;
      'block.skill': BlockSkill;
      'elements.button-link': ElementsButtonLink;
      'elements.data': ElementsData;
      'elements.heading': ElementsHeading;
      'elements.link': ElementsLink;
      'elements.review': ElementsReview;
      'elements.text': ElementsText;
      'elements.working-time': ElementsWorkingTime;
      'entry.state-entry': EntryStateEntry;
      'entry.suburb': EntrySuburb;
      'section.banner': SectionBanner;
      'section.find-by-location': SectionFindByLocation;
      'section.find-by-type': SectionFindByType;
      'section.footer': SectionFooter;
      'section.header': SectionHeader;
      'section.image-banner': SectionImageBanner;
      'section.info': SectionInfo;
      'section.list': SectionList;
      'section.slider': SectionSlider;
    }
  }
}
