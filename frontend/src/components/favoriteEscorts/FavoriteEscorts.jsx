import styles from './favoriteEscorts.module.css';
import Text from '../text/Text';
import ProviderCard from '../providerCard/ProviderCard';

const FavoriteEscorts = ({providers, title, onStarIconClick}) => {
  return (
    <div className="page-width">
      <section className={`section ${styles.section}`}>
        {providers.length === 0 &&
          <Text
            tag={'h4'}
            className='subtitle'
            children={`You don't have favorite escorts yet.`}
          />
        }
        {providers.length > 0 && title &&
          <Text
            tag={'h4'}
            className={`${styles.heading}`}
            children={title}
          />
        }
        {providers.length > 0 &&
          <div className={`${styles.wrapper} collections-wrap`}>
            {providers.map(data => {
              return (
                <ProviderCard
                  key={data.id}
                  provider={data}
                  count={4}
                  roleType={data.role.type}
                  showStarIcon={true}
                  onStarIconClick={onStarIconClick}
                />
              )
            })}
          </div>
        }
      </section>
    </div>
  )
};

export default FavoriteEscorts;
