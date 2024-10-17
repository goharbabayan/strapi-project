'use client'

import { useState, useEffect } from 'react';
import styles from './members.module.css';
import Text from '@/components/text/Text';
import Button from '@/components/button/Button';
import { navigate } from '@/app/actions';
import EditIcon from '@/components/icons/Edit';
import RemoveIcon from '@/components/icons/RemoveIcon';
import Loading from '@/app/loading';

export default function Members ({params, searchParams}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const { user } = params;
  const { email, id } = searchParams;
  const [members, setMembers] = useState(null);
  const [showSuccessfullRemoveMessage, setShowSuccessfullRemoveMessage] = useState(false);
  const [removeMemberText, setRemoveMemberText] = useState({text: ''});
  
  useEffect(() => {
    const token = JSON.parse(window.localStorage.getItem('token'));
    // todo: change
    user && fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[managerID][$eq]=${id}&populate[role][fields]&populate[profilePicture][fields]&populate[coverPhoto][fields]&populate[photos][fields]&populate[selfies][fields]&populate[interests][fields]&populate[wishlist][fields]&populate[favouriteThings][fields]&populate[digitalServices][fields]&populate[incallRates][fields]&populate[outcallRates][fields]&populate[services][fields]&populate[schedule][fields]&populate[additionalInfo][fields]&populate[reviews][fields]&populate[outfits][fields]&populate[makeup][fields]&populate[costume][fields]&populate[extras][fields]`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setMembers(data);
      });
  }, [showSuccessfullRemoveMessage])

  const navigateToDashboard = () => {
    navigate(`/my-account/${user}`);
  }

  const navigateToNewmber = () => {
    navigate(`/my-account/${user}/new-member?email=${email}&id=${id}`);
  }

  const handleEditIconClick = (username) => {
    navigate(`members/${username}`);
  }

  const handleRemoveMember = async (index) => {
    const memberToken = process.env.NEXT_PUBLIC_API_TOKEN_MEMBER;
    const id = members[index].id;
    // const updatedMembersListFormData = membersList.filter((member, index) => index != formDataIndex);
    memberToken && id &&
      await fetch(`${baseUrl}/api/members/${id}`, {
          method: 'DELETE',
          body: JSON.stringify(id),
          headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${memberToken}`
          }
        })
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data.error || data.errors) {
            const errorMessage = data.error.message;
          } else {
            setShowSuccessfullRemoveMessage(true);
            setRemoveMemberText({text: `${members[index].username} was successfully removed from your members list.`});
            setTimeout(() => {
              setShowSuccessfullRemoveMessage(false);
            }, 5000)
          }
        });

  }

  return (
    <div>
      <section className={`${styles.section} page-width`}>
        <div className={`${styles.container} ${styles.buttonsWrap}`}>
          <Button children={'Back to dashboard'} onClick={navigateToDashboard} className='btn button'/>
          <Button children={'Create new member'} onClick={navigateToNewmber} className='btn button'/>
        </div>
      </section>
      <section className={`page-width`}>
        <div className={`${styles.container}`}>
          <Text
            tag={'h2'}
            className={'title'}
            children={'My members'}
          />
                    
          {!members &&
           <Loading className={styles.loading}/>
          }
          {members && members.length > 0 &&
            <ul className={`${styles.list} unstyled-list`}>
              {members.map((member, index) => {
                const isAproved = member.isApprovedByAdmin;
                return (
                <li key={index} className={styles.membersList}>
                  <div className={styles.memberName}>
                    <Text
                      tag={'span'}
                      className={'text-small'}
                      children={index+1}
                    />
                    <Button
                      href={`members/${member.username}`}
                      children={
                        <Text
                          tag={'h4'}
                          className={'text-middle'}
                          children={member.username}
                        />
                      }
                      className='unstyled-anchor'
                  />
                  </div>
                  <div>
                    <h3 className={'text-middle'}>Is approved by Admin:</h3>
                    <span className={'text-middle'}>{isAproved.toString()}</span>
                  </div>
                  <div className={styles.editButtons}>
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
              children={`You don't have members yet.`}
            />
          }
        </div>
      </section>
    </div>
  )
}
