import EmailIcon from '@/components/icons/EmailIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';
import OnlyFansIcon from '@/components/icons/OnlyFansIcon';
import styles from './profileContactInfo.module.css';
import WebsiteIcon from '@/components/icons/WebsiteIcon';

export default function ProfileContactInfo({providerContactInfo, providerSocialLinks, providerWebsiteLink}) {
  return (
    <>
      {providerContactInfo?.email &&
        <div className={`${styles.providerContactInfoItem} ${styles.providerContactWrapper}`}>
          <EmailIcon />
          <div className={styles.providerInfoDataContainer}>
            <span className={styles.providerInfoLabel}>Email</span>
            <a href={`mailto:${providerContactInfo?.email}`} className={styles.providerInfoData}>{providerContactInfo?.email}</a>
          </div>
        </div>
      }
      {providerContactInfo?.phone &&
        <div className={`${styles.providerContactInfoItem} ${styles.providerContactWrapper}`}>
          <PhoneIcon />
          <div className={styles.providerInfoDataContainer}>
            <span className={styles.providerInfoLabel}>PHONE | NO SMS</span>
            <a href={`tel:${providerContactInfo?.phone}`} className={styles.providerInfoData}>{providerContactInfo?.phone}</a>
          </div>
        </div>
      }
      {(providerSocialLinks.instagram || providerSocialLinks.onlyFans) &&
        <div className={styles.providerContactInfoItem}>
          <h4 className={styles.providerInfoLabel}>Follow me on</h4>
          {providerSocialLinks.instagram &&
            <a href={providerSocialLinks.instagram}>
              <InstagramIcon />
            </a>
          }
          {providerSocialLinks.onlyFans &&
            <a href={providerSocialLinks.onlyFans}>
              <OnlyFansIcon />
            </a>
          }
        </div>
      }
      {providerWebsiteLink &&
        <div className={`${styles.providerContactInfoItem} ${styles.providerContactWrapper}`}>
          <WebsiteIcon />
          <div className={styles.providerInfoDataContainer}>
            <h4 className={styles.providerInfoLabel}>Website</h4>
            <a href={providerWebsiteLink} className={styles.providerInfoData}>{providerWebsiteLink}</a>
          </div>
        </div>
      }
    </>
  )
}
