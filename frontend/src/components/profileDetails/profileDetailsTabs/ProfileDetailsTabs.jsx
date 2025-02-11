import styles from './profileDetailsTabs.module.css';
import DynamicComponent from '@/components/dynamicComponent/DynamicComponent';

export default function ProfileDetailsTabs({
  profileDetailsTabsData,
  activeTab,
  setActiveTab,
  isMenuTabs,
  errors,
  hideMainWrapperBorders,
}) {
  return (
    <div className={`${styles.mainWrapper} ${hideMainWrapperBorders ? styles.noBorders : ''}`}>
      <div className='page-width'>
        <div className={`${styles.container} ${isMenuTabs ? styles.menuTabs : ''} ${!isMenuTabs ? styles.noWrap : ''}`}>
          {profileDetailsTabsData.map((profileDetailsTab, index) => {
              const {id, label, name, icon} = profileDetailsTab;
              const DynamicIconComponent = icon ? DynamicComponent(icon) : null;
              return (
                <div
                  key={index}
                  className={`${activeTab === id  ? styles.active : ''} ${styles.tab}`}
                  onClick={() => setActiveTab(id)}
                >
                  {icon && <DynamicIconComponent />}
                  <h3 className={`${styles.label} ${errors && errors[name] ? styles.invalid : ''}`}>{label}</h3>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
