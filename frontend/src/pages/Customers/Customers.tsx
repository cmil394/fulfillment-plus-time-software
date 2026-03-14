import Navbar from "../../components/Navbar/Navbar.tsx";
import CustomerModal from "../../components/CustomersModal/CustomersModal.tsx";
import styles from "./Customers.module.css";
import titleStyles from "./../../components/CSS Components/titles.module.css";

function Customers() {
  return (
    <div className={styles.landingContainer}>
      <Navbar />
      <h1 className={titleStyles.pageTitle1}>Customers</h1>
      <CustomerModal />
    </div>
  );
}

export default Customers;
