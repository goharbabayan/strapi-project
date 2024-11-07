'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BANNER_QUERIES } from '@/app/graphql/bannerQueries';
import Banner from '@/components/banner/Banner';
import FindByLocation from '@/components/findByLocation/FindByLocation';
import Providers from '@/components/providers/Providers';
import {
  providersSectionOneTitle,
  providersSectionTwoTitle,
  providersSectionThreeTitle
} from './utils/constants/homePageSectionTitles';
import Loading from './loading';
import { GET_POPULAR_PROVIDERS_QUERIES, GET_PROVIDERS_BY_TYPE_QUERIES, GET_TOP_PROVIDERS_QUERIES } from './graphql/providersSectionQueries';
import Text from '@/components/text/Text';

export default function HomePage() {
  const [bannerLink, setBannerLink] = useState(null);
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [text, setText] = useState(null);
  const [button, setButton] = useState(null);
  const [topProvidersSectionData, setTopProvidersSectionData] = useState([]);
  const [popularProvidersSectionData, setPopularProvidersSectionData] = useState([]);
  const [byTypeProvidersSectionData, setByTypeProvidersSectionData] = useState([]);

  const { loading, error, data } = useQuery(GET_BANNER_QUERIES);
  useEffect(() => {
    if (data !== undefined) {
      setDesktopImage(data?.home?.data?.attributes?.Banner?.image_for_desktop?.data?.attributes);
      setMobileImage(data?.home?.data?.attributes?.Banner?.image_for_mobile?.data?.attributes);
      setBannerLink(data?.home?.data?.attributes?.Banner?.link);
      setText(data?.home?.data?.attributes?.Banner?.heading);
      setButton(data?.home?.data?.attributes?.Banner?.Button);
    };
  }, [data]);

  const topProvidersSectionRequest = useQuery(GET_TOP_PROVIDERS_QUERIES);
  const topProvidersSectionResponse = topProvidersSectionRequest?.data?.home?.data?.attributes;

  const popularProvidersSectionRequest = useQuery(GET_POPULAR_PROVIDERS_QUERIES);
  const popularProvidersSectionResponse = popularProvidersSectionRequest?.data?.home?.data?.attributes;

  const byTypeProvidersSectionRequest = useQuery(GET_PROVIDERS_BY_TYPE_QUERIES);
  const byTypeProvidersSectionResponse = byTypeProvidersSectionRequest?.data?.home?.data?.attributes;

  useEffect(() => {
    setTopProvidersSectionData(topProvidersSectionResponse);
  }, [topProvidersSectionResponse]);

  useEffect(() => {
    setPopularProvidersSectionData(popularProvidersSectionResponse);
  }, [popularProvidersSectionResponse]);

  useEffect(() => {
    setByTypeProvidersSectionData(byTypeProvidersSectionResponse);
  }, [byTypeProvidersSectionResponse]);

  if (error) return (
    <Text
      tag={'h3'}
      className={`page-width`}
      children={`${error}`}
    />
  )

  const showProvidersList = topProvidersSectionData && Array.isArray(topProvidersSectionData?.[providersSectionOneTitle]?.providers?.data) && topProvidersSectionData?.[providersSectionOneTitle]?.providers?.data.length;
  const showPopulatProvidersList = popularProvidersSectionData && Array.isArray(popularProvidersSectionData?.[providersSectionTwoTitle]?.providers?.data) && popularProvidersSectionData?.[providersSectionTwoTitle]?.providers?.data.length;
  const showTypeProvidersList = byTypeProvidersSectionData && Array.isArray(byTypeProvidersSectionData?.[providersSectionThreeTitle]?.providers?.data) && byTypeProvidersSectionData?.[providersSectionThreeTitle]?.providers?.data.length;

  return (
    <>
      {loading
        ?
          <Loading />
        :
        <>
          <Banner
            bannerLink={bannerLink}
            desktopImage={desktopImage}
            mobileImage={mobileImage}
            text={text}
            button={button}
          />
          {!!showProvidersList &&
            <Providers
              sectionName={providersSectionOneTitle}
              showLoading={true}
              showBadge={true}
              providerCardCountPerRow={3}
              resData={topProvidersSectionData}
            />
          }
          {!!showPopulatProvidersList &&
            <Providers
              sectionName={providersSectionTwoTitle}
              showSlider={true}
              resData={popularProvidersSectionData}
            />
          }
          {!!showTypeProvidersList &&
            <Providers
              sectionName={providersSectionThreeTitle}
              showCategories={true}
              providerCardCountPerRow={4}
              resData={byTypeProvidersSectionData}
            />
          }
          <FindByLocation />
        </>
      }
    </>
  )
}
