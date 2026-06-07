import { requireAuth } from "../server/auth.js";
import { json, readJson } from "../server/db.js";

const planSchema = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "summary", "kpis", "steps", "atoms", "proofstream"],
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    kpis: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "value"],
        properties: {
          label: { type: "string" },
          value: { type: "string" }
        }
      }
    },
    steps: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "value", "detail"],
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          detail: { type: "string" }
        }
      }
    },
    atoms: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "score", "detail"],
        properties: {
          label: { type: "string" },
          score: { type: "integer", minimum: 0, maximum: 100 },
          detail: { type: "string" }
        }
      }
    },
    proofstream: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" }
    }
  }
};

const defaultModel = "gpt-5.4-nano";
const defaultReasoningEffort = "medium";
const defaultVerbosity = "medium";
const defaultMaxOutputTokens = 26000;

export async function OPTIONS() {
  return json({ ok: true });
}

function openAiKey() {
  return process.env.OPEN_AI_API || process.env.OPENAI_API_KEY || process.env.OPENAI_API || "";
}

function outputText(response) {
  if (typeof response.output_text === "string") return response.output_text;
  return (response.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("")
    .trim();
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const apiKey = openAiKey();
  if (!apiKey) {
    return json(
      {
        ok: false,
        code: "OPENAI_NOT_CONFIGURED",
        message: "OPEN_AI_API is not available to this deployment."
      },
      503
    );
  }

  const body = await readJson(request);
  const context = {
    task: String(body.task || "").slice(0, 1600),
    service: String(body.service || "home").slice(0, 80),
    urgency: String(body.urgency || "today").slice(0, 80),
    budget: body.budget || {},
    market: String(body.market || "Your market").slice(0, 100),
    intake: body.intake || {},
    cleaningPlan: body.cleaningPlan || {}
  };

  if (!context.task.trim()) {
    return json({ ok: false, code: "TASK_REQUIRED", message: "A request is required before AURA can build an AI plan." }, 400);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || process.env.AURA_AI_MODEL || defaultModel,
      input: [
        {
          role: "system",
          content:
            "You are AURA Ops Architect. Convert personal-assistant demand into concise, premium, dispatch-ready operations. Use no fake provider names. Return only valid JSON that matches the schema."
        },
        {
          role: "user",
          content: JSON.stringify(context)
        }
      ],
      reasoning: {
        effort: process.env.OPENAI_REASONING_EFFORT || defaultReasoningEffort
      },
      text: {
        verbosity: process.env.OPENAI_VERBOSITY || defaultVerbosity,
        format: {
          type: "json_schema",
          name: "aura_ops_plan",
          schema: planSchema,
          strict: true
        }
      },
      max_output_tokens: Number(process.env.OPENAI_MAX_OUTPUT_TOKENS || defaultMaxOutputTokens)
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return json(
      {
        ok: false,
        code: "OPENAI_REQUEST_FAILED",
        message: result.error?.message || "AURA AI planning failed."
      },
      502
    );
  }

  try {
    const plan = JSON.parse(outputText(result));
    return json({ ok: true, mode: "ai", data: plan });
  } catch {
    return json({ ok: false, code: "OPENAI_RESPONSE_INVALID", message: "AURA AI returned an unreadable plan." }, 502);
  }
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "POST") return POST(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
