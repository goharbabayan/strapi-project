import ProviderInterests from '../providerInterests/ProviderInterests';
import styles from './profileAboutMe.module.css';

export default function ProfileAboutMe({aboutMeDescription, providerGlam, providerCloset, providerExtraOptions}) {
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
        {!!providerGlam.length &&
          <ProviderInterests
            componentTitle="My glam"
            data={providerGlam}
          />
        }
        {!!providerGlam.length &&
          <ProviderInterests
            componentTitle="My closet"
            data={providerCloset}
          />
        }
        {!!providerExtraOptions.length &&
          <ProviderInterests
            componentTitle="My extras"
            data={providerExtraOptions}
          />
        }
      </div>
    </div>
  )
}
