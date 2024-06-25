import styles from './banner.module.css';

const Banner = ({ bannerSection }) => {
  if (bannerSection === undefined || bannerSection === null) return;

  const { title, description, image } = bannerSection;

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
            { title &&
              <h2 className={`${styles.title}`}>
                { title }
              </h2>
            }
            { description &&
              <h3 className={styles.description}>{description}</h3>
            }
          </div>
          <div className={styles.imageWrap}>
            { bannerImageURL &&
              <img src={imageURL} width="179" height="179" alt="banner-image"/>
            }
          </div>
        </div>
      }
    </div>
  )
};

export default Banner;
