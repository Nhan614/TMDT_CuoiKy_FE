import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleGoHome = () => {
    if (role === "ADMIN") {
      navigate("/dashboard");
    } else {
      navigate("/home");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Icon */}
        <div style={styles.iconWrapper}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="11" stroke="#ef4444" strokeWidth="2" />
            <path
              d="M12 7v6"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.5" r="1" fill="#ef4444" />
          </svg>
        </div>

        {/* Code */}
        <h1 style={styles.code}>403</h1>

        {/* Title */}
        <h2 style={styles.title}>Không có quyền truy cập</h2>

        {/* Description */}
        <p style={styles.description}>
          Bạn không có quyền xem trang này.
          <br />
          Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>

        {/* Role badge */}
        {role && (
          <div style={styles.badge}>
            Vai trò hiện tại:{" "}
            <span style={styles.roleName}>{role}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button style={styles.primaryBtn} onClick={handleGoHome}>
            Về trang chủ
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "1rem",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "3rem 2.5rem",
    maxWidth: "440px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  iconWrapper: {
    marginBottom: "1.25rem",
    display: "flex",
    justifyContent: "center",
  },
  code: {
    fontSize: "5rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #ef4444, #f97316)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 0.5rem 0",
    lineHeight: 1,
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: "0 0 1rem 0",
  },
  description: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    lineHeight: 1.7,
    margin: "0 0 1.5rem 0",
  },
  badge: {
    display: "inline-block",
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "999px",
    padding: "0.35rem 1rem",
    color: "#fca5a5",
    fontSize: "0.85rem",
    marginBottom: "2rem",
  },
  roleName: {
    fontWeight: 700,
    color: "#ef4444",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "0.75rem 1.75rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  secondaryBtn: {
    background: "rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "0.75rem 1.75rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default UnauthorizedPage;
