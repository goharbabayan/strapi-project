'use client'

import { Fragment, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import styles from './blog.module.css';
import { GET_ARTICLES_QUERY, GET_BLOG_PAGE_QUERY } from '../graphql/blogPageQueries';
import Loading from '../loading';
import Error from '../error';
import Banner from '@/components/banner/Banner';
import { RecenetBlogs } from '@/components/recenetBlogs/RecentBlogs';
import { Article } from '@/components/article/Article';
import Text from '@/components/text/Text';
import Button from '@/components/button/Button';
import ArrowLeft from '@/components/icons/ArrowLeft';
import ArrowRight from '@/components/icons/ArrowRight';
import { generatePagination } from '../utils/helpers';

const Blog = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const blogQueryData = useQuery(GET_BLOG_PAGE_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const { error, data, loading } = useQuery(GET_ARTICLES_QUERY, {
    variables: {
      page: currentPage,
      pageSize: 10
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.articles.meta.pagination.page === 1) {
      setAllArticles(data?.articles.data.slice(4));
    } else {
      setAllArticles(data?.articles.data);
    }
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < data?.articles.meta.pagination.pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const totalPages = data?.articles.meta.pagination.pageCount;
  const paginationNumbers = generatePagination(currentPage, totalPages);

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <>
      <Banner
        desktopImage={blogQueryData.data.blog.data.attributes.Image_for_desktop?.data?.attributes}
        mobileImage={blogQueryData.data.blog.data.attributes.Image_for_mobile?.data?.attributes}
        text={blogQueryData.data.blog.data.attributes.blog_title}
        showOverlay={true}
        shouldBeCentered={true}
      />
      <section className="page-width">
        {data.articles.meta.pagination.page === 1 &&
          <RecenetBlogs
            title={'Recent blog posts'}
            articles={data.articles.data.slice(0, 4)}
          />
        }
        {data.articles.meta.pagination.page === 1 && data?.articles?.data?.length > 4 &&
          <Text
            tag={'h3'}
            className={`${styles.allOtherArticlesTitle}`}
            children={'All blog posts'}
          />
        }
        <div className={styles.allArticlesWrapper}>
          {allArticles && allArticles.map((article, index) => {
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
                  isRecentArticles={false}
                />
              </Fragment>
            )
          })}
        </div>
        <div className={styles.pagination}>
          <Button
            className={`${styles.pageContollerButtons} ${styles.prev}`}
            onClick={() => handlePrev()}
            disabled={currentPage === 1}
            children={'Previous'}
            Icon={<ArrowLeft />}
          />
          <div className={styles.pagesNumberContainer}>
            {paginationNumbers.map((page, index) =>
              page === '...' ? (
                <span className={`${styles.pageContollerButtons} ${styles.pageContollerButtonsNumber}`} key={index}>...</span>
              ) : (
                <Button
                  key={index}
                  className={`
                    ${styles.pageContollerButtons}
                    ${styles.pageContollerButtonsNumber}
                    ${currentPage === page && styles.activePageContollerButton}
                  `}
                  onClick={() => handlePageChange(page)}
                  children={page}
                />
              )
            )}
          </div>
          <Button
            disabled={currentPage === data?.articles.meta.pagination.pageCount}
            className={`${styles.pageContollerButtons} ${styles.next}`}
            onClick={() => handleNext()}
            children={'Next'}
            Icon={<ArrowRight />}
          />
        </div>
      </section>
    </>
  )
}

export default Blog;
