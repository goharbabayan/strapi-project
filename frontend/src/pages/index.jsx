import Client from '../lib/apolloClient';
import { GET_HEADER_QUERIES } from '@/app/graphql/headerQueries';
import { GET_BANNER_QUERIES } from '@/app/graphql/bannerQueries';
import { GET_PROVIDERS_LIST_QUERIES } from '@/app/graphql/providersListQueries';
import { GET_FIND_BY_TYPE_QUERIES } from '@/app/graphql/findByTypeQueries';
import { GET_BY_LOCATION_QUERIES } from '@/app/graphql/findByLocationQueries';
import { GET_FOOTER_QUERIES } from '@/app/graphql/footerQueries';
import AnnouncementBar from '@/components/announcementBar/AnnouncementBar';
import Header from '../components/header/Header';
import Banner from '../components/banner/Banner';
import ProvidersList from '../components/providers/ProvidersList';
import Collection from '../components/collection/Collection';
import LocationsList from '../components/locationsList/LocationsList';
import Footer from '../components/footer/Footer';

const HomePage = (props) => {
  const { headerSection, logoUrl, bannerSection, providersSections, findByTypeDataSection, findByLocationSection, findFooterSection } = props;
  return (
    <>
      <AnnouncementBar/>
      <Header headerSection={headerSection} logoUrl={logoUrl}
      />
      <main>
        <Banner
          bannerSection={bannerSection}
        />
        { providersSections.map((section, index) => {
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
        <Collection data={findByTypeDataSection}/>
        <LocationsList data={findByLocationSection}/>
      </main>
      <Footer data={findFooterSection} logoUrl={logoUrl}/>
    </>
  );
};

export async function getStaticProps() {
  const [headerData, bannerData, serviceProvidersData, findByTypeData, findByLocationData, findFooterData ] = await Promise.all([
    Client.query({ query: GET_HEADER_QUERIES }),
    Client.query({ query: GET_BANNER_QUERIES }),
    Client.query({ query: GET_PROVIDERS_LIST_QUERIES }),
    Client.query({ query: GET_FIND_BY_TYPE_QUERIES }),
    Client.query({ query: GET_BY_LOCATION_QUERIES }),
    Client.query({ query: GET_FOOTER_QUERIES }),
  ]);

  // Data from header
  const {loading, error, data } = headerData;
  if (loading) {
    // Something for loading;
  }
  if (error) {
    // Something for error;
  };

  // Data from Header
  const headerSection = data?.homePage?.data?.attributes?.Header;
  const logoUrl = headerSection.logo.data?.attributes?.url;
  // Data from Banner
  const bannerSection = bannerData.data?.homePage?.data?.attributes?.Banner;

  // Data from Providers List
  const providersSections = serviceProvidersData.data.homePage.data.attributes.Slider1;

  // Data from Find By Type
  const findByTypeDataSection = findByTypeData.data.homePage.data.attributes.FindByType;

  // Data from Find by Location
  const findByLocationSection = findByLocationData.data.homePage.data.attributes.ByLocations;

   // Data from Footer
   const findFooterSection = findFooterData.data.homePage.data.attributes.Footer;

  return {
    props: { headerSection, logoUrl, bannerSection, providersSections, findByTypeDataSection, findByLocationSection, findFooterSection }
  }
}

export default HomePage;
