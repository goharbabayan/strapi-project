import ProviderType from '../poviderType/ProviderType';
import ProviderCard from '../providerCard/ProviderCard';
import styles from './collection.module.css';

export default function Collection({ data }) {
  if (data === undefined || data === null) return;

  const { title, type, card, activateBlackMode } = data;
  const isAtLeastOneTypeOrCardExisting = type.length > 0 || card.length > 0;
  return (
    <section className={styles.mainWrap}>
      { isAtLeastOneTypeOrCardExisting &&
        <div className='page-width'>
          { title && <h2 className={styles.title}>{ title }</h2> }
          { type.length > 0 && <ProviderType type={ type } /> }
          { card.length > 0 &&
            <div className={`${styles.wrapper} collections-wrap`}>
              { card.map((data, index) => {
                  return (
                    <ProviderCard
                      provider={data}
                      key={index}
                      blackScheme={activateBlackMode}
                    />
                  )
              })}
            </div>
          }
        </div>
      }
    </section>
  )
}
