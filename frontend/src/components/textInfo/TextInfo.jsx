import styles from './textInfo.module.css';
import Text from '../text/Text';

export default function TextInfo({title, text, accordionSectionIsNotEmpty}) {
  return (
    <div className={`${styles.container} ${accordionSectionIsNotEmpty ? '' : styles.fullWidth}`}>
      {title &&
        <Text
          tag={'h3'}
          className={styles.title}
          children={title}
        />
      }
      {text &&
        <Text
          tag={'p'}
          className={styles.text}
          children={text}
        />
      }
    </div>
  )
}
