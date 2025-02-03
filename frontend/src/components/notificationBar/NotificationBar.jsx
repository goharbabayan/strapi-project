import styles from './notificationBar.module.css';
import Text from '../text/Text';
import Button from '../button/Button';

export default function NotificationBar({content, className}) {
  if (!content) return;
  const {Icon, text, buttons} = content;
  return (
    <div className={`${styles.notificationBar} ${className || ''}`}>
      <div className={`${styles.info}`}>
        {Icon &&
        <div className={styles.iconContainer}>
          {Icon}
        </div>
        }
        {text &&
          <Text
            className={styles.notificationText}
            tag={'span'}
            children={text}
          />
        }
      </div>
      {buttons && buttons?.length > 0 &&
        <div className={styles.buttonsWrap}>
          {buttons.map(button => (
            <Button
              key={button.id}
              type={button.type || 'button'}
              variant={button.variant}
              children={button.text}
              className={styles.button}
              onClick={button.onClick}
            />
          ))}
        </div>
      }
    </div>
  )
};
