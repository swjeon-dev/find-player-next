import Link from 'next/link'

import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles['header']}>
      <h1 className={styles['title']}>
        <Link href='/' className={styles['home-link']}>
          Find Football Player
        </Link>
      </h1>
      <div className={styles['sub-container']}>
        <span className={styles['text']}>
          <span className={styles['original-label']}>original: </span>
          <a
            href='https://playfootball.games/who-are-ya/big-4/'
            target='_blank'
            className={styles['reference-link']}
          >
            https://playfootball.games/who-are-ya/big-4/
          </a>
        </span>
      </div>
    </header>
  )
}

export default Header
