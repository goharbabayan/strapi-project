import { forwardRef } from 'react';

const InfoMessage = forwardRef(({className, text}, ref) => {
  return (
    <div className={className} ref={ref}>
      <span>{text}</span>
    </div>
  )
});

export default InfoMessage;
