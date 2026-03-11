import { useEffect, useState, useRef } from "react";
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
  const [activeTimers, setActiveTimers] = useState<Record<number, number>>({});
  const [expandedDesc, setExpandedDesc] = useState<Record<number, boolean>>({});
  const intervalRefs = useRef<Record<number, ReturnType<typeof setInterval>>>(
    {},
  );

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

    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, [customerId]);

  const handleStart = (taskId: number) => {
    setActiveTimers((prev) => ({ ...prev, [taskId]: 0 }));
    intervalRefs.current[taskId] = setInterval(() => {
      setActiveTimers((prev) => ({
        ...prev,
        [taskId]: (prev[taskId] ?? 0) + 1,
      }));
    }, 1000);
  };

  const handleStop = (taskId: number) => {
    clearInterval(intervalRefs.current[taskId]);
    delete intervalRefs.current[taskId];
    setActiveTimers((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
  };

  const toggleDesc = (taskId: number) => {
    setExpandedDesc((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const filtered = tasks.filter((t) =>
    (t.name ?? "").toLowerCase().includes(search.toLowerCase()),
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
              <p className={styles.taskTitle}>{task.name}</p>
              {expandedDesc[task.id] && task.description && (
                <p className={styles.taskDesc}>{task.description}</p>
              )}
            </div>

            <div className={styles.taskActions}>
              {task.description && (
                <button
                  className={styles.descBtn}
                  onClick={() => toggleDesc(task.id)}
                  title="Toggle description"
                >
                  {expandedDesc[task.id] ? "▲" : "▼"}
                </button>
              )}

              {activeTimers[task.id] !== undefined ? (
                <>
                  <span className={styles.timer}>
                    {formatTime(activeTimers[task.id])}
                  </span>
                  <button
                    className={styles.stopBtn}
                    onClick={() => handleStop(task.id)}
                  >
                    Stop
                  </button>
                </>
              ) : (
                <button
                  className={styles.startBtn}
                  onClick={() => handleStart(task.id)}
                >
                  Start
                </button>
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
