import styles from './aboutMe.module.css';
import Text from '../text/Text';
import Button from '../button/Button';
import { useState } from 'react';

export default function AboutMe ({aboutMeData, onSaveChanges, setShowModal}) {
  const [aboutMeText, setAboutMeText] = useState(aboutMeData);

  const handleChange = (value) => {
    setAboutMeText(value);
  };

  const saveChanges = () => {
    setShowModal(false);
    onSaveChanges('aboutMe', aboutMeText);
  };

  const cancelChanges = () => {
    setAboutMeText(aboutMeData);
  };

  return (
    <section
      id='About'
      className={`${styles.aboutText}`}
    >
      <div className={`${styles.bio}`}>
        <Text
          tag={'textarea'}
          className={`${styles.textarea}`}
          value={aboutMeText || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={'Type your bio here...'}
        />
      </div>
      <div className={styles.buttons}>
        <Button
          children={'Cancel'}
          variant={'general'}
          onClick={cancelChanges}
        />
        <Button
          type={'button'}
          children={'Save changes'}
          variant={'main'}
          onClick={saveChanges}
        />
      </div>
    </section>
  )
};
