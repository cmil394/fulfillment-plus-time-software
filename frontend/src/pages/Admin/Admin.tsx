import styles from "./Admin.module.css";
import Navbar from "../../components/Navbar/Navbar";

function Admin() {
  return (
    <div className={styles.adminPage}>
      <Navbar />
    </div>
  );
}

export default Admin;
