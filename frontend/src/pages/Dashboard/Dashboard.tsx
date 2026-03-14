import Navbar from "../../components/Navbar/Navbar";
import styles from "./Dashboard.module.css";
import titleStyles from "./../../components/CSS Components/titles.module.css";

function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <Navbar></Navbar>
      <h1 className={titleStyles.pageTitle1}>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
