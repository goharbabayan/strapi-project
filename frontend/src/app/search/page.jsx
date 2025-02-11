'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SEARCH_PAGE_BANNER_QUERIES } from '../graphql/searchPageBannerQueries';
import styles from './Search.module.css';
import SearchInput from '@/components/searchInput/SearchInput';
import ProviderCard from '@/components/providerCard/ProviderCard';
import Text from '@/components/text/Text';
import Button from '@/components/button/Button';
import Loading from '../loading';
import FilterCategories from '@/components/filterCategories/FilterCategories';
import { DEFAULT_CATEGORIES_OPTIONS } from '../utils/constants/categories';
import Banner from '@/components/banner/Banner';
import FilterIcon from '@/components/icons/Filter';
import { useFetchData } from '../utils/hooks/useFetch';
import { buildDynamicQuery, buildDynamicVariables } from '../utils/helpers';

export default function Search() {
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQueries, setSearchQueries] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(DEFAULT_CATEGORIES_OPTIONS);
  const [noResults, setNoResults] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const {loading, error, data} = useQuery(GET_SEARCH_PAGE_BANNER_QUERIES);

  useEffect(() => {
    data !== undefined && setDesktopImage(data?.search?.data?.attributes?.image_banner_landscape_for_desktop?.data?.attributes);
    data !== undefined && setMobileImage(data?.search?.data?.attributes?.image_banner_portrait_for_mobile?.data?.attributes);
  }, [data]);

  useEffect(() => {
    setDisplayedItems(searchResults.slice(0, 12));
    setShowLoadMore(searchResults.length > 12);
  }, [searchResults]);

  useEffect(() => {
    let options = filteredOptions;
    if (searchQueries.length > 0) {
      options = {...filteredOptions, name: searchQueries, lastName: searchQueries};
    } else {
      let {name, lastName, ...other} = filteredOptions
      options = other;
    };

    setFilteredOptions(options);
    const isSearchQueriesOrFilteredOptionsExist = searchQueries.length > 0 || hasAtLeastOneValue(filteredOptions);
    isSearchQueriesOrFilteredOptionsExist && handleApllyFilteredOptions(options);
  }, [searchQueries]);

  function hasAtLeastOneValue(object) {
    let valueIsNotEmpty = false;
    Object.values(object).forEach(item => {
      if (item?.length > 0) {
        valueIsNotEmpty = true;
        return;
      }
    });
    return valueIsNotEmpty;
  };

  const handleLoadMore = () => {
    const searchResultsToDisplay = searchResults.slice(0, displayedItems.length + 12);
    const isSearchResultsToDisplayLessThenSearchResults = displayedItems.length + 12 < searchResults.length;
    setDisplayedItems(searchResultsToDisplay);
    setShowLoadMore(isSearchResultsToDisplayLessThenSearchResults);
  };

  const handleFilterButtonClick = () => {
    setShowCategories(!showCategories);
  };

  const handleClearFilterOptions = () => {
    setNoResults(false);
    setSearchResults([]);
    setSearchQueries('');
    setFilteredOptions(DEFAULT_CATEGORIES_OPTIONS);
  };

  const fetchUsers = async (filteredOptions) => {
    const {from, to} = filteredOptions?.hourlyRate || {};
    const data = await useFetchData(`${baseUrl}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: buildDynamicQuery(from, to),
        variables: buildDynamicVariables(filteredOptions),
      }),
    });

    return data?.data?.usersPermissionsUsers?.data;
  };

  const fetchProvidersData = async (filteredOptions) => {
    try {
      const results = await fetchUsers(filteredOptions);
      const users = results.map(user => ({
        ...user?.attributes,
        id: Number(user?.id),
      }));
      users && setSearchResults(users);
      if (users.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
    } catch (err) {
      console.log(err);
    };
  };

  const handleApllyFilteredOptions = async (options) => {
    fetchProvidersData(options);
  };

  return (
    <>
      {loading
      ?
        <Loading/>
      :
        <>
          <section className={`${styles.banner} ${!desktopImage?.url ? styles.empty : ''}`}>
            {desktopImage && desktopImage?.url &&
              <Banner
                mobileImage={mobileImage}
                desktopImage={desktopImage}
              />
            }
            <div className={`${styles.searchButtonsWrapper} page-width`}>
              <SearchInput
                searchQueries={searchQueries}
                setSearchQueries={setSearchQueries}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                setNoResults={setNoResults}
              />
              <Button
                className={styles.filterButton}
                onClick={handleFilterButtonClick}
                Icon={<FilterIcon/>}
                children={'Filter'}
                textClassName={styles.text}
              />
            </div>
          </section>
          <FilterCategories
            showCategories={showCategories}
            onApplyFilterButtonClick={handleApllyFilteredOptions}
            onResetFilterButtonClick={handleClearFilterOptions}
            filteredOptions={filteredOptions}
            setFilteredOptions={setFilteredOptions}
          />
          {searchResults && searchResults.length > 0 &&
            <>
              <section className={`${styles.results} page-width`}>
                {displayedItems && displayedItems.map((result, index) => (
                  <ProviderCard
                    key={result.id}
                    provider={result}
                    count={4}
                    roleType={result?.role?.data?.attributes?.type}
                  />
                ))}
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
            </>
          }
          {noResults &&
            <section className={`${styles.noResults} page-width`}>
              <Text
                className={styles.title}
                tag={'h4'}
                children={'No Matching Results'}
              />
              <Text
                className={styles.description}
                tag={'span'}
                children={`There is no matching results for ${searchQueries || 'filtered options'} `}
              />
              <Button
                children={'Clear filter'}
                variant={'general'}
                onClick={handleClearFilterOptions}
              />
            </section>
          }
        </>
      }
    </>
  )
}
