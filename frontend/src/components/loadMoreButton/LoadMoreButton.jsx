import Button from '../button/Button';
import styles from './loadMoreButton.module.css';

export default function LoadMoreButton({onClick, title}) {
  return (
    <div className={`${styles.buttonWrapper}`} onClick={onClick}>
      <Button
        variant={'main'}
        children={title}
      />
		</div>
  )
}
