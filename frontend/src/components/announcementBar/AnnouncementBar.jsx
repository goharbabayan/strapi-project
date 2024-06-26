import styles from './announcementBar.module.css';

export default function AnnouncementBar() {
  // Todo change JS code to react
  function handleClick(e) {
    const type = e.target.dataset.type;
    const providerCards = document.querySelectorAll('.card-image');
    switch (type) {
      case 'close':
        e.target.closest('section').style.display = 'none';
        document.querySelector('header').style.paddingTop = '15px';
        break;
      case 'on':
        providerCards.forEach(card => card.style.filter = 'blur(8px)');
        e.target.classList.add(`${styles.active}`);
        document.querySelector('button[data-type=off]').classList.remove(`${styles.active}`);
        break;
      case 'off':
        providerCards.forEach(card => card.style.filter = 'none');
        e.target.classList.add(`${styles.active}`);
        document.querySelector('button[data-type=on]').classList.remove(`${styles.active}`);
        break;
    }
  }
  return (
    <section className={`${styles.mainWrap}`}>
      <div className={`${styles.container} page-width`}>
        <div className={styles.wrapper}>
          <h5 className={styles.text}>Discreet mode</h5>
          <button className={`${styles.button} ${styles.active}`} data-type="on" onClick={(e) => handleClick(e)}>On</button>
          <button className={`${styles.button}`} data-type="off" onClick={(e) => handleClick(e)}>Off</button>
        </div>
        <button className={styles.button} data-type="close" onClick={(e) => handleClick(e)}>X</button>
      </div>
    </section>
  )
}
