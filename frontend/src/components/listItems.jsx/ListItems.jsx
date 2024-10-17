import Button from '../button/Button';
import styles from './listItems.module.css';

export default function ListItems({items}) {
  return (
    <>
      {items && Array.isArray(items) && items.length > 0 &&
        <section className={styles.container} >
          <div className={`page-width`}>
            <div className={styles.wrapper}>
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
