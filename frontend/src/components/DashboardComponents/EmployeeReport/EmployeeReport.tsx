import { useState } from "react";
import { Download } from "lucide-react";
import styles from "./EmployeeReport.module.css";
import { reportService } from "../../../services/report.service";

export default function EmployeeReport() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const [year, mon] = month.split("-").map(Number);
      const pad = (n: number) => String(n).padStart(2, "0");
      const start = `${year}-${pad(mon)}-01`;
      const lastDay = new Date(year, mon, 0).getDate();
      const end = `${year}-${pad(mon)}-${pad(lastDay)}`;
      const { blob, filename } = await reportService.downloadEmployeeReport(
        start,
        end,
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.root}>
      <input
        type="month"
        className={styles.monthInput}
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <button
        className={styles.downloadBtn}
        onClick={handleDownload}
        disabled={downloading}
      >
        <Download size={13} />
        {downloading ? "Generating…" : "Download Report"}
      </button>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
