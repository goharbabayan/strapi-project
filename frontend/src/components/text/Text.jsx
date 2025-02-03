import InfoIcon from '../icons/Info';
import styles from './text.module.css';

export default function Text({tag, className, children, onMouseOver, onMouseOut, ...rest}) {
  const TagName = `${tag}`; 
  if (tag === 'textarea') {
    return <TagName className={`${styles.text} ${className}`} onMouseOut={onMouseOut} onMouseOver={onMouseOver} {...rest} />;
  } else {
    return (
      <TagName className={className} onMouseOut={onMouseOut} onMouseOver={onMouseOver} {...rest}>
        {children}
      </TagName>
    )
  }
}
