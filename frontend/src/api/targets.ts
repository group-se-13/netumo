const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getTargets = async () => {
  const res = await fetch(`${BASE_URL}/targets/`);
  return await res.json();
};

export const addTarget = async (target: { url: string; name: string }) => {
  const res = await fetch(`${BASE_URL}/targets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(target),
  });
  return await res.json();
};

export const updateTarget = async (id: number, target: { url: string; name: string; active: boolean }) => {
  const res = await fetch(`${BASE_URL}/targets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(target),
  });
  if (!res.ok) {
    throw new Error(`Failed to update target with id ${id}`);
  }
  return await res.json();
};

export const deleteTarget = async (id: number) => {
  const res = await fetch(`${BASE_URL}/targets/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete target with id ${id}`);
  }
  return;
};

/**
 * Fetch monitoring results with optional targetId, limit, and offset for pagination.
 * @param targetId Optional target ID to filter results.
 * @param limit Optional limit for number of results per page (default e.g. 50).
 * @param offset Optional offset for pagination.
 */
export const getMonitoringResults = async (
  targetId?: number,
  limit: number = 50,
  offset: number = 0
) => {
  const params = new URLSearchParams();

  if (targetId !== undefined) params.append("target_id", targetId.toString());
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const url = `${BASE_URL}/results/?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch monitoring results: ${res.statusText}`);
  }

  return await res.json();
};
