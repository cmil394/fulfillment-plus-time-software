import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.tsx";
import TasksModal from "../../components/TasksModal/TasksModal.tsx";
import styles from "./Tasks.module.css";
import titleStyles from "./../../components/CSS Components/titles.module.css";

function Tasks() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  if (!customerId) return <p>Invalid customer.</p>;

  return (
    <div className={styles.landingContainer}>
      <Navbar />
      <h1 className={titleStyles.pageTitle1}>Tasks</h1>
      <TasksModal
        customerId={customerId}
        onBack={() => navigate("/customers")}
      />
    </div>
  );
}

export default Tasks;
