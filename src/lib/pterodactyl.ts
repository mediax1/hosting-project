const BASE = process.env.PTERODACTYL_URL!;
const KEY = process.env.PTERODACTYL_APP_KEY!;

async function ptero(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}/api/application${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pterodactyl error ${res.status}: ${err}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function createPteroUser(discordId: string, username: string, email: string) {
  const data = await ptero("/users", {
    method: "POST",
    body: JSON.stringify({
      external_id: discordId,
      username: `user_${discordId}`,
      email: email ?? `${discordId}@dynexus.space`,
      first_name: username,
      last_name: "User",
      password: crypto.randomUUID(),
    }),
  });
  return data.attributes;
}

export async function getPteroUserByExternalId(discordId: string) {
  try {
    const data = await ptero(`/users/external/${discordId}`);
    return data.attributes;
  } catch {
    return null;
  }
}

export async function getPteroUserByEmail(email: string) {
  try {
    const data = await ptero(`/users?filter[email]=${encodeURIComponent(email)}`);
    const match = data.data.find((u: { attributes: { email: string } }) => u.attributes.email === email);
    return match ? match.attributes : null;
  } catch {
    return null;
  }
}

export async function createPteroServer({
  name,
  pteroUserId,
  language,
  plan,
}: {
  name: string;
  pteroUserId: number;
  language: "nodejs" | "python";
  plan: { ram: number; cpu: number; storage: number };
}) {
  const eggId = language === "python"
    ? Number(process.env.PTERO_EGG_PYTHON_ID)
    : Number(process.env.PTERO_EGG_NODEJS_ID);

  const image = language === "python"
    ? process.env.PTERO_EGG_PYTHON_IMAGE!
    : process.env.PTERO_EGG_NODEJS_IMAGE!;

  const eggData = await ptero(`/nests/${process.env.PTERO_NEST_ID}/eggs/${eggId}?include=variables`);
  const startupVars: Record<string, string> = {};
  for (const v of eggData.attributes.relationships.variables.data) {
    startupVars[v.attributes.env_variable] = v.attributes.default_value;
  }

  const data = await ptero("/servers", {
    method: "POST",
    body: JSON.stringify({
      name,
      user: pteroUserId,
      egg: eggId,
      docker_image: image,
      startup: eggData.attributes.startup,
      environment: startupVars,
      limits: {
        memory: plan.ram,
        swap: 0,
        disk: plan.storage,
        io: 500,
        cpu: plan.cpu,
      },
      feature_limits: {
        databases: 0,
        backups: 0,
        allocations: 1,
      },
      allocation: {
        default: await getAvailableAllocation(),
      },
    }),
  });

  return data.attributes;
}

async function getAvailableAllocation(): Promise<number> {
  const nodeId = process.env.PTERO_NODE_ID!;
  const data = await ptero(`/nodes/${nodeId}/allocations?per_page=100`);
  const free = data.data.find((a: { attributes: { assigned: boolean } }) => !a.attributes.assigned);
  if (!free) throw new Error("No free allocations available on this node.");
  return free.attributes.id;
}

export async function deletePteroServer(pteroServerId: number) {
  await ptero(`/servers/${pteroServerId}/force`, { method: "DELETE" });
}

export async function setPteroUserPassword(pteroUser: { id: number; email: string; username: string; first_name: string; last_name: string }, password: string) {
  const data = await ptero(`/users/${pteroUser.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      email: pteroUser.email,
      username: pteroUser.username,
      first_name: pteroUser.first_name,
      last_name: pteroUser.last_name,
      password,
    }),
  });
  return data.attributes;
}