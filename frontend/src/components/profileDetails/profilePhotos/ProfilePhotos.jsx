import { useState } from 'react';
import styles from './profilePhotos.module.css';
import Text from '@/components/text/Text';
import Image from "@/components/image/Image";
import PlusIcon from '@/components/icons/plusIcon';
import { uploadImage, uploadImageWithWatermark } from '@/app/utils/helpers';
import Loading from '@/app/loading';
import RemoveIcon from '@/components/icons/RemoveIcon';
import Modal from '@/components/modal/Modal';

export default function ProfilePhotos({photos, isVerified, data}) {
  const photosAreNotEmpty = photos !== null && Array.isArray(photos) && photos.length > 0;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(null);
  const [showRemoveImageConfirmationPopup, setShowRemoveImageConfirmationPopup] = useState(false);
  const {
    field,
    showEditAndDeleteButtons,
    shouldUploadImage,
    showNoPicturesForDashboardPage,
    onChanges,
    token,
    setErrors,
    error,
  } = data || {};

  const confirmationForDeletingPhotoContent = [
    {
      title: '',
      text: 'Are you sure you want to delete image? It is not undoable action.',
      showButtons: true,
      buttons: [
        {
          children: 'Cancel',
          variant: 'general',
          type: 'button',
          onClick: () => {
            handleCancelDeletePhoto();
          },
        },
        {
          children: 'Delete',
          variant: 'main',
          type: 'button',
          onClick: () => {
            handleConfirmDeletePhoto();
          },
        },
      ]
    }
  ];

  const handleUploadImage = async (e) => {
    setErrors(null);
    setIsLoading(true);
    const watermarkedImages = await uploadImageWithWatermark (e, token, true);
    watermarkedImages && setIsLoading(false);
    photosAreNotEmpty ?  onChanges(`${field}`, [...photos, ...watermarkedImages]) : onChanges(`${field}`, watermarkedImages);
  };

  const handleRemoveButtonClick = (e, index) => {
    if (!isVerified) {
      setImageIndex(index);
      setShowRemoveImageConfirmationPopup(true);
      return;
    };
    const updatedImages = [...photos];
    updatedImages.splice(index, 1);
    onChanges(`${field}`, updatedImages);
  };

  const handleCancelDeletePhoto = () => {
    handleModalClose();
  };

  const handleModalClose = () => {
    setShowRemoveImageConfirmationPopup(false);
  };

  const handleConfirmDeletePhoto = () => {
    if (!!imageIndex) return;
    const updatedImages = [...photos];
    updatedImages.splice(imageIndex, 1);
    onChanges(`${field}`, updatedImages);
    setImageIndex(null);
    setShowRemoveImageConfirmationPopup(false);
  };

  return (
    <div className="page-width">
      {showEditAndDeleteButtons &&
        <div className={`${styles.editPhotos || ''}`}>
          {shouldUploadImage &&
            <>
              <input
                type='file'
                multiple
                id={`${field}-input`}
                name={field}
                accept='image/*'
                className={'hidden'}
                onChange={(e) => handleUploadImage(e)}
              />
              <label
                htmlFor={`${field}-input`}
                className={styles.addPhotos}
              >
                <PlusIcon
                  className={styles.editPhotosIconWrapper}
                  text={`Add ${field}`}
                  textClassName={styles.addText}
                />
              </label>
            </>
          }
        </div>
      }
      <div className={`${styles.photoSection} ${!photosAreNotEmpty ? styles.empty : ''}`}>
        {isLoading &&
          <div className={styles.loader}>
            <Loading/>
          </div>
        }
        {showRemoveImageConfirmationPopup &&
          <Modal
            title={`Delete ${field}`}
            content={confirmationForDeletingPhotoContent}
            closeModal={handleModalClose}
          />
        }
        {photosAreNotEmpty ?
          photos.map((photo, index) => (
            <div key={index} className={styles.imageWrapper}>
              <Image
                src={`${baseUrl}${photo.url}`}
                alt={photo.alternativeText || field}
                width={photo.width}
                height={photo.height}
                className={styles.photo}
              />
              {showEditAndDeleteButtons &&
                <RemoveIcon
                  className={styles.removeIcon}
                  onClick={(e) => handleRemoveButtonClick(e, index)}
                />
              }
            </div>
          )) : null
        }
        {!photosAreNotEmpty && showNoPicturesForDashboardPage &&
          <div className={styles.container}>
            <Text
              tag={'h4'}
              children={`No ${field}`}
              className={styles.title}
            />
            <Text
              tag={'span'}
              children={`There are no ${field} yet.`}
              className={styles.text}
            />
          </div>
        }
      </div>
    </div>
  )
}
