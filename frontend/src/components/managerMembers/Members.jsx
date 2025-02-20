'use client'

import { useState, useEffect } from 'react';
import styles from './members.module.css';
import Text from '@/components/text/Text';
import Button from '@/components/button/Button';
import { navigate } from '@/app/actions';
import EditIcon from '@/components/icons/Edit';
import RemoveIcon from '@/components/icons/RemoveIcon';
import Loading from '@/app/loading';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import Link from 'next/link';
import { fetchUserData, fetchUserRatesAndServices } from '@/app/utils/helpers';
import ProviderCard from '../providerCard/ProviderCard';
import { SERVICE_PROVIDER } from '@/app/utils/constants/userRoles';
import Modal from '../modal/Modal';
import Popup from '../popup/Popup';
import InfoIcon from '../icons/Info';

export default function Members ({managerId, onVisitProfileButtonClick, userData, setUserData,setErrors, submitManagerProviderData}) {
  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const [members, setMembers] = useState(null);
  const [showSuccessfullRemoveMessage, setShowSuccessfullRemoveMessage] = useState(false);
  const [showRemoveProviderConfirmationPopup, setShowRemoveProviderConfirmationPopup] = useState(false);
  const [ProviderId, setProviderId] = useState(null);

  useEffect(() => {
    const managerToken = JSON.parse(localStorage.getItem('token'));
    if(!managerToken) return;
    const fetchURL = `${strapiBaseUrl}/api/users?filters[managerID][$eq]=${managerId}&populate=*`;
    useFetchData(fetchURL, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${managerToken}`
      }
    }).then(data => {
      const sortedMembers = Array.isArray(data) && data.length > 0 
      ? [...data].sort((a, b) => b.id - a.id) 
      : [];
      setMembers(sortedMembers);
    });
  }, [showSuccessfullRemoveMessage])

  const inFoMessageForDeletingProviderContent = [
    {
      title: '',
      text: 'The provider will be permanently deleted.',
      showButtons: true,
      buttons: [
        {
          children: 'Cancel',
          variant: 'general',
          type: 'button',
          onClick: () => handleClosePopup(),
        },
        {
          children: 'Delete Provider',
          variant: 'main',
          type: 'button',
          onClick: () => handleRemoveMember(),
        },
      ]
    }
  ];

  const handleManagerProviderDataChange = async (field, value, username) => {
    if (!field || !username) return;
    setErrors(null);
    const userRatesAndServicesData = await fetchUserRatesAndServices(null, username);
    
    await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[username][$eq]=${username}&populate=*`, {
      method: 'GET',
    }).then((res) => {
        const {data, error} = res;
        if (error) {
          setErrors(error);
        } else {
          if (res && Array.isArray(res)) {
            const { id, blocked, createdAt, updatedAt, confirmed, role, ...ProviderData } = res[0];
            const updatedUserData = {
              ...ProviderData,
              ...userRatesAndServicesData,
              [field]: value,
            };
            setUserData({
              ...userData,
              user: updatedUserData,
              userId: id,
            });
            setMembers(prevMembers =>
              prevMembers.map(member => member.id === id ? { ...member, availableNow: !member.availableNow } : member)
            );
            submitManagerProviderData(updatedUserData, true, id);
          }
        }
      });
  };

  const handleRemoveMember = async () => {
    const memberToken = process.env.NEXT_PUBLIC_API_TOKEN_MEMBER;
    if(!ProviderId || !memberToken) return;

    useFetchData(`${strapiBaseUrl}/api/members/${ProviderId}`, {
      method: 'DELETE',
      body: JSON.stringify(ProviderId),
      headers: {
        'Content-type': 'application/json',
        'authorization': `Bearer ${memberToken}`
      }
    }).then(data => {
        if (data.error || data.errors) {
          const errorMessage = data.error.message;
          console.error(errorMessage);
        } else {
          setShowRemoveProviderConfirmationPopup(false);
          setShowSuccessfullRemoveMessage(true);
          setTimeout(() => {
            setShowSuccessfullRemoveMessage(false);
          }, 5000)
        }
      });
  }

  const handleClosePopup = () => {
    setShowRemoveProviderConfirmationPopup(false);
  }
  return (
    <>
      {!members && <Loading className={styles.loading} />}
      {members && members?.length > 0 &&
        <ul className={`${styles.list} unstyled-list`}>
          {members.map(member => {
            return (
              <ProviderCard
                key={member.id}
                provider={member}
                count={3}
                roleType={SERVICE_PROVIDER.type}
                isManagerProvider={true}
                onChanges={handleManagerProviderDataChange}
                onVisitProfileButtonClick={() => onVisitProfileButtonClick(member.username)}
                onRemoveIconClick={(id) => {
                  setShowRemoveProviderConfirmationPopup(true);
                  setProviderId(id);
                }}
              />
            )
          })}
        </ul>
      }
      {showRemoveProviderConfirmationPopup &&
        <Modal
          title={`Are you sure you want to delete this provider?`}
          content={inFoMessageForDeletingProviderContent}
          closeModal={handleClosePopup}
        />
      }
      {showSuccessfullRemoveMessage &&
        <Popup
          title={'Successfuly deleted'}
          text={'The provider was successfully removed'}
          Icon={<InfoIcon />}
          onClose={() => setShowSuccessfullRemoveMessage(false)}
          contentClassName={styles.modal}
        />
      }
      {members && members.length === 0 &&
        <Text
          tag={'h4'}
          className={'text-middle'}
          children={`You don't have providers yet.`}
        />
      }
    </>
  )
}

// {members.map((member, index) => {
//   const isApproved = member.isApprovedByAdmin;
//   return (
//   <li key={index} className={styles.membersList}>
//     <div className={styles.memberName}>
//       <Text
//         tag={'span'}
//         className={'text-small'}
//         children={index+1}
//       />
//       {/* <Link
//         href={`${username}/members/${member.username}`}
//         className={`text-middle link ${styles.text}`}
//       >{member.username}</Link> */}
//       <span>{member.username}</span>
//     </div>
//     <div className={styles.editButtons}>
//       <span className={`text-middle ${styles.approvedStatus} ${!isApproved ? styles.isNotApproved : ''}`}>{`${!isApproved ? 'Not approved': 'Approved'}`}</span>
//       <div className={styles.editButton} onClick={() => onEditProviderButtonClick(member.username)}>
//         <EditIcon className={styles.editIcon} />
//       </div>
//       <div className={styles.editButton} onClick={() => handleRemoveMember(index)}>
//         <RemoveIcon className={styles.removeIcon} />
//       </div>
//     </div>
//   </li>
//   )
// })}
