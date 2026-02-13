import Navbar from "../../components/Navbar/Navbar.tsx";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.home}>
      <Navbar />
      <div className={styles.brand}>
        <img
          src="/src/assets/icons/test1.png"
          alt="Fulfillment Plus Logo"
          className={styles.brandLogo}
        />
        <h1 className={styles.title}>
          Fulfillment <span className={styles.plus}>Plus</span>
        </h1>
        <h4 className={styles.subtitle}>Time Logging Software</h4>
      </div>
    </div>
  );
}

export default Home;
