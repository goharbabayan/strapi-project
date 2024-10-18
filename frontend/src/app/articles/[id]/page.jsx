'use client'

import { useState, useEffect } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import styles from './article.module.css';
import Layout from './layout';

export default function Article({params}) {
  const [heroImage, setHeroImage] = useState({});
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    fetch(`${baseUrl}/api/articles/${params.id}?[populate][0]=content&[populate][1]=heroImage`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data =>{
        const { heading, content, heroImage } = data.data.attributes;
        setHeroImage(heroImage.data.attributes);
        setHeading(heading);
        setContent(content);
      })
  }, [])

  return (
    <Layout>
      <section className={`${styles.mainWrap} page-width`}>
        <div className={styles.articleWrap}>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          {heroImage && heroImage.url &&
            <div className={styles.imageWrapper}>
              <img
                alt={heroImage.alternativeText || 'hero-image'}
                height={heroImage.height} width={heroImage.width}
                src={`${baseUrl}${heroImage.url}`}
                className={styles.heroImage}/>
            </div>
          }
          <div className={styles.content}>
            <BlocksRenderer content={content} />
          </div>
        </div>
      </section>
    </Layout>
  )
}
