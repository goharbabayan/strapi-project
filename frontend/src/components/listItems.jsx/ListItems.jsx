import Button from '../button/Button';
import styles from './listItems.module.css';
import Text from '../text/Text';
import ArrowDown from '../icons/arrowDown/ArrowDown';
import { useEffect, useState } from 'react';

export default function ListItems({
  title,
  items,
  isMobile,
  isOneOfTheMobileMenuItemsOpened,
  setIsOneOfTheMobileMenuItemsOpened,
  setListItemsAreOpened}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOneOfTheMobileMenuItemsOpened) {
      setIsOpen(false);
      setListItemsAreOpened(false);
    }
  }, [isOneOfTheMobileMenuItemsOpened]);

  useEffect(() => {
    isOpen ? setIsOneOfTheMobileMenuItemsOpened(false) : null;
  }, [isOpen]);

  const handleCategoryItemClick = () => {
    setListItemsAreOpened(!isOpen);
    setIsOpen(!isOpen);
  }

  return (
    <>
      {items && Array.isArray(items) && items.length > 0 &&
        <section className={styles.container} >
          <div className={`page-width`}>
            {isMobile && title &&
              <div className={styles.category} onClick={handleCategoryItemClick}>
                <Text
                  tag={'h4'}
                  children={title}
                  className={styles.title}
                />
                <ArrowDown isOpen={isOpen}/>
              </div>

            }
            <div className={`${styles.wrapper} ${isOpen ? styles.show : ''}`}>
              {items.map(item => {
                const {id, link, name} = item
                return name ?
                  <Button
                    key={id}
                    href={link || ''}
                    className={`${styles.link} unstyled-anchor`}
                  >
                    {name}
                  </Button>
                :
                  null;
                }
              )}
            </div>
          </div>
        </section>
      }
    </>
  )
}
