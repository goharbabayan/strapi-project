import React, { useState } from 'react';
import LinkIcon from '@/components/icons/LinkIcon';
import styles from './copyLinkButton.module.css';
import Button from '@/components/button/Button';

export default function CopyLinkButton() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyButtonClick = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);

      setIsCopied(true);
      setTimeout(() => 
        setIsCopied(false)
      , 2000);
    } catch (error) {
      console.error('Error copying text: ', error);
    }
  };

  return (
    <Button
      onClick={handleCopyButtonClick}
      className={styles.copyButton}
      Icon={<LinkIcon />}
    >
      {isCopied ? 'Copied!' : 'Copy Profile Link'}
    </Button>
  );
};
