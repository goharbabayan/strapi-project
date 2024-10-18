'use client'

import { useState, useEffect } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import styles from './blog.module.css';
import Button from '@/components/button/Button';
import LoadMoreButton from '@/components/loadMoreButton/LoadMoreButton';

function Blog() {
  const [blog, setBlog] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    try {
      fetch(`${baseUrl}/api/articles?[populate][0]=content&[populate][1]=heroImage&pagination[pageSize]=4&pagination[page]=${currentPage}&sort=createdAt:desc`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(data =>{
          setPagination(data.meta.pagination);
          if(currentPage === 1) {
            setBlog(data.data);
          } else {
            setBlog((prevArticles) => [...prevArticles, ...data.data]);
            setIsLoading(false);
          }
        })
    } catch (err) {
      setError(err);
    }
  }, [currentPage])

  const handleLoadMore = () => {
    setIsLoading(true);
    setCurrentPage(currentPage + 1);
  };

  return (
    <section className={`${styles.mainWrap} page-width`}>
      <div className={styles.articlesWrapper}>
        {blog && blog.map((article, index) => {
          const { content, heading, heroImage, createdAt, meta } = article.attributes;
          const { url, alternativeText, height, width } = heroImage.data.attributes;
          const date = new Date(createdAt);
          const options = { day: 'numeric', month: 'long', year: 'numeric' };
          const dateFormat = date.toLocaleDateString('en-US', options).replace(',', '');
          const dateParts = dateFormat.split(' ');
          const articleDate = `${dateParts[1]} ${dateParts[0]} ${dateParts[2]}`;

          return (
            <article key={article.id} className={styles.article}>
              <div className={styles.articleWrap}>
                {heroImage && url &&
                  <a href={`/articles/${article.id}`} className={styles.imageWrap}>
                    <img alt={alternativeText || `article-image-${index+1}`} height={height} width={width} src={`${baseUrl}${url}`} className={styles.heroImage}/>
                  </a>
                }
                <div className={styles.mainInfo}>
                  {heading &&
                    <a href={`/articles/${article.id}`} className={`${styles.heading} link`}>
                      <h2 className={styles.heading}>{heading}</h2>
                    </a>}
                  {content &&
                    <div className={styles.wrapper}>
                      <div className={styles.content}>
                        <BlocksRenderer content={content} />
                      </div>
                    </div>
                  }
                  <Button href={`/articles/${article.id}`} className={`${styles.button} link`}>Read more »</Button>
                </div>
                  <p className={styles.date}>{articleDate}</p>
              </div>
            </article>
          );
        })}
      </div>
      {currentPage < pagination.pageCount && (
        <LoadMoreButton onClick={handleLoadMore} isLoading={isLoading}>Load More</LoadMoreButton>
      )}
      {error && (
        <span>Something went wrong.</span>
      )}
    </section>
  )
}

export default Blog;
