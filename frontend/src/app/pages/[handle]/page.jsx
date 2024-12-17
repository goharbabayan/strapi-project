'use client'

import { useState, useEffect } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import styles from './page.module.css';
import Text from '@/components/text/Text';

export default function StandalonePage({params}) {
  const [content, setContent] = useState({
    heading: null,
    pageContent: [],
  });
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async() => {
    const data = await useFetchData(`${baseUrl}/api/pages?filters[seo_page_url_path][$eq]=${params.handle}&[populate][0]=content`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const pageContent = data?.data && data?.data[0]?.attributes?.content || [];
    const heading = data?.data && data?.data[0]?.attributes?.heading || null;
    setContent({
      heading: heading,
      pageContent: pageContent
    });
  };

  return (
      <section className="page-width">
        <div className={styles.mainWrap}>
          <div className={styles.content}>
            {content?.heading &&
              <Text
                tag={'h2'}
                className={styles.heading}
                children={content?.heading}
              />
            }
            <BlocksRenderer
              content={content?.pageContent}
            />
          </div>
        </div>
      </section>
  )
}
