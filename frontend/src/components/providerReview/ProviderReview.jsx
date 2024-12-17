import styles from './providerReview.module.css';
import Text from '../text/Text';

export default function ProviderReview ({author, text, date, isLastChild}) {
  return (
    <div className={`${styles.review} ${isLastChild ? styles.lastChild : ''}`}>
      <div className={styles.row}>
        <Text
          tag={'span'}
          children={author}
          className={styles.author}
        />
        <Text
          tag={'span'}
          children={date}
          className={styles.date}
        />
      </div>
      <Text
        tag={'span'}
        children={text}
        className={styles.text}
      />
    </div>  
  )
}
