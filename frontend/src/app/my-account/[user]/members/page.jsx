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

export default function Members ({email, id, user}) {
  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const [members, setMembers] = useState(null);
  const [showSuccessfullRemoveMessage, setShowSuccessfullRemoveMessage] = useState(false);
  const [removeMemberText, setRemoveMemberText] = useState({text: ''});

  useEffect(() => {
    const managerToken = JSON.parse(localStorage.getItem('token'));
    const fetchURL = `${strapiBaseUrl}/api/users?filters[managerID][$eq]=${id}`;
    user && useFetchData(fetchURL, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${managerToken}`
      }
    }).then(data => setMembers(data));
  }, [showSuccessfullRemoveMessage])

  const navigateToNewMember = () => {
    navigate(`/my-account/${user}/new-member?email=${email}&id=${id}`);
  }

  const handleEditIconClick = (username) => {
    navigate(`/my-account/${user}/members/${username}`);
  }

  const confirmRemoving = () => {
    let text = "Are you sure you want to delete the escort?\nChoose Yes or Cancel.";
    return confirm(text) == true;
  }

  const handleRemoveMember = async (index) => {
    const shouldBeDeleted = confirmRemoving();

    if(!shouldBeDeleted) return;
    const memberToken = process.env.NEXT_PUBLIC_API_TOKEN_MEMBER;
    const id = members[index].id;

    memberToken && id &&
      useFetchData(`${strapiBaseUrl}/api/members/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(id),
        headers: {
          'Content-type': 'application/json',
          'authorization': `Bearer ${memberToken}`
        }
      }).then(data => {
          if (data.error || data.errors) {
            const errorMessage = data.error.message;
            console.error(errorMessage);
          } else {
            setShowSuccessfullRemoveMessage(true);
            setRemoveMemberText({text: `${members[index].username} was successfully removed from your escorts list.`});
            setTimeout(() => {
              setShowSuccessfullRemoveMessage(false);
            }, 5000)
          }
        });
  }

  return (
    <div className="page-width">
      <section className={`${styles.section}`}>
        <div className={`${styles.container} ${styles.buttonsWrap}`}>
          <Button
            children={'Create new escort'}
            onClick={navigateToNewMember}
            variant={'general'}
          />
        </div>
      </section>
      <section>
        <div className={`${styles.container}`}>
          <Text
            tag={'h2'}
            className={'title'}
            children={'My escorts'}
          />
          {!members && <Loading className={styles.loading} />}
          {members && members.length > 0 &&
            <ul className={`${styles.list} unstyled-list`}>
              {members.map((member, index) => {
                const isApproved = member.isApprovedByAdmin;
                return (
                <li key={index} className={styles.membersList}>
                  <div className={styles.memberName}>
                    <Text
                      tag={'span'}
                      className={'text-small'}
                      children={index+1}
                    />
                    <Link
                      href={`${user}/members/${member.username}`}
                      className={`text-middle link ${styles.text}`}
                    >{member.username}</Link>
                  </div>
                  <div className={styles.editButtons}>
                    <span className={`text-middle ${styles.approvedStatus} ${!isApproved ? styles.isNotApproved : ''}`}>{`${!isApproved ? 'Not approved': 'Approved'}`}</span>
                    <div className={styles.editButton} onClick={() => handleEditIconClick(member.username)}>
                      <EditIcon className={styles.editIcon} />
                    </div>
                    <div className={styles.editButton} onClick={() => handleRemoveMember(index)}>
                      <RemoveIcon className={styles.removeIcon} />
                    </div>
                  </div>
                </li>
                )
              })}
            </ul>
          }
          {showSuccessfullRemoveMessage &&
            <span className='successMessage show'>
              {removeMemberText.text ? removeMemberText.text : ''}
            </span>
          }
          {members && members.length === 0 &&
            <Text
              tag={'h4'}
              className={'text-middle'}
              children={`You don't have escorts yet.`}
            />
          }
        </div>
      </section>
    </div>
  )
}
