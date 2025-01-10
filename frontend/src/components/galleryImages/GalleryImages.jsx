import styles from './galleryImages.module.css';
import RemoveIcon from '../icons/RemoveIcon';
import Text from '../text/Text';
import { forwardRef } from 'react';

const GalleryImages = forwardRef(({type, id, children, images, onChildFormDataChange, error}, ref) => {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  async function handleUpload(e, type) {
    const isUploadedMultipleFiles = e.target.files.length > 1;
    const token = JSON.parse(localStorage.getItem('token'));
    const form = new FormData();

    if (isUploadedMultipleFiles) {
      for (const key in e.target.files) {
        form.append('images', e.target.files[key]);
      }
    } else {
      const imageFile = e.target.files[0];
      form.append('images', imageFile);
    }

    if (e.target.files.length === 0) return;
  
    try {
      const watermarkResponse = await fetch(`${baseUrl}/api/watermark-images`, {
        method: 'POST',
        body: form,
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

      onChildFormDataChange(type, uploadData);
    } catch (error) {
      console.error('Error during image processing or upload:', error);
    } finally {
      e.target.value = '';
    }
  }
  
  const handleRemoveButtonClick = (e, index, type) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    onChildFormDataChange(type, updatedImages);
  };

  return (
    <section
      id={id}
      className={`${styles.section} ${type === 'selfies' ? styles.selfiesSection : ''}`}
      ref={ref}
    >
      <div className="page-width">
        <Text
          tag={'h2'}
          className={styles.title}
          children={children}
        />
        <div className={`${styles.imagesWrapper}`}>
          {images && images.length > 0 &&
            images.map((image, index) => (
              <div className={styles.imageWrapper} key={index}>
                <img
                  src={`${baseUrl}${image?.url}`}
                  alt={`${image?.alternativeText && `image-${index}`}`}
                />
                <RemoveIcon
                  className={styles.removeIcon}
                  onClick={(e) => handleRemoveButtonClick(e, index, type)}
                />
              </div>
            ))
          }
          {error &&
            <Text
              tag={'span'}
              className='text-small errorText page-width'
              children={error}
            />
          }
        </div>
        <input
          type='file'
          multiple
          id={type === 'photos' ? 'generalImages' : 'selfyImages'}
          name={type === 'photos' ? 'generalImage' : 'selfyImage'}
          accept='image/*'
          className={styles.hidden}
          onChange={(e) => handleUpload(e, type === 'photos' ? 'photos' : 'selfies')}
        />
        <label
          htmlFor={type === 'photos' ? 'generalImages' : 'selfyImages'}
          className={`${styles.uploadButton}`}
        >
          {type === 'photos' ? 'Upload photos' : 'Upload selfies'}
        </label>
      </div>
    </section>
  )
});

export default GalleryImages;
