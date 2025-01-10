'use client';

import { Fragment } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import styles from './article.module.css';
import Layout from './layout';
import Banner from '@/components/banner/Banner';
import { GET_ARTICLE_QUERY } from '@/app/graphql/blogPageQueries';
import { useQuery } from '@apollo/client';
import Loading from '@/app/loading';
import Error from '@/app/error';
import { Article as ArticleComponent } from '@/components/article/Article';
import Text from '@/components/text/Text';

const Article = ({ params }) => {  
  const { data, loading, error } = useQuery(GET_ARTICLE_QUERY, {
    variables: {
      id: params?.id
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  const { article: { data: { attributes }} } = data

  return (
    <Layout>
      {data &&
        <Banner
          desktopImage={attributes?.heroImage?.data?.attributes}
          mobileImage={attributes?.heroImage?.data?.attributes}
          text={attributes?.heading}
          shouldBeCentered={true}
        />
      }
      <section className={`${styles.mainWrap} page-width`}>
        <div className={styles.articleWrap}>
          <div className={styles.content}>
            <BlocksRenderer content={attributes?.content} />
          </div>
        </div>
      </section>
      {attributes?.related_articles.data.length &&
        <div className={styles.relatedArticles}>
          <div className='page-width'>
            <Text
              tag={'h3'}
              className={`${styles.relatedArticlesTitle}`}
              children={'Related Articles'}
            />
            <div className={`${styles.relatedArticlesWrapper}`}>
              {attributes?.related_articles.data.map((article, index) => {            
                const { content, heading, heroImage, publishedAt } = article?.attributes;
                const date = new Date(publishedAt);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                const dateFormat = date.toLocaleDateString('en-US', options).replace(',', '');
                const dateParts = dateFormat.split(' ');
                const articleDate = `${dateParts[1]} ${dateParts[0]} ${dateParts[2]}`;

                return (
                  <Fragment key={index}>
                    <ArticleComponent
                      index={index}
                      articleId={article?.id}
                      content={content}
                      heading={heading}
                      heroImage={heroImage}
                      articleDate={articleDate}
                      isRecentArticles={false}
                      whiteMode={true}
                    />
                  </Fragment>
                )
              })
              }
            </div>
          </div>
        </div>
      }
    </Layout>
  )
}

export default Article;
