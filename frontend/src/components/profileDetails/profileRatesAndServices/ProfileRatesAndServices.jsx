import styles from './profileRatesAndServices.module.css';
import ProviderInterests from '../providerInterests/ProviderInterests';

export default function ProfileRatesAndServices({incallRates, outcallRates, services}) {
  const isOneOfTheRatesExist = incallRates.length || outcallRates.length;
  return (
    <div className="page-width">
      {!!services.length &&
        <ProviderInterests
          componentTitle="General services"
          data={services}
        />
      }
      {!!isOneOfTheRatesExist &&
        <div className={styles.ratesContainer}>
          {!!incallRates.length &&
            <ProviderInterests
              componentTitle="Incall"
              data={incallRates}
              isRateData={true}
            />
          }
          {!!outcallRates.length &&
            <ProviderInterests
              componentTitle="Outcall"
              data={outcallRates}
              isRateData={true}
            />
          }
        </div>
      }
    </div>
  )
}
