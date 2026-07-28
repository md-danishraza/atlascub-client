import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Clerk token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Because we are running in the browser, we can access the global Clerk object.
      // This is much safer and more reliable than dynamically importing the server-side getToken.

      let token = null;

      // 🛡️ FIX: Use the window.Clerk object provided by <ClerkProvider>
      // We pass NO arguments to session.getToken(), which automatically
      // requests the default Session Token (the one containing your names/email)
      if (
        typeof window !== "undefined" &&
        window.Clerk &&
        window.Clerk.session
      ) {
        token = await window.Clerk.session.getToken();
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Session Token added to headers");
      } else {
        console.warn("⚠️ No token available - user may not be signed in");
      }
    } catch (error) {
      console.error("❌ Failed to get Clerk token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data
    );
    if (error.response?.status === 401) {
      console.error("Unauthorized - please sign in again");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
