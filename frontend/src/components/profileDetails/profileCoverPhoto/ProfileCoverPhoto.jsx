import EditContentIcon from "@/components/icons/EditContent";
import Image from "@/components/image/Image";
import Text from "@/components/text/Text";
import { uploadImageWithWatermark } from "@/app/utils/helpers";
import { useState } from "react";
import Loading from "@/app/loading";

export default function ProfileCoverPhoto({
  coverPhotoUrl,
  coverPhotoName,
  className,
  data,
  token,
  onChanges,
  error,
}) {
  const {
    showEditButton,
    editButtonParentClassName,
    editButtoniconClassName,
    editButtontextClassName,
    editButtonText,
    invalidBorder,
    invalidText,
    shouldUploadImage,
    emptyImageClassName,
    emptyImageText,
    emptyImageTextClassName
  } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleUploadImage = async (e) => {
    setIsLoading(true);
    const watermarkedImages = await uploadImageWithWatermark(e, token, false);
    if (watermarkedImages) {
      setIsLoading(false);
      onChanges('coverPhoto', watermarkedImages[0]);
    };
  };

  return (
    <>
      {isLoading
        ?
          <div className={className}>
            <Loading/>
          </div>
        :
        <div className={className}>
          {coverPhotoUrl
          ?
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${coverPhotoUrl}`}
              alt={coverPhotoName || 'cover photo'}
              width={1366}
              height={539}
            />
          :
            <div className={`${emptyImageClassName} ${(error && invalidBorder) ? invalidBorder : ''}`}>
              {emptyImageText &&
                <Text
                  tag={'span'}
                  className={`${emptyImageTextClassName || ''} ${(error && invalidText) ? invalidText : ''}`}
                  children={emptyImageText}
                />
              }
            </div>
          }
          {showEditButton &&
            <div className={`${editButtonParentClassName || ''} page-width`}>
              {shouldUploadImage &&
                <>
                  <input
                    type='file'
                    id='coverPhotoInput'
                    name='coverPhoto'
                    accept='image/*'
                    className={'hidden'}
                    onChange={(e) => handleUploadImage(e)}
                  />
                  <label
                    htmlFor='coverPhotoInput'
                    className={editButtoniconClassName || ''}
                  >
                    <EditContentIcon/>
                    {editButtonText &&
                      <Text
                        tag={'span'}
                        className={editButtontextClassName || ''}
                        children={editButtonText}
                      />
                    }
                  </label>
                </>
              }
            </div>
          }  
        </div>
      }
    </>
  )
}
