import Image from 'next/image';
import styles from './banner.module.css';

const Banner = ({ bannerSection }) => {
  const { title, description, image } = bannerSection;

  let bannerTitle, bannerDescription, url, bannerImageURL;
  title ? bannerTitle = title : null;
  description ? bannerDescription = description : null;
  image ? url = image?.data?.attributes?.url : null;
  bannerImageURL = url ? url : '';

  let imageURL = '';
  let bannerContentIsNotEmpty = false;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  bannerTitle || bannerDescription ? bannerContentIsNotEmpty = true : false;
  bannerImageURL ? imageURL = `${baseUrl}${bannerImageURL}` : null;

  return (
    <div className={styles.container}>
      { bannerContentIsNotEmpty &&
        <div className={`${styles.wrapper} page-width`}>
          <div className={`${styles.mainContent}`}>
            { bannerTitle &&
              <h2 className={`${styles.title}`}>
                { bannerTitle }
              </h2>
            }
            { bannerDescription &&
              <h3 className={styles.description}>{bannerDescription}</h3>
            }
          </div>
          <div className={styles.imageWrap}>
            { bannerImageURL &&
              <Image
                src={imageURL}
                width="179"
                height="179"
                alt="banner-image"
              />
            }
          </div>
        </div>
      }
    </div>
  )
};

export default Banner;
