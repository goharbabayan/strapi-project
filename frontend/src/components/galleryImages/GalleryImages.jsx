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
        form.append('files', e.target.files[key]);
      };
    } else {
      const imageFile = e.target.files[0];
      form.append('files', imageFile);
    };
    if (e.target.files.length == 0) return;

    await fetch(`${baseUrl}/api/upload?populate=*`, {
        method: 'POST',
        body: form,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then(resp => resp.json())
      .then(data => {
        let updatedImages;
        if (isUploadedMultipleFiles) {
          updatedImages = images === null ? data : [...images, ...data];
        } else {
          updatedImages = images === null ? [data[0]] : [...images, data[0]];
        }
        onChildFormDataChange(type, updatedImages);
      })
    e.target.value = '';
  };

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
