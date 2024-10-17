import { useState, forwardRef } from 'react';
import styles from './favoriteEscorts.module.css';
import Card from '../card/Card';
import Text from '../text/Text';

const FavoriteEscorts = forwardRef(({providers, title, onStarIconClick}, ref) => {
  return (
    <section ref={ref} className={`section ${styles.section}`}>
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
  )
});

export default FavoriteEscorts;
