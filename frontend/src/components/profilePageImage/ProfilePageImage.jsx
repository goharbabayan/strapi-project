'use client'
import styles from './profilePage.module.css';
import Button from '../button/Button';
import Text from '../text/Text';
import Image from '../image/Image';
import InfoIcon from '../icons/Info';

export default function ProfilePageImage({type, formData, onChildFormDataChange, className}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  async function handleUpload(e) {
    const token = JSON.parse(window.localStorage.getItem('token'));
    const imageFiles = e.target.files;

    if (!imageFiles || imageFiles.length === 0) return;

    const fileData = new FormData();
    
    for (let i = 0; i < imageFiles.length; i++) {
      fileData.append('images', imageFiles[i]);
    }

    try {
      const watermarkResponse = await fetch(`${baseUrl}/api/watermark-images`, {
        method: 'POST',
        body: fileData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const watermarkData = await watermarkResponse.json();

      if (!watermarkResponse.ok || !watermarkData.watermarkedImages) {
        throw new Error('Failed to apply watermark');
      }

      const uploadFormData = new FormData();
      for (let i = 0; i < watermarkData.watermarkedImages.length; i++) {
        const watermarkedImageUrl = watermarkData.watermarkedImages[i].url;
        const watermarkedImageBlob = await fetch(`${baseUrl}${watermarkedImageUrl}`).then(res => res.blob());
        const fileName = watermarkedImageUrl.split('/').pop();
        const customFile = new File([watermarkedImageBlob], fileName, {
            type: watermarkedImageBlob.type,
            lastModified: Date.now(),
        });

        uploadFormData.append('files', customFile);
      }

      const uploadResponse = await fetch(`${baseUrl}/api/upload?populate=*`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData[0]) {
        throw new Error('Failed to upload watermarked image');
      }

      await onChildFormDataChange(type, uploadData[0]);
    } catch (error) {
      console.error('Error during image processing or upload:', error);
    } finally {
      e.target.value = "";
    }
  }

  const handleRemoveButtonClick = (e, index, type) => {
    onChildFormDataChange(type, null);
  }

  if (type === 'profilePicture') {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        {formData.profilePicture && formData.profilePicture?.url ?
          <Image
            src={`${baseUrl}${formData.profilePicture.url}`}
            alt={`${formData.profilePicture.alternativeText || formData.profilePicture.name}`}
            width={300}
            height={400}
            providerCartAspectRatio={0.75}
          /> :
          <div className={styles.emptyProfilePicture}></div>
        }
        <div className={styles.info}>
          <InfoIcon/>
          <Text
            tag={'span'}
            className="text-small"
            children={'Upload picture with 3x4 resolution'}
          />
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
              className={`${styles.deleteButton}`}
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
        {formData.coverPhoto && formData.coverPhoto?.url ?
          <Image
            src={`${baseUrl}${formData.coverPhoto.url}`}
            alt={`${formData.coverPhoto.alternativeText || formData.coverPhoto.name}`}
            width={210}
            height={90}
            providerCartAspectRatio={2.3}
          /> :
          <div className={styles.emptyCoverPhoto}></div>
        }
        </div>
        <div className={styles.info}>
          <InfoIcon/>
          <Text
            tag={'span'}
            className="text-small"
            children={'Upload picture with 21x9 resolution'}
          />
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
              className={`${styles.deleteButton}`}
              onClick={(e) => handleRemoveButtonClick(e, 0, 'coverPhoto')}
              children={'Delete Cover Photo'}
            />
          }
          </div>
      </div>
    )
  }
}
