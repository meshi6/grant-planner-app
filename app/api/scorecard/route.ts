import { generateText, Output } from "ai"
import { z } from "zod"

const scorecardSchema = z.object({
  grantName: z.string().describe("The name of the grant program"),
  missionAlignment: z
    .number()
    .describe("Score from 1 to 10 for how well the startup's mission aligns with the grant's goals and eligibility criteria"),
  missionRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the mission alignment score, referencing specific aspects of the startup and grant"),
  budgetFeasibility: z
    .number()
    .describe("Score from 1 to 10 for how feasible the grant's budget/funding terms are for this specific startup"),
  budgetRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the budget feasibility score, referencing the startup's situation"),
  projectImpact: z
    .number()
    .describe("Score from 1 to 10 for how much impact winning this grant would have on this startup specifically"),
  impactRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the project impact score, referencing the startup's goals"),
  summary: z
    .string()
    .describe("A brief overall summary (3-4 sentences) of how well this grant fits this startup and recommended next steps"),
})

export const maxDuration = 60

export async function POST(req: Request) {
  const { url, startupProfile } = await req.json()

  if (!url || typeof url !== "string") {
    return Response.json({ error: "A valid URL is required." }, { status: 400 })
  }

  const hasStartupInfo =
    typeof startupProfile === "string" && startupProfile.trim().length > 0

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
    const startupSection = hasStartupInfo
      ? `

--- STARTUP PROFILE ---
The following is the applicant's startup information. Use this to personalize every score and rationale.
${startupProfile}
--- END STARTUP PROFILE ---`
      : `

Note: No startup profile was provided. Score the grant for a generic early-stage startup applicant, but mention that scores would be more accurate with startup details.`

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert grant advisor. Analyze the following grant program page and produce a scorecard evaluating how well it fits the startup described below.

Score each dimension from 1 (poor fit) to 10 (excellent fit):
- Mission Alignment: How well does the startup's mission, product, and qualifications match the grant's goals, target audience, and eligibility criteria?
- Budget Feasibility: Given the startup's stage and the grant's funding amount, matching requirements, restrictions, and reporting burden, how feasible is it?
- Project Impact: How much would winning this grant specifically benefit this startup in terms of funding, growth, visibility, and achieving their stated goals?

Be honest and specific. Reference concrete details from both the grant page and the startup profile in your rationales.
${startupSection}

--- GRANT PAGE CONTENT ---
${pageContent}
--- END GRANT PAGE CONTENT ---`,
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
