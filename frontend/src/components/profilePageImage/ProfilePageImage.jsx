'use client'

import styles from './profilePage.module.css';
import Button from '../button/Button';
import Text from '../text/Text';

export default function ProfilePageImage({type, formData, onChildFormDataChange, className}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  async function handleUpload(e, type) {
    const token = JSON.parse(window.localStorage.getItem('token'));
    const imageFile = e.target.files[0];
    const form = new FormData();
    form.append('files', imageFile);
    if (!imageFile) return;
  
    await fetch(`${baseUrl}/api/upload?populate=*`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`
        },
        body: form,
      })
      .then(resp => resp.json())
      .then(data => onChildFormDataChange(type, data[0]));
    e.target.value = '';
  }

  const handleRemoveButtonClick = (e, index, type) => {
    onChildFormDataChange(type, null);
  }

  if (type === 'profilePicture') {
    return (
      <div className={`${styles.container} ${className ? className : null}`}>
        <div className={`${styles.profilePicture}`}>
          {formData.profilePicture && <img src={`${baseUrl}${formData.profilePicture.url}`} key={formData.profilePicture.id} data-id={formData.profilePicture.id} alt={`${formData.profilePicture.alternativeText ? formData.profilePicture.alternativeText : ''}`}/>
          }
        </div>
        <div className={`${styles.buttonsWrap} ${styles.profilePictureButtons}`}>
          <input
            type='file'
            id='profileImageInput'
            name='profileImage'
            accept='image/*'
            hidden
            onChange={(e) => handleUpload(e, 'profilePicture')}
          />
          <label htmlFor='profileImageInput' className={`${styles.uploadButton}`}>
            <Text
              tag={'span'}
              children={formData.profilePicture ? 'Change profile picture' : 'Upload profile picture'}
            />
          </label>
          {formData.profilePicture &&
            <Button
              className={`${styles.deleteButton} btn_small button`}
              onClick={(e) => handleRemoveButtonClick(e, 0, 'profilePicture')}
              children={'Delete profile picture'}
            />
          }
        </div>
      </div>
    )
  } else if (type === 'coverPhoto') {
    return (
      <div>
        <div className={`${styles.photo}`}>
          {formData.coverPhoto && <img src={`${baseUrl}${formData.coverPhoto.url}`} key={formData.coverPhoto.id} data-id={formData.coverPhoto.id}/>}
        </div>
        <div className={styles.buttonsWrap}>
          <input
            type='file'
            id='coverPhotoInput'
            name='coverPhoto'
            accept='image/*'
            className={`${styles.hidden} ${styles.coverPhoto}`}
            onChange={(e) => handleUpload(e, 'coverPhoto')}
          />
          <label htmlFor='coverPhotoInput' className={`${styles.uploadButton}`}>
            <Text
              tag={'span'}
              children={formData.coverPhoto ? 'Change cover photo' : 'Upload cover photo'}
            />
          </label>
          {formData.coverPhoto &&
            <Button
              className={`${styles.deleteButton} btn_small`}
              onClick={(e) => handleRemoveButtonClick(e, 0, 'coverPhoto')}
              children={'Delete Cover Photo'}
            />
          }
          </div>
      </div>
    )
  }
}
