
'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_FAQ_PAGE_QUERIES } from '../graphql/faqPageQueries';
import styles from './faq.module.css';
import Loading from '../loading';
import TextInfo from '@/components/textInfo/TextInfo';
import AccordionSection from '@/components/accordion/Accordion';
import Banner from '@/components/banner/Banner';

export default function FaqPage() {
  const { loading, error, data} = useQuery(GET_FAQ_PAGE_QUERIES);
  const [bannerData, setBannerData] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [questionsData, setQuestionsData] = useState(null);

  useEffect(() => {
    data != undefined && setBannerData({
      desktopImage: data?.faq?.data?.attributes?.image_for_desktop?.data?.attributes,
      mobileImage: data?.faq?.data?.attributes?.image_for_mobile?.data?.attributes,
    });
    data != undefined && setInfoData(data?.faq?.data?.attributes?.Info);
    data != undefined && setQuestionsData(data?.faq?.data?.attributes?.QuestionsAndAnswers);
  },[data]);

  const isAtLeastOneAccordionItemExists = questionsData && Array.isArray(questionsData) && questionsData.some(accordion => accordion.title !== null && accordion.text !== null);
  const infoSectionIsNotEmpty = infoData && (infoData.text !== null || infoData.title !== null);
  const contentIsNotEmpty = infoSectionIsNotEmpty || isAtLeastOneAccordionItemExists;

  return (
    <>
      {loading &&
        <section className={`${styles.loading} page-width`}>
          <Loading />
        </section>
      }
      {bannerData &&
        <Banner
          desktopImage={bannerData?.desktopImage}
          mobileImage={bannerData?.mobileImage}
          showOverlay={true}
        />
      }
      {contentIsNotEmpty &&
        <section className={styles.mainWrap}>
          <div className="page-width">
            <div className={`${styles.container}`}>
              {infoSectionIsNotEmpty &&
                <TextInfo
                  title={infoData?.title || ''}
                  text={infoData?.text || ''}
                  accordionSectionIsNotEmpty={isAtLeastOneAccordionItemExists}
                />
              }
              {isAtLeastOneAccordionItemExists &&
                <AccordionSection
                  data={questionsData}
                  infoSectionIsNotEmpty={infoSectionIsNotEmpty}
                />
              }
            </div>
          </div>
        </section>
      }
    </>
  )
}
