import styles from './breadcrumbs.module.css';
import Text from '../text/Text';

export default function Breadcrumbs ({path}) {
  if (!path) return;
  return (
    <Text
      tag={'h3'}
      children={path}
      className={styles.title}
    />
  )
}
