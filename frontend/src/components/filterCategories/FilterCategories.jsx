import styles from './filterCategories.module.css';
import CategoryField from '../categoryField/CategoryField';
import { CITIES_OPTIONS } from '@/app/utils/constants/cities';
import { GENDER_OPTIONS } from '@/app/utils/constants/userPhisicalDetails';
import { SERVICES_OPTIONS } from '@/app/utils/constants/userServices';
import { HAIR_COLOR_OPTIONS } from '@/app/utils/constants/userPhisicalDetails';
import Button from '../button/Button';
import Breadcrumbs from '../breadcrumbs/BreadCrumbs';

// ToDo: move all Filter components in one folder named Filter
export default function FilterCategories({
  categoryFieldOptions,
  showCategories,
  onApplyFilterButtonClick,
  onResetFilterButtonClick,
  filteredOptions,
  setFilteredOptions,
  sectionClassName,
  showBreadcrumbs,
  path,
}) {
  return (
    <section className={`${styles.section} ${showCategories ? styles.show : ''} ${sectionClassName ? sectionClassName : ''}`}>
      <div className={`${styles.categories} page-width`}>
        <div className={styles.breadcrumbsWrapper}>
          {showBreadcrumbs && path &&
            <Breadcrumbs path={path}/>
          }
          <div className={styles.buttons}>
            <Button
              children={'Reset filters'}
              variant={'general'}
              onClick={onResetFilterButtonClick}
            />
            <Button
              children={'Apply filters'}
              variant={'main'}
              onClick={onApplyFilterButtonClick}
            />
          </div>
        </div>
        <div className={styles.categoriesList}>
          <CategoryField
            category='Location'
            name='city'
            options={categoryFieldOptions ? categoryFieldOptions['city'] : CITIES_OPTIONS}
            filteredOptions={filteredOptions}
            setFilteredOptions={setFilteredOptions}
          />
          <CategoryField
            category='Gender'
            name='gender'
            options={categoryFieldOptions ? categoryFieldOptions['gender'] : GENDER_OPTIONS}
            filteredOptions={filteredOptions}
            setFilteredOptions={setFilteredOptions}
          />
          <CategoryField
            category='Services'
            name='services'
            options={categoryFieldOptions ? categoryFieldOptions['services'] : SERVICES_OPTIONS}
            filteredOptions={filteredOptions}
            setFilteredOptions={setFilteredOptions}
          />
          <CategoryField
            category='Hair color'
            name='hairColor'
            options={categoryFieldOptions ? categoryFieldOptions['hairColor'] : HAIR_COLOR_OPTIONS}
            filteredOptions={filteredOptions}
            setFilteredOptions={setFilteredOptions}
          />
        </div>
      </div>
    </section>
  )
};
