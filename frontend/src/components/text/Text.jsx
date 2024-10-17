import styles from './text.module.css';

export default function Text({tag, className, children, ...rest}) {
  const TagName = `${tag}`; 
  if (tag === 'textarea') {
    return <TagName className={`${styles.text} ${className}`} {...rest} />;
  } else {
    return (
      <TagName className={className}>
        {children}
      </TagName>
    )
  }
}
