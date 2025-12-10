// ============================================================
// PAY54 v7.0 • Session Manager
// Simple localStorage demo session
// ============================================================
window.PAY54 = window.PAY54 || {};
const P = window.PAY54;

const SESSION_KEY = "pay54_demo_session";

P.session = {
  login(emailOrPhone) {
    const payload = {
      userId: P.user.id,
      email: emailOrPhone,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    return payload;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  get() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  require(onMissingRedirect) {
    const s = this.get();
    if (!s && onMissingRedirect) {
      window.location.href = onMissingRedirect;
    }
    return s;
  }
};

