'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SEARCH_PAGE_BANNER_QUERIES } from '../graphql/searchPageBannerQueries';
import styles from './Search.module.css';
import ImageBanner from '@/components/imageBanner/ImageBanner';
import SearchInput from '@/components/searchInput/SearchInput';
import FilterButton from '@/components/filterButton/FilterButton';
import ProviderCard from '@/components/providerCard/ProviderCard';
import Text from '@/components/text/Text';
import Button from '@/components/button/Button';
import Loading from '../loading';
import FilterCategories from '@/components/filterCategories/FilterCategories';
import { SEARCH_AND_FILTER_POPULATE_FIELDS } from '../utils/constants/fetchURLParams';
import { buildQueriesForFilteredOptions } from '../utils/helpers';

export default function Search() {
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQueries, setSearchQueries] = useState('');
  const [filteredOptions, setFilteredOptions] = useState({
    city: [],
    gender: [],
    services: [],
    hairColor: [],
  });
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
    const isSearchQueriesOrFilteredOptionsExist = searchQueries.length > 0   ||  hasAtLeastOneValue(filteredOptions);
    isSearchQueriesOrFilteredOptionsExist && handleApllyFilteredOptions(filteredOptions);
  }, [searchQueries]);

  function hasAtLeastOneValue(object) {
    let valueIsNotEmpty = false;
    Object.values(object).forEach(item => {
      if (item.length > 0) {
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
    setFilteredOptions({
      city: [],
      gender: [],
      services: [],
      hairColor: [],
    });
  };

  const handleApllyFilteredOptions = async () => {
    let data = filteredOptions;
    if (searchQueries.length > 0) {
      data = {...filteredOptions, name: [searchQueries], lastName: [searchQueries]};
    } else {
      data = {...filteredOptions, name: [], lastName: []};
    };
    setFilteredOptions(data);
    const query = buildQueriesForFilteredOptions(data);
    if (query === '') {
      setSearchResults([]);
      return;
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/users?filters${query}&${SEARCH_AND_FILTER_POPULATE_FIELDS}`
      );
      const results = await response.json();
      setSearchResults(results);
      if (results.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
    } catch (err) {
      console.log(err);
    };
  };

  return (
    <>
      {loading
      ?
        <Loading/>
      :
        <>
          {(mobileImage || desktopImage) &&
            <div className={styles.mainWrap}>
              <section className={styles.banner}>
                <ImageBanner
                  mobileImage={mobileImage}
                  desktopImage={desktopImage}
                />
                <div className={`${styles.searchButtonsWrapper} page-width`}>
                  <SearchInput
                    searchQueries={searchQueries}
                    setSearchQueries={setSearchQueries}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    setNoResults={setNoResults}
                  />
                  <FilterButton onClick={handleFilterButtonClick}/>
                </div>
              </section>
              <FilterCategories
                showCategories={showCategories}
                onApplyFilterButtonClick={handleApllyFilteredOptions}
                onResetFilterButtonClick={handleClearFilterOptions}
                filteredOptions={filteredOptions}
                setFilteredOptions={setFilteredOptions}
              />
            </div>
          }
          {searchResults && searchResults.length > 0 &&
            <>
              <section className={`${styles.results} page-width`}>
                {displayedItems && displayedItems.map((result, index) => (
                  <ProviderCard
                    key={result.id}
                    provider={result}
                    count={4}
                  />
                ))}
              {showLoadMore && (
                <div className={styles.button}>
                  <Button
                    onClick={handleLoadMore}
                    children={'Show more'}
                    className="button_main"
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
                className="button_general"
                onClick={handleClearFilterOptions}
              />
            </section>
          }
        </>
      }
    </>
  )
}
