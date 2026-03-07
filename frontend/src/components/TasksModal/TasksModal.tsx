import { useEffect, useState } from "react";
import { taskService } from "../../services/task.service.ts";
import type { Task } from "../../services/task.service.ts";
import styles from "./TasksModal.module.css";
import backarrow from "../../assets/icons/backarrow.svg";

interface Props {
  customerId: string;
  onBack: () => void;
}

function TasksModal({ customerId, onBack }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getByCustomer(customerId);
        setTasks(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [customerId]);

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.board}>
      <div className={styles.topRow}>
        <button onClick={onBack} className={styles.backBtn}>
          <img src={backarrow} alt="back" className={styles.backArrow} />
          Back
        </button>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchBar}
        />
      </div>
      {filtered.length === 0 ? (
        <div className={styles.taskCard}>
          <p className={styles.taskTitle}>No tasks found.</p>
        </div>
      ) : (
        filtered.map((task) => (
          <div key={task.id} className={styles.taskCard}>
            <div className={styles.taskInfo}>
              <p className={styles.taskTitle}>{task.title}</p>
              {task.description && (
                <p className={styles.taskDesc}>{task.description}</p>
              )}
            </div>
            <span className={styles.taskStatus}>{task.status}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default TasksModal;
