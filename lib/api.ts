import axios, { AxiosInstance } from "axios";
import Constants from "expo-constants";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ||
  "http://127.0.0.1:8000";

export function createApi(getToken: () => string | null): AxiosInstance {
  const c = axios.create({
    baseURL,
    timeout: 120000,
    headers: { "Content-Type": "application/json" },
  });
  c.interceptors.request.use((config) => {
    const t = getToken();
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  });
  return c;
}

export type JobRow = {
  job_id: string;
  url: string;
  title: string | null;
  site: string | null;
  location: string | null;
  fit_score: number | null;
  score_reasoning: string | null;
  full_description: string | null;
  tailored_resume_path: string | null;
  cover_letter_path: string | null;
  applied_at: string | null;
  apply_status: string | null;
};
