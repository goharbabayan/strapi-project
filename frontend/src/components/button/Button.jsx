import Link from 'next/link';
import Text from '../text/Text';
import styles from './button.module.css';
import FilterIcon from '../icons/Filter';
import { PRIMARY_BUTTON } from '@/app/utils/constants/buttonTypes';

const Button = ({
  variant,
  type,
  className,
  onClick,
  children,
  href,
  textClassName,
  Icon,
  ...props
}) => {

  if (href) {
    return (
      <Link
        href={href}
        className={`link ${styles.button} ${variant === PRIMARY_BUTTON ? styles.primary : styles.outlined} ${className || ''}`}
        {...props}
      >
        <Text
          tag={'span'}
          children={children}
        />
      </Link>
    );
  }
  return (
    <button
      type={type || 'button'}
      className={`${styles.button} ${variant === PRIMARY_BUTTON ? styles.primary : styles.outlined} ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {Icon && Icon}
      <Text
        tag={'span'}
        children={children}
        className={textClassName || ''}
      />
    </button>
  );
};

export default Button;
