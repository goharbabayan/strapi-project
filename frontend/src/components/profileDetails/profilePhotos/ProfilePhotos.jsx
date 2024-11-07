import styles from './profilePhotos.module.css';
import Text from '@/components/text/Text';
import Image from "@/components/image/Image";

export default function ProfilePhotos({photos}) {
  const photosAreNotEmpty = photos !== null && Array.isArray(photos) && photos.length > 0;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <div className="page-width">
      <div className={styles.photoSection}>
        {photosAreNotEmpty ?
          photos.map((photo, index) => (
            <div key={index} className={styles.imageWrapper}>
              <Image
                src={`${baseUrl}${photo.url}`}
                alt={photo.alternativeText || 'photo'}
                width={photo.width}
                height={photo.height}
                className={styles.photo}
              />
            </div>
          )) :
        <div className={styles.container}>
          <Text
            tag={'h4'}
            children={'No Photos'}
            className={styles.title}
          />
          <Text
            tag={'span'}
            children={'There is no photos yet.'}
            className={styles.text}
          />
        </div>
        }
      </div>
    </div>
  )
}
