import Text from '../text/Text';
import styles from './recentBlogs.module.css';
import { Article } from '../article/Article';
import { Fragment } from 'react';

export const RecenetBlogs = ({ title, articles }) => {

  return (
    <>
      <Text
        tag={'h4'}
        className={`${styles.heading}`}
        children={title}
      />
      <div className={`${styles.articlesContainer}`}>
        {articles.map((article, index) => {
          const { content, heading, heroImage, publishedAt } = article?.attributes;
          const date = new Date(publishedAt);
          const options = { day: 'numeric', month: 'long', year: 'numeric' };
          const dateFormat = date.toLocaleDateString('en-US', options).replace(',', '');
          const dateParts = dateFormat.split(' ');
          const articleDate = `${dateParts[1]} ${dateParts[0]} ${dateParts[2]}`;

          return (
            <Fragment key={index}>
              <Article
                index={index}
                articleId={article.id}
                content={content}
                heading={heading}
                heroImage={heroImage}
                articleDate={articleDate}
                isRecentArticles={true}
              />
            </Fragment>
          )})
        }
      </div>
    </>
  )
}
