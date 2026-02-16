import { generateText, Output } from "ai"
import { z } from "zod"

const scorecardSchema = z.object({
  grantName: z.string().describe("The name of the grant program"),
  missionAlignment: z
    .number()
    .describe("Score from 1 to 10 for how well a typical startup mission aligns with the grant requirements"),
  missionRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the mission alignment score"),
  budgetFeasibility: z
    .number()
    .describe("Score from 1 to 10 for how feasible the budget requirements and funding amount are for a startup"),
  budgetRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the budget feasibility score"),
  projectImpact: z
    .number()
    .describe("Score from 1 to 10 for the potential project impact based on grant goals and deliverables"),
  impactRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the project impact score"),
  summary: z
    .string()
    .describe("A brief overall summary (3-4 sentences) of the grant opportunity and its suitability"),
})

export const maxDuration = 60

export async function POST(req: Request) {
  const { url } = await req.json()

  if (!url || typeof url !== "string") {
    return Response.json({ error: "A valid URL is required." }, { status: 400 })
  }

  // Fetch the grant page content
  let pageContent: string
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GrantScorecard/1.0; +https://example.com)",
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch the page (HTTP ${response.status}). Try a different URL.` },
        { status: 422 }
      )
    }

    const html = await response.text()
    // Strip HTML tags and get text content, limit to ~8000 chars
    pageContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000)
  } catch {
    return Response.json(
      { error: "Could not fetch the grant page. Check the URL and try again." },
      { status: 422 }
    )
  }

  if (pageContent.length < 50) {
    return Response.json(
      { error: "The page did not contain enough text content to analyze." },
      { status: 422 }
    )
  }

  try {
    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert grant advisor for startups. Analyze the following grant program page content and produce a scorecard evaluating it for a typical early-stage startup applicant.

Score each dimension from 1 (poor) to 10 (excellent):
- Mission Alignment: How well does this grant align with typical startup missions? Consider the grant's target audience, industry focus, and eligibility.
- Budget Feasibility: How feasible are the budget/funding terms? Consider grant amount, matching requirements, reporting burden, and restrictions.
- Project Impact: What is the potential impact for a startup? Consider funding size, visibility, networking, mentorship, and growth potential.

Grant page content:
${pageContent}`,
      output: Output.object({ schema: scorecardSchema }),
    })

    if (!output) {
      return Response.json(
        { error: "Failed to generate scorecard. Please try again." },
        { status: 500 }
      )
    }

    return Response.json(output)
  } catch {
    return Response.json(
      { error: "AI analysis failed. Please try again." },
      { status: 500 }
    )
  }
}
