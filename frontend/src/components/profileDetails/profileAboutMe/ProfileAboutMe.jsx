import ProviderInterests from '../providerInterests/ProviderInterests';
import styles from './profileAboutMe.module.css';

export default function ProfileAboutMe({aboutMeDescription, providerCostumes, providerMakeup, providerOutfits, providerExtraOptions}) {
  return (
    <div className="page-width">
      {!!aboutMeDescription &&
        <div className={styles.aboutMeContainer}>
          <h3 className={styles.aboutMeTitle}>About me</h3>
          <p className={styles.aboutMeText}>
            {aboutMeDescription}
          </p>
        </div>
      }
      <div className={styles.aboutMeInterestsContainer}>
        {!!providerCostumes.length &&
          <ProviderInterests
            componentTitle="Costumes"
            data={providerCostumes}
          />
        }
        {!!providerMakeup.length &&
          <ProviderInterests
            componentTitle="Makeup"
            data={providerMakeup}
          />
        }
        {!!providerOutfits.length &&
          <ProviderInterests
            componentTitle="Outfits"
            data={providerOutfits}
          />
        }
        {!!providerExtraOptions.length &&
          <ProviderInterests
            componentTitle="Extra options"
            data={providerExtraOptions}
          />
        }
      </div>
    </div>
  )
}
