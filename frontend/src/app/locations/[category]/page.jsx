'use client'

import {useState, useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { GET_LOCATION_PAGE_QUERIES } from '@/app/graphql/locationPageQueriess';
import { FILTER_CATEGORIES } from '@/app/utils/constants/filterCategories';
import styles from './category.module.css';
import ImageBanner from '@/components/imageBanner/ImageBanner';
import FilterCategories from '@/components/filterCategories/FilterCategories';
import ProviderCard from '@/components/providerCard/ProviderCard';
import Button from '@/components/button/Button';
import Loading from '@/app/loading';
import Text from '@/components/text/Text';
import { buildQueriesForFilteredOptions } from '@/app/utils/helpers';

export default function LocationCategoryPage({params}) {
  const { category } = params;
  const [categoryData, setCategoryData] = useState({
    desktopImage: null,
    mobileImage: null,
  });
  const [providersList, setProvidersList] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [categoryFieldOptions, setCategoryFieldOptions] = useState({
    city: [],
    gender: [],
    services: [],
    hairColor: [],
  });
  const [filteredOptions, setFilteredOptions] = useState({
    city: [],
    gender: [],
    services: [],
    hairColor: [],
  });
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
      })
    };
    fetchProvidersData();
  }, [data]);

  useEffect(() => {
    setDisplayedItems(providersList.slice(0, 12));
    setShowLoadMore(providersList.length > 12);
  }, [providersList]);

  const generateOptionsForFilterCategories = (results, categoryOptions) => {
    let options = {
      city: [],
      gender: [],
      services: [],
      hairColor: [],
    };
    results.map(provider => {
      categoryOptions.forEach(categoryName => {
        const isServicesCategory = categoryName === 'services' && provider[categoryName].length > 0;
        const optionIsNotExistingInOptionsListAndIsNotServicesOption = provider[categoryName] && categoryName !== 'services' && !options[categoryName].includes(provider[categoryName]);
        if (isServicesCategory) {
          provider[categoryName].forEach(item => {
            !options[categoryName].includes(item.item) && options[categoryName].push(item.item);
          });
        } else if (optionIsNotExistingInOptionsListAndIsNotServicesOption) {
          options[categoryName].push(provider[categoryName]);
        };
      });
      return options;
    });
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
    setFilteredOptions({
      city: [],
      gender: [],
      services: [],
      hairColor: [],
    });
  };

  const fetchProvidersData = async () => {
    const city = category && category.replaceAll('-', ' ');
    try {
      const response = await fetch(
        `${baseUrl}/api/users?filters[city][$eq]=${city}&populate=*`
      );
      const results = await response.json();
      results && setProvidersList(results);
      generateOptionsForFilterCategories(results, FILTER_CATEGORIES);
    } catch (err) {
      console.log(err);
    };
  };

  const fetchUsersByFilteredOptions = async (query) => {
    const city = category && category.replaceAll('-', ' ');
    try {
      const response = await fetch(
        `${baseUrl}/api/users?filters[city][$eq]=${city}&filters${query}&populate=*`
      );
      const results = await response.json();
      results && setProvidersList(results);
      if (results.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
    } catch (err) {
      console.log(err);
    };
  };

  const isFilteredAtleastOneCategory = (options) => {
    let isFiltered = false;
    Object.values(options).forEach(option => {
      if (option.length > 0) {
        isFiltered = true;
        return;
      };
    });
    return isFiltered;
  };

  const handleApllyFilteredOptions = async () => {
    const checkIsFilteredAtLeastOneCategory = isFilteredAtleastOneCategory(filteredOptions);
    if (!checkIsFilteredAtLeastOneCategory) return;
    const query = buildQueriesForFilteredOptions(filteredOptions);
    fetchUsersByFilteredOptions(query);
  };

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <>
      {loading
        ?
          <Loading/>
        :
          <section>
          {(categoryData.mobileImage || categoryData.desktopImage) &&
            <div className={styles.mainWrap}>
              <div className={styles.banner}>
                <ImageBanner
                  mobileImage={categoryData.mobileImage}
                  desktopImage={categoryData.desktopImage}
                />
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
              </div>
            </div>
          }
          <div className="page-width">
            {providersList && providersList.length > 0 &&
              <section className={`${styles.results}`}>
                {displayedItems && displayedItems.map((result, index) => {
                    return (
                      <ProviderCard
                        key={index}
                        provider={result}
                        count={4}
                        roleType={result.role.type}
                      />
                    )
                  }
                )}
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
                  className="button_general"
                  onClick={handleClearFilterOptions}
                />
              </div>
            }
          </div>
        </section>
      }
    </>
  )
}
