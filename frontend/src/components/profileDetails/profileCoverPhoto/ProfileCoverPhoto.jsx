import Image from "@/components/image/Image";

export default function ProfileCoverPhoto({coverPhotoUrl, coverPhotoName}) {

  return (
    <>
      <Image
        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${coverPhotoUrl}`}
        alt={coverPhotoName || 'cover photo'}
        width={1366}
        height={539}
      />
    </>
  )
}
