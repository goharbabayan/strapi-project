import LocationCard from '../../components/locationCard/LocationCard';
import styles from './locationsList.module.css';

const LocationsList = ({ data }) => {
  const { heading, card } = data
  return (
    <div className={`${styles.container} page-width`}>
      { heading  &&
        <h3 className={styles.title}>{heading}</h3>
      }
      <div className={styles.wrapper}>
        { card.map((item, index, url) => {
          return <LocationCard data={item} key={index} url={url}/>
        })}
      </div>
    </div>
  )
};

export default LocationsList;
