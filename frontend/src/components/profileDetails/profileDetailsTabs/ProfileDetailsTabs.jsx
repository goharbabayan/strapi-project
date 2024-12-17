import styles from './profileDetailsTabs.module.css';
import DynamicComponent from '@/components/dynamicComponent/DynamicComponent';

export default function ProfileDetailsTabs({profileDetailsTabsData, activeTabId, setActiveTabId}) {

  return (
    <div className='page-width'>
      <div className={styles.tabsContainer}>
        {profileDetailsTabsData.map((profileDetailsTab, index) => {
            const {id, label, icon} = profileDetailsTab;
            const DynamicIconComponent = icon ? DynamicComponent(icon) : null;
            return (
              <div
                key={index}
                className={`${activeTabId === id  ? styles.activeTab : styles.tab} ${styles.tabItem}`}
                onClick={() => setActiveTabId(id)}
              >
                {icon && <DynamicIconComponent />}
                <h3 className={styles.tabContainerLabel}>{label}</h3>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
