import AsyncStorage from '@react-native-async-storage/async-storage';

const CONFIG_KEY = 'pa_config';
const SESSION_KEY = 'pa_session';

export interface Config {
  serverUrl: string;
}

export interface Post {
  id: number;
  body: string;
  date: string;
  comments: Comment[];
  labels: Label[];
  periods: Period[];
}

export interface Comment {
  id: number;
  date: string;
  body: string;
  post_id: number;
}

export interface Label {
  id: number;
  name: string;
}

export interface Period {
  id: number;
  name: string;
}

export interface MonthEntry {
  ym: string;
  m: string;
  y: string;
  count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  skip: number;
}

async function getBaseUrl(): Promise<string> {
  const raw = await AsyncStorage.getItem(CONFIG_KEY);
  if (!raw) throw new Error('Server URL not configured');
  const config: Config = JSON.parse(raw);
  return config.serverUrl.replace(/\/$/, '');
}

async function getToken(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const session = JSON.parse(raw);
  return session.accessToken ?? null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const [baseUrl, token] = await Promise.all([getBaseUrl(), getToken()]);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

// Auth
export async function login(email: string, password: string): Promise<{ accessToken: string }> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/authentication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, strategy: 'local' }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return data;
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

// Posts
export async function getPosts(params: { $limit?: number; $skip?: number; search?: string } = {}): Promise<PaginatedResponse<Post>> {
  const parts = [
    `$limit=${params.$limit ?? 30}`,
    `$skip=${params.$skip ?? 0}`,
    `$sort[date]=-1`,
  ];
  if (params.search) parts.push(`body[$like]=%${params.search}%`);
  return request<PaginatedResponse<Post>>(`/posts?${parts.join('&')}`);
}

export async function getPost(id: number): Promise<Post> {
  return request<Post>(`/posts/${id}`);
}

export async function createPost(body: string, date: string): Promise<Post> {
  return request<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify({ body, date }),
  });
}

export async function updatePost(id: number, body: string, date: string): Promise<Post> {
  return request<Post>(`/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ body, date }),
  });
}

// History
export async function getMonths(): Promise<MonthEntry[]> {
  return request<MonthEntry[]>('/posts-history?get=months');
}

export async function getPostsByMonth(ym: string): Promise<Post[]> {
  return request<Post[]>(`/posts-history?ym=${ym}`);
}

export async function getOnThisDay(md: string): Promise<Post[]> {
  return request<Post[]>(`/posts-history?md=${md}`);
}

// Labels
export async function getLabels(): Promise<PaginatedResponse<Label>> {
  return request<PaginatedResponse<Label>>('/labels');
}

// Config
export async function saveConfig(config: Config): Promise<void> {
  await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export async function loadConfig(): Promise<Config | null> {
  const raw = await AsyncStorage.getItem(CONFIG_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function isLoggedIn(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}
