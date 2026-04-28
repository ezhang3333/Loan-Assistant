async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  return r.json();
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return r.json();
}

async function postJsonOrThrow<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({} as any));
  if (!r.ok) {
    const message = (data && typeof data.error === 'string') ? data.error : `Request failed (${r.status})`;
    throw new Error(message);
  }
  return data as T;
}

export interface SignupPayload {
  username: string;
  password: string;
  gender: string;
  marital_status: string;
  annual_income: number;
  credit_score: number;
  num_loans_taken: number;
  age: number;
  employment_status: string;
  num_existing_loans: number;
  zipcode: number;
  loan_amount_asked: number;
}

export const api = {
  loginUser: <T,>(username: string, password_attempt: string) =>
    postJsonOrThrow<T>('/api/users/login', { username, password_attempt }),
  signupUser: <T,>(payload: SignupPayload) =>
    postJsonOrThrow<T>('/api/users/create', payload),

  getUsers: <T,>(qs = '') => getJson<T>(`/api/users${qs}`),
  addUser: <T,>(u: unknown) => postJson<T>('/api/users/add', u),
  updateUser: <T,>(u: unknown) => postJson<T>('/api/users/update', u),
  deleteUser: <T,>(user_id: number) => postJson<T>('/api/users/delete', { user_id }),

  getLoans: <T,>(qs = '') => getJson<T>(`/api/loans${qs}`),
  getBanks: <T,>(qs = '') => getJson<T>(`/api/banks${qs}`),
  getAnalytics: <T,>(query: string) => getJson<T>(`/api/analytics?query=${query}`)
};
