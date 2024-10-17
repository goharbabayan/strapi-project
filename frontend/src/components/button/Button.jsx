import Link from 'next/link';
import styles from './button.module.css';

const Button = ({ children, href, ...props }) => {
  if (href) {
    return (
      <Link href={href} {...props} className={`${styles.link} ${props?.className ? props?.className : ''}`}>
        <span>{ children }</span>
      </Link>
    );
  }
  return <button type='button' {...props}>{ children }</button>;
};

export default Button;
