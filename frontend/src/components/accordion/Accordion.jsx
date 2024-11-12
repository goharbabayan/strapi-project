'use client'

import { useRef, useState } from 'react';
import styles from './accordion.module.css';
import Text from '../text/Text';

export default function AccordionSection ({data, infoSectionIsNotEmpty}) {
  const [rotatedElementIndex, setRotatedElementIndex] = useState(false);
  const buttonRefs = useRef([]);
  const answerRefs = useRef([]);

  const handleAccordionButtonClick = (index) => {
    if (rotatedElementIndex === index) {
      setRotatedElementIndex(false);
    } else {
      setRotatedElementIndex(index);
    };
  };

  const isAtLeastOneAccordionItemExists = data && Array.isArray(data) && data.some(accordion => accordion.title !== null && accordion.text !== null);
  return (
    <>
      {isAtLeastOneAccordionItemExists &&
        <div className={`${styles.container} ${infoSectionIsNotEmpty ? '' : styles.fullWidth}`}>
          {data.map((accordion, index) => {
            const {title, text} = accordion;
            return title && text
            ?
              (<div className={styles.accordionItem} key={index}>
                <div className={styles.question} onClick={() => handleAccordionButtonClick(index)}>
                  <Text
                    tag={'h3'}
                    className={styles.title}
                    children={title}
                  />
                  <span className={`${styles.button} ${index === rotatedElementIndex ? styles.rotated : ''}`} ref={(el) => (buttonRefs.current[index] = el)}></span>
                </div>
                {/* ToDo: check if the ref attribute is required here? */}
                <div ref={(el) => (answerRefs.current[index] = el)} className={`${styles.answer} ${index === rotatedElementIndex ? styles.expanded : ''}`}>
                  <Text
                    tag={'p'}
                    className={`${styles.text}`}
                    children={text}
                  />
                </div>
              </div>)
            :
            // ToDo: Render an empty Fragment instead of a Div tag
              <div key={index} hidden></div>
          })}
        </div>
      }
    </>
  )
}
