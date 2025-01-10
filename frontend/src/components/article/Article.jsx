import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Banner from '../banner/Banner';
import LinkArticle from '../icons/LinkArticle';
import Text from '../text/Text';
import styles from './article.module.css';

export const Article = ({ index, articleId, content, heading, heroImage, articleDate, isRecentArticles, whiteMode }) => {

  return (
    <div key={index} className={`${styles.articleContainer} ${isRecentArticles ? styles[`articleContainer-${index}`] : styles.articleWrapper}`}>
      {heroImage?.data?.attributes.url &&
        <a href={`/articles/${articleId}`} className={styles.articleImageLink}>
          <Banner
            desktopImage={heroImage?.data?.attributes}
            mobileImage={heroImage?.data?.attributes}
          />
        </a>
      }
      <div className={styles.articleContentWrapper}>
        {articleDate && 
          <Text
            tag={'span'}
            className={`${styles.articleDate} ${whiteMode && styles.whiteText}`}
            children={articleDate}
          />
        }
        <div className={styles.articleDescContainer}>
          <a href={`/articles/${articleId}`} className='link'>
            {heading &&
              <Text
                tag={'h3'}
                className={`${styles.articleHeading} ${whiteMode && styles.whiteText}`}
                children={heading}
              />
            }
            <LinkArticle stroke={whiteMode ? '#ffffff' : '#262626'} className={styles.articleLinkIcon}/>
          </a>
          {content &&
            <div className={`${styles.contentWrapper} ${whiteMode && styles.whiteText}`}>
              <BlocksRenderer content={content.slice(0, 2)} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}
