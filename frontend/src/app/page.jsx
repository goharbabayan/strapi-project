'use client'
import { useQuery } from '@apollo/client';
import { GET_PROVIDERS_LIST_QUERIES } from './graphql/providersListQueries';
import Banner from '@/components/banner/Banner';
import ProvidersList from '@/components/providers/ProvidersList';
import Collection from '@/components/collection/Collection';
import LocationsList from '@/components/locationsList/LocationsList';
import globalStyles from '../app/global.css';

export default function HomePage() {
  const { loading, error, data } = useQuery(GET_PROVIDERS_LIST_QUERIES);
  const providersSections = data?.homePage?.data?.attributes?.Slider1;
  const isAtLeastOneProvidersSectionExisting = providersSections && providersSections.length > 0;
  
  return (
    <>
      <Banner />
      {isAtLeastOneProvidersSectionExisting && providersSections.map((section, index) => {
        const providers = section.card;
        return (
          <ProvidersList
            providersSection={section}
            providers={providers}
            key={index}
            index={index}
          />
        )}
      )}
      <Collection/>
      <LocationsList/>
    </>
  )
}
