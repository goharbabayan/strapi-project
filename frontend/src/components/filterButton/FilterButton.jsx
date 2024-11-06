import styles from './filterButton.module.css';
import FilterIcon from '../icons/Filter';
import Text from '../text/Text';

export default function FilterButton({onClick}) {
  return (
    <div className={styles.button} onClick={onClick}>
      <FilterIcon />
      <Text
        className={styles.text}
        children={'Filter'}
        tag={'span'}
      />
    </div>
  )
};
