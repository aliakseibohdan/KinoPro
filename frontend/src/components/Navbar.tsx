import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      {/* Можно заменить src на ваш логотип */}
      <span className={styles.title}>NETFLIX</span>
    </div>
  );
}