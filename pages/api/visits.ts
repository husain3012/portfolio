import type { NextApiRequest, NextApiResponse } from "next";

type VisitResponse = {
  value: number;
  source: "global" | "local-fallback";
};

const primaryCounterUrl = "https://api.countapi.xyz";
const fallbackCounterUrl = "https://countapi.xyz";
const counterNamespace = "husain3012-portfolio";
const counterKey = "visits";

async function readCounter(baseUrl: string) {
  const response = await fetch(
    `${baseUrl}/get/${counterNamespace}/${counterKey}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Counter read failed: ${response.status}`);
  }

  return (await response.json()) as { value?: number };
}

async function hitCounter(baseUrl: string) {
  const response = await fetch(
    `${baseUrl}/hit/${counterNamespace}/${counterKey}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Counter hit failed: ${response.status}`);
  }

  return (await response.json()) as { value?: number };
}

async function resolveCounter(method: string) {
  const providers = [primaryCounterUrl, fallbackCounterUrl];

  for (const provider of providers) {
    try {
      return method === "POST"
        ? await hitCounter(provider)
        : await readCounter(provider);
    } catch {
      continue;
    }
  }

  throw new Error("No counter provider available");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisitResponse | { error: string }>
) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = await resolveCounter(req.method);
    return res.status(200).json({
      value: typeof payload.value === "number" ? payload.value : 1,
      source: "global",
    });
  } catch {
    return res.status(503).json({ error: "Counter unavailable" });
  }
}