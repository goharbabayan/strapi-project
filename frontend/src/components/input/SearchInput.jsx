import SearchIcon from '../icons/SearchIcon';
import styles from './searchInput.module.css';

export default function SearchInput({children}) {
  return (
    <div className={styles.wrapper}>
        <input type="text" placeholder='Search' className={styles.input}/>
        <div className={styles.icon}>
          <SearchIcon className={styles.icon}/>
        </div>
    </div>
  )
}
