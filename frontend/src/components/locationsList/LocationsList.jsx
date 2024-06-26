import { useQuery } from '@apollo/client';
import { GET_BY_LOCATION_QUERIES } from '@/app/graphql/findByLocationQueries';
import LocationCard from '../../components/locationCard/LocationCard';
import styles from './locationsList.module.css';

const LocationsList = () => {
  const { loading, error, data } = useQuery(GET_BY_LOCATION_QUERIES);
  if (data === undefined || data === null) return;

  const { heading, card } = data?.homePage?.data?.attributes?.ByLocations;
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
