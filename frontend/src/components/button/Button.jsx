import Link from 'next/link';
import Text from '../text/Text';
import styles from './button.module.css';
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
  IconAfterText,
  ...props
}) => {

  if (href) {
    return (
      <Link
        href={href}
        className={`link ${styles.button} ${variant === PRIMARY_BUTTON ? styles.primary : styles.outlined} ${className || ''}`}
        {...props}
        onClick={onClick}
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
      {IconAfterText && IconAfterText}
    </button>
  );
};

export default Button;
