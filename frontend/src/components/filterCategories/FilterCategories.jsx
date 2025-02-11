import { usePathname } from 'next/navigation';
import styles from './filterCategories.module.css';
import { CATEGORY_FIELDS } from '@/app/utils/constants/categories';
import CategoryField from '../categoryField/CategoryField';
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
  const pathname = usePathname();
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
              onClick={() => onApplyFilterButtonClick(filteredOptions)}
            />
          </div>
        </div>
        <div className={styles.categoriesList}>
          {CATEGORY_FIELDS.map((categoryField, index) => {
            const {category, name, allOptions} = categoryField;
            if (name === 'suburbs' && pathname == '/search') return;
            if (name === 'city' && pathname.includes('/locations')) return;
            return (
              <CategoryField
                key={index}
                category={category}
                name={name}
                options={categoryFieldOptions && categoryFieldOptions[name] ? categoryFieldOptions[name] : allOptions}
                filteredOptions={filteredOptions}
                setFilteredOptions={setFilteredOptions}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
};
