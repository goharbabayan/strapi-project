import styles from './favoriteEscorts.module.css';
import Card from '../card/Card';
import Text from '../text/Text';

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
            {providers.map((data, index) => {
                return (
                  <Card
                    data={data}
                    key={index}
                    width={'267'}
                    height={'332'}
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
