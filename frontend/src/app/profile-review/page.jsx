'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from './layout.jsx';
import styles from './profile-review.module.css';
import { navigate } from '../actions.js';
import Button from '@/components/button/Button.jsx';

export default function ProfileReview({searchParams}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    const token = searchParams.token;
    setToken(token);
    token
      ?
        fetch(`${baseUrl}/api/users/me?populate=*`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            // the token is expired need to login again to update existing token;
            // navigate('/login');
          } else {
            setUser(data);
          }
        })
        .catch(err => console.log('err', err))
      :
        navigate('/login');
  }, [])

  const handleButtonClick = (action) => {
    action === 'decline' ? setIsApproved(false) : setIsApproved(true);
    let formData = {};
    const entriesToRemove = ['id', 'provider', 'confirmed', 'blocked', 'createdAt', 'updatedAt'];
    Object.keys(user).forEach(key => {
      if (!entriesToRemove.includes(key)) {
        formData[key] = user[key];
      }
    });

    user && fetch(`${baseUrl}/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({formData, isApprovedByAdmin: action === 'decline' ? false : true}),
      headers: {
        'Content-type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) {
          console.error('Errors:', data.errors)
        } else {
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 5000)
        }
      });
  }

  return (
    <Layout>
      <div className={`${styles.mainWrap} page-width`}>
        <h2 className={styles.heading}>Profile review</h2>
        {user &&
          <div className={styles.container}>
            <div className={styles.mainInfo}>
              <span>Username: </span>
              <span>{user.username}</span>
              <span>Email: </span>
              <span>{user.email}</span>
            </div>
            <div className={styles.buttons}>
              <Button className={`btn btn_PRIMARY`} onClick={() => handleButtonClick('accept')}>Accept</Button>
              <Button href={`mailto:${user.email}`} className={`btn btn_SECONDARY`} onClick={() => handleButtonClick('decline')}>Decline</Button>
            </div>
            <h4 className={`${styles.message} ${showMessage ? styles.show : ''}`}>
              {isApproved ? 'Request accepted' : 'Request denied'}
            </h4>
          </div>
        }
      </div>
    </Layout>
  )
}
