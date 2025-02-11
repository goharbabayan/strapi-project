import Text from "../text/Text";
import styles from "./switchButton.module.css";

const SwitchButton = ({ isOn, handleToggle, label }) => {
  return (
    <div className={styles.switchWrapper}>
      {label &&
        <Text
          tag={'span'}
          children={label}
          className={styles.switchLabel}
        />
      }
      <div
        className={`${styles.switch} ${isOn ? styles.on : styles.off}`}
        onClick={handleToggle}
        role="button"
        aria-pressed={isOn}
      >
        <div className={styles.slider}></div>
      </div>
    </div>
  );
};

export default SwitchButton;
