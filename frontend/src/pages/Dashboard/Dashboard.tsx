import Navbar from "../../components/Navbar/Navbar";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <Navbar></Navbar>
      <h1 className={styles.dashboardTitle}>Dashborad page</h1>
    </div>
  );
}

export default Dashboard;
