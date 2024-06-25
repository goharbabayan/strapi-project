import Link from 'next/link';
import styles from './providerType.module.css';

export default function ProviderType({type}) {
  return (
    <div className={styles.container}>
      { type && type.map((item, index) => {
        const url = item.link;
        return (
          <div className={styles.wrapper} key={index}>
            <Link href={url} className={styles.link}>
              <span className={styles.text}>{item.text}</span>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
