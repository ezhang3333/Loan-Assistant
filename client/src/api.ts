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

export const api = {
  getUsers: <T,>(qs = '') => getJson<T>(`/api/users${qs}`),
  addUser: <T,>(u: unknown) => postJson<T>('/api/users/add', u),
  updateUser: <T,>(u: unknown) => postJson<T>('/api/users/update', u),
  deleteUser: <T,>(user_id: number) => postJson<T>('/api/users/delete', { user_id }),

  getLoans: <T,>(qs = '') => getJson<T>(`/api/loans${qs}`),
  getBanks: <T,>(qs = '') => getJson<T>(`/api/banks${qs}`),
  getAnalytics: <T,>(query: string) => getJson<T>(`/api/analytics?query=${query}`)
};
