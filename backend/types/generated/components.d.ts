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

export interface BlockCategory extends Schema.Component {
  collectionName: 'components_block_categories';
  info: {
    displayName: 'category';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    link: Attribute.String & Attribute.Required;
  };
}

export interface BlockFavoritesIds extends Schema.Component {
  collectionName: 'components_block_favorites_ids';
  info: {
    displayName: 'favoritesIds';
  };
  attributes: {};
}

export interface BlockLevel2 extends Schema.Component {
  collectionName: 'components_block_level_2s';
  info: {
    displayName: 'level_2';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    link: Attribute.String;
    level_3: Attribute.Component<'block.level-3', true>;
  };
}

export interface BlockLevel3 extends Schema.Component {
  collectionName: 'components_block_level_3s';
  info: {
    displayName: 'level_3';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    link: Attribute.String;
  };
}

export interface BlockLocationCard extends Schema.Component {
  collectionName: 'components_block_location_cards';
  info: {
    displayName: 'Card';
    description: '';
  };
  attributes: {
    image: Attribute.Media & Attribute.Required;
    badge: Attribute.String;
    url: Attribute.String & Attribute.Required;
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
    displayName: 'Button';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    link: Attribute.String;
  };
}

export interface ElementsCollection extends Schema.Component {
  collectionName: 'components_elements_collections';
  info: {
    displayName: 'categories';
    description: '';
  };
  attributes: {
    categories_title: Attribute.String;
    categories: Attribute.Component<'block.category', true>;
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
    displayName: 'ButtonWithLink';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    link: Attribute.String;
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
    heading: Attribute.Text;
    image_for_mobile: Attribute.Media;
    Button: Attribute.Component<'elements.button-link'>;
    image_for_desktop: Attribute.Media;
    link: Attribute.String;
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
  };
}

export interface SectionFindByType extends Schema.Component {
  collectionName: 'components_section_find_by_types';
  info: {
    displayName: 'Find_By_Type';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    providers: Attribute.Relation<
      'section.find-by-type',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    categories: Attribute.Component<'block.category', true>;
    show_categories_in_the_center: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    Button: Attribute.Component<'elements.link'>;
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
    text: Attribute.String;
    link: Attribute.Component<'elements.link'>;
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

export interface SectionTopProviders extends Schema.Component {
  collectionName: 'components_section_top_providers';
  info: {
    displayName: 'Providers';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    providers: Attribute.Relation<
      'section.top-providers',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'block.accordion': BlockAccordion;
      'block.category': BlockCategory;
      'block.favorites-ids': BlockFavoritesIds;
      'block.level-2': BlockLevel2;
      'block.level-3': BlockLevel3;
      'block.location-card': BlockLocationCard;
      'block.rich-text': BlockRichText;
      'block.skill': BlockSkill;
      'elements.button-link': ElementsButtonLink;
      'elements.collection': ElementsCollection;
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
      'section.image-banner': SectionImageBanner;
      'section.info': SectionInfo;
      'section.list': SectionList;
      'section.top-providers': SectionTopProviders;
    }
  }
}
