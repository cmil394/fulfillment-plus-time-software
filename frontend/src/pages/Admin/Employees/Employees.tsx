import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import styles from "./Employees.module.css";
import tableStyles from "./../../../components/CSS Components/titles.module.css";
import { authService } from "../../../services/auth.service";
import type { User } from "../../../services/auth.service";

type Tab = "employees" | "pending";
type SortField =
  | "index"
  | "firstName"
  | "lastName"
  | "email"
  | "role"
  | "createdAt";
type SortDir = "asc" | "desc";

function Employees() {
  const [activeTab, setActiveTab] = useState<Tab>("employees");
  const [employees, setEmployees] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [employeeOrder, setEmployeeOrder] = useState<Map<string, number>>(
    new Map(),
  );
  const [pendingOrder, setPendingOrder] = useState<Map<string, number>>(
    new Map(),
  );
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [empSortField, setEmpSortField] = useState<SortField>("index");
  const [empSortDir, setEmpSortDir] = useState<SortDir>("asc");
  const [pendingSortField, setPendingSortField] = useState<SortField>("index");
  const [pendingSortDir, setPendingSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    if (activeTab === "employees") {
      setLoading(true);
      const fetchEmployees = async () => {
        try {
          const response = await authService.getAllAcceptedUsers();
          const users = response.data.users ?? response.data ?? [];
          setEmployees(users);
          setEmployeeOrder(
            new Map(users.map((u: User, i: number) => [u.id, i + 1])),
          );
        } catch (err) {
          console.error("Failed to fetch employees:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployees();
    }

    if (activeTab === "pending") {
      setLoading(true);

      const fetchPendingUsers = async () => {
        try {
          const response = await authService.getPendingUsers();
          const users = response.data.users;
          setPendingUsers(users);
          setPendingOrder(
            new Map(users.map((u: User, i: number) => [u.id, i + 1])),
          );
        } catch (err) {
          console.error("Failed to fetch pending users:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchPendingUsers();
    }
  }, [activeTab]);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await authService.approveUser(userId);
      // Remove from pending list after approval
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to approve user:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    try {
      await authService.rejectUser(userId);
      // Remove from pending list after rejection
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to reject user:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const makeHandleSort =
    (
      currentField: SortField,
      setField: (f: SortField) => void,
      currentDir: SortDir,
      setDir: (d: SortDir) => void,
    ) =>
    (field: SortField) => {
      if (currentField === field) {
        setDir(currentDir === "asc" ? "desc" : "asc");
      } else {
        setField(field);
        setDir("asc");
      }
    };

  const handleEmpSort = makeHandleSort(
    empSortField,
    setEmpSortField,
    empSortDir,
    setEmpSortDir,
  );
  const handlePendingSort = makeHandleSort(
    pendingSortField,
    setPendingSortField,
    pendingSortDir,
    setPendingSortDir,
  );

  const sortUsers = (
    users: User[],
    field: SortField,
    dir: SortDir,
    orderMap: Map<string, number>,
  ): User[] => {
    return [...users].sort((a, b) => {
      const valA =
        field === "index" ? orderMap.get(a.id)! : a[field as keyof User];
      const valB =
        field === "index" ? orderMap.get(b.id)! : b[field as keyof User];
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
  };

  const sortedEmployees = sortUsers(
    employees,
    empSortField,
    empSortDir,
    employeeOrder,
  );
  const sortedPending = sortUsers(
    pendingUsers,
    pendingSortField,
    pendingSortDir,
    pendingOrder,
  );

  const SortIcon = ({
    field,
    activeField,
    dir,
  }: {
    field: SortField;
    activeField: SortField;
    dir: SortDir;
  }) => (
    <span className={styles.sortIcon}>
      {field === activeField ? (dir === "asc" ? " 🠕" : " 🠗") : " ↕"}
    </span>
  );

  const SortableTh = ({
    field,
    activeField,
    dir,
    onSort,
    children,
  }: {
    field: SortField;
    activeField: SortField;
    dir: SortDir;
    onSort: (f: SortField) => void;
    children: React.ReactNode;
  }) => (
    <th onClick={() => onSort(field)} className={styles.sortableTh}>
      {children}
      <SortIcon field={field} activeField={activeField} dir={dir} />
    </th>
  );

  return (
    <div className={styles.employeesContainer}>
      <Navbar />
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2 className={tableStyles.pageTitle1}>Employees</h2>
          <h3 className={styles.tableCount}>
            {activeTab === "employees"
              ? `${employees.length} Employee${employees.length !== 1 ? "s" : ""}`
              : `${pendingUsers.length} Pending`}
          </h3>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "employees" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("employees")}
          >
            Employees
          </button>
          <button
            className={`${styles.tab} ${activeTab === "pending" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending employees
          </button>
        </div>

        {activeTab === "employees" && (
          <>
            {loading ? (
              <p>Loading employees...</p>
            ) : employees.length === 0 ? (
              <p>No employees found</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <SortableTh
                      field="index"
                      activeField={empSortField}
                      dir={empSortDir}
                      onSort={handleEmpSort}
                    >
                      #
                    </SortableTh>
                    <SortableTh
                      field="firstName"
                      activeField={empSortField}
                      dir={empSortDir}
                      onSort={handleEmpSort}
                    >
                      First Name
                    </SortableTh>
                    <SortableTh
                      field="lastName"
                      activeField={empSortField}
                      dir={empSortDir}
                      onSort={handleEmpSort}
                    >
                      Last Name
                    </SortableTh>
                    <SortableTh
                      field="email"
                      activeField={empSortField}
                      dir={empSortDir}
                      onSort={handleEmpSort}
                    >
                      Email
                    </SortableTh>
                    <SortableTh
                      field="role"
                      activeField={empSortField}
                      dir={empSortDir}
                      onSort={handleEmpSort}
                    >
                      Role
                    </SortableTh>
                    <SortableTh
                      field="createdAt"
                      activeField={empSortField}
                      dir={empSortDir}
                      onSort={handleEmpSort}
                    >
                      Date Registered
                    </SortableTh>
                    <th>Overview</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employeeOrder.get(employee.id)}.</td>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>
                        <span className={styles.roleBadge}>
                          {employee.role}
                        </span>
                      </td>
                      <td>
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button>Overview</button>
                      </td>
                      <td>
                        <button>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === "pending" && (
          <div>
            {loading ? (
              <p>Loading pending users...</p>
            ) : pendingUsers.length === 0 ? (
              <p>No pending users</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <SortableTh
                      field="index"
                      activeField={pendingSortField}
                      dir={pendingSortDir}
                      onSort={handlePendingSort}
                    >
                      #
                    </SortableTh>
                    <SortableTh
                      field="firstName"
                      activeField={pendingSortField}
                      dir={pendingSortDir}
                      onSort={handlePendingSort}
                    >
                      First Name
                    </SortableTh>
                    <SortableTh
                      field="lastName"
                      activeField={pendingSortField}
                      dir={pendingSortDir}
                      onSort={handlePendingSort}
                    >
                      Last Name
                    </SortableTh>
                    <SortableTh
                      field="email"
                      activeField={pendingSortField}
                      dir={pendingSortDir}
                      onSort={handlePendingSort}
                    >
                      Email
                    </SortableTh>
                    <SortableTh
                      field="role"
                      activeField={pendingSortField}
                      dir={pendingSortDir}
                      onSort={handlePendingSort}
                    >
                      Role
                    </SortableTh>
                    <SortableTh
                      field="createdAt"
                      activeField={pendingSortField}
                      dir={pendingSortDir}
                      onSort={handlePendingSort}
                    >
                      Date Registered
                    </SortableTh>
                    <th>Status</th>
                    <th>Approve</th>
                    <th>Reject</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPending.map((user) => (
                    <tr key={user.id}>
                      <td>{pendingOrder.get(user.id)}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={styles.roleBadge}>{user.role}</span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span>{user.status}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? "..." : "Approve"}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleReject(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? "..." : "Reject"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;
