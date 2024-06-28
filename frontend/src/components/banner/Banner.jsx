'use client'
import { useQuery } from '@apollo/client';
import { GET_BANNER_QUERIES } from '@/app/graphql/bannerQueries';
import styles from './banner.module.css';

const Banner = () => {
  const { loading, error, data } = useQuery(GET_BANNER_QUERIES);

  if (data === undefined || data === null) return;
  const { title, description, image } = data?.homePage?.data?.attributes?.Banner;

  let url, bannerImageURL;
  image ? url = image?.data?.attributes?.url : null;
  bannerImageURL = url ? url : '';

  let imageURL = '';
  let bannerContentIsNotEmpty = false;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  title || description ? bannerContentIsNotEmpty = true : false;
  bannerImageURL ? imageURL = `${baseUrl}${bannerImageURL}` : null;

  return (
    <div className={styles.container}>
      { bannerContentIsNotEmpty &&
        <div className={`${styles.wrapper} page-width`}>
          <div className={`${styles.mainContent}`}>
            {title &&
              <h2 className={`${styles.title}`}>
                { title }
              </h2>
            }
            {description &&
              <h3 className={styles.description}>{description}</h3>
            }
          </div>
          <div className={styles.imageWrap}>
<<<<<<< HEAD
            {bannerImageURL &&
=======
            { bannerImageURL &&
>>>>>>> dac915429db80f37997d5c2505b3d785dfa8bba3
              <img src={imageURL} width="179" height="179" alt="banner-image"/>
            }
          </div>
        </div>
      }
    </div>
  )
};

export default Banner;
