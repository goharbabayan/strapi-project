'use client'

import {useState, useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { GET_LOCATION_PAGE_QUERIES } from '@/app/graphql/locationPageQueriess';
import { DEFAULT_CATEGORIES_OPTIONS } from '@/app/utils/constants/categories';
import styles from './category.module.css';
import FilterCategories from '@/components/filterCategories/FilterCategories';
import ProviderCard from '@/components/providerCard/ProviderCard';
import Button from '@/components/button/Button';
import Loading from '@/app/loading';
import Text from '@/components/text/Text';
import { buildDynamicQuery, buildDynamicVariables, generateListOfOptionsForExistingResults } from '@/app/utils/helpers';
import Banner from '@/components/banner/Banner';
import { useFetchData } from '@/app/utils/hooks/useFetch';

export default function LocationCategoryPage({params}) {
  const { category } = params;
  const [categoryData, setCategoryData] = useState({
    desktopImage: null,
    mobileImage: null,
  });
  const [providersList, setProvidersList] = useState(null);
  const [providersDefaultList, setProvidersDefaultList] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [categoryFieldOptions, setCategoryFieldOptions] = useState(DEFAULT_CATEGORIES_OPTIONS);
  const [filteredOptions, setFilteredOptions] = useState(DEFAULT_CATEGORIES_OPTIONS);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const handle = `/locations/${category}`;
  const {loading, data, error} = useQuery(GET_LOCATION_PAGE_QUERIES,{
    variables: {
      handle,
    },
  });

  useEffect(() => {
    if (data) {
      setCategoryData({
        desktopImage: data?.locations?.data[0]?.attributes?.image_banner_landscape_for_desktop?.data?.attributes,
        mobileImage: data?.locations?.data[0]?.attributes?.image_banner_portrait_for_mobile?.data?.attributes,
      });
    };
    fetchProvidersData();
  }, [data]);

  useEffect(() => {
    if (providersList) {
      setDisplayedItems(providersList.slice(0, 12));
      setShowLoadMore(providersList.length > 12);
    };
  }, [providersList]);

  const generateOptionsForFilterCategories = (results) => {
    const options = generateListOfOptionsForExistingResults(results);
    setCategoryFieldOptions(options);
  };

  const handleLoadMore = () => {
    const searchResultsToDisplay = providersList.slice(0, displayedItems.length + 12);
    const isSearchResultsToDisplayLessThenSearchResults = displayedItems.length + 12 < providersList.length;
    setDisplayedItems(searchResultsToDisplay);
    setShowLoadMore(isSearchResultsToDisplayLessThenSearchResults);
  };

  const handleClearFilterOptions = () => {
    fetchProvidersData();
    setNoResults(false);
    setFilteredOptions(DEFAULT_CATEGORIES_OPTIONS);
  };


  const fetchProvidersData = async (filteredOptions) => {
    try {
      const results = await fetchUsers(filteredOptions);
      const users = results.map(user => ({
        ...user?.attributes,
        id: Number(user?.id),
      }));
      users && setProvidersList(users);
      if (!providersDefaultList.length && users) {
        setProvidersDefaultList(users);
        generateOptionsForFilterCategories(users);
      };
      if (users.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
    } catch (err) {
      console.log(err);
    };
  };


  const fetchUsers = async (filteredOptions) => {
    const city = category && category && category.replaceAll('-', ' ');
    const {from, to} = filteredOptions?.hourlyRate || {};
    const data = await useFetchData(`${baseUrl}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: buildDynamicQuery(from, to),
        variables: buildDynamicVariables({...filteredOptions, city}),
      }),
    });

    return data?.data?.usersPermissionsUsers?.data;
  };

  const isFilteredAtleastOneCategory = (options) => {
    let isFiltered = false;
    Object.values(options).forEach(option => {
      const isNotEmptyArray = Array.isArray(option) && option.length > 0;
      const isNotEmptyObject = typeof option === 'object' && option !== null;
      if (isNotEmptyArray || isNotEmptyObject) {
        isFiltered = true;
        return;
      }
    });
    return isFiltered;
  };

  const handleApllyFilteredOptions = async () => {
    const checkIsFilteredAtLeastOneCategory = isFilteredAtleastOneCategory(filteredOptions);
    if (!checkIsFilteredAtLeastOneCategory) {
      setProvidersList(providersDefaultList);
      setNoResults(false);
      return;
    };

    fetchProvidersData(filteredOptions);
  };

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <>
      {loading
        ?
          <Loading/>
        :
        <>
          <section className={`${styles.banner} ${!categoryData.desktopImage?.url && providersList ? styles.empty : ''}`}>
            {(categoryData.desktopImage && categoryData.desktopImage?.url) &&
              <Banner
                mobileImage={categoryData?.mobileImage}
                desktopImage={categoryData?.desktopImage}
                isLocationPage={true}
              />
            }
            <FilterCategories
              showCategories={true}
              onApplyFilterButtonClick={handleApllyFilteredOptions}
              onResetFilterButtonClick={handleClearFilterOptions}
              filteredOptions={filteredOptions}
              setFilteredOptions={setFilteredOptions}
              categoryFieldOptions={categoryFieldOptions}
              sectionClassName={styles.locationPageFilter}
              showBreadcrumbs={true}
              path={`Locations / ${categoryName}`}
            />
          </section>
          <div className="page-width">
            {providersList && providersList.length > 0 &&
              <section className={`${styles.results}`}>
                {displayedItems && displayedItems.map((result, index) => {
                    return (
                      <ProviderCard
                        key={index}
                        provider={result}
                        count={4}
                        roleType={result.role?.data?.attributes?.type}
                      />
                    )
                  }
                )}
                {showLoadMore && (
                  <div className={styles.button}>
                    <Button
                      onClick={handleLoadMore}
                      children={'Show more'}
                      variant={'main'}
                    />
                  </div>
                )}
              </section>
            }
            {noResults &&
              <div className={`${styles.noResults} page-width`}>
                <Text
                  className={styles.title}
                  tag={'h4'}
                  children={'No Matching Results'}
                />
                <Text
                  className={styles.description}
                  tag={'span'}
                  children={`There is no matching results for filtered options.`}
                />
                <Button
                  children={'Clear filter'}
                  onClick={handleClearFilterOptions}
                  variant={'general'}
                />
              </div>
            }
          </div>
        </>
      }
    </>
  )
}
