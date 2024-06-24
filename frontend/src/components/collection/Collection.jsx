import ProviderType from "../poviderType/ProviderType";
import ProviderCard from "../providerCard/ProviderCard";
import styles from './collection.module.css';
import cardStyles from 'swiper/css/effect-cards';

export default function Collection({ data }) {
  const { title, type, card, activateBlackMode } = data;

  return (
    <section className={styles.mainWrap}>
      { (type.length > 0 || card.length > 0) &&
        <div className="page-width">
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
