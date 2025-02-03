import styles from './popup.module.css';
import Text from '../text/Text';
import PopUpCloseIcon from '../icons/PopUpCloseIcon';

export default function Popup({
  title,
  text,
  Icon,
  onClose,
  titleClassName,
  textClassName,
  contentClassName
}) {
  return (
    <div className={`${styles.modal}`}>
      <div className={styles.modalContainer}>
        {Icon && Icon}
        <div className={`${styles.modalContent} ${contentClassName || ''}`}>
          {title &&
            <Text
              tag={'h5'}
              children={title}
              className={`${styles.title} ${titleClassName || ''}`}
            />
          }
          {text &&
            <Text
              tag={'span'}
              children={text}
              className={`${styles.text} ${textClassName || ''}`}
            />
          }
        </div>
        <PopUpCloseIcon
          onClick={onClose}
          className={styles.closeIcon}
        />
      </div>
    </div>
  )
}
