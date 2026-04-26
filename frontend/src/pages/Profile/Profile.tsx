import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { authService } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import styles from "./Profile.module.css";
import titleStyles from "../../components/CSS Components/titles.module.css";

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [showPwForm, setShowPwForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    authService.getProfile().then((res) => setUser(res.data.user));
  }, []);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  const formatDate = (iso: string) => {
    const y = iso.slice(0, 4);
    const m = iso.slice(5, 7);
    const d = iso.slice(8, 10);
    return `${d}-${m}-${y}`;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (newPassword !== confirmNewPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }

    setPwLoading(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setPwSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPwForm(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update password.";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  const handleCancelPw = () => {
    setShowPwForm(false);
    setPwError("");
    setPwSuccess("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <h1 className={titleStyles.pageTitle1}>Profile</h1>

      <div className={styles.card}>
        {/* Avatar + name + role */}
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>{initials}</div>
          <p className={styles.fullName}>{user?.fullName ?? ""}</p>
          <span className={styles.badge}>{user?.role ?? ""}</span>
        </div>

        <hr className={styles.divider} />

        {/* Info rows */}
        <div className={styles.rows}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Status</span>
            <span className={styles.rowValue}>{user?.status ?? "—"}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Registered</span>
            <span className={styles.rowValue}>
              {user ? formatDate(user.createdAt) : "—"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Employee Code</span>
            <span className={styles.rowValue}>{user?.employeeCode ?? "—"}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>PIN</span>
            <span className={styles.rowValue}>••••</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Password</span>
            <span className={styles.rowValue}>••••••••</span>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.changePwRow} ${showPwForm ? styles.changePwRowOpen : ""}`}
          onClick={() => setShowPwForm((v) => !v)}
        >
          <span>{showPwForm ? "Cancel" : "Change password"}</span>
          <span className={styles.changePwArrow}>{showPwForm ? "✕" : "→"}</span>
        </button>

        {/* Inline change-password form */}
        {showPwForm && (
          <form className={styles.pwForm} onSubmit={handleChangePassword}>
            <div className={styles.pwFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className={styles.input}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="confirmNewPassword">
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  className={styles.input}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {pwError && <p className={styles.error}>{pwError}</p>}
            {pwSuccess && <p className={styles.success}>{pwSuccess}</p>}

            <div className={styles.pwActions}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={pwLoading}
              >
                {pwLoading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancelPw}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {pwSuccess && !showPwForm && (
          <p className={styles.success}>{pwSuccess}</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
