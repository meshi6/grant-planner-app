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
  eligibilityFit: z
    .number()
    .describe("Score from 1 to 10 for how well the startup meets the grant's stated requirements such as industry, location, revenue caps, and demographic criteria"),
  eligibilityRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the eligibility fit score, referencing specific requirements from the grant page"),
  competitionLevel: z
    .number()
    .describe("Score from 1 to 10 for how favorable the competition level is — higher means less competition and better odds of winning"),
  competitionRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the competition level score, referencing the grant's popularity, applicant pool, and award rate"),
  timelineReadiness: z
    .number()
    .describe("Score from 1 to 10 for how realistic it is that the startup can prepare a strong application before the deadline"),
  timelineRationale: z
    .string()
    .describe("Brief explanation (2-3 sentences) for the timeline readiness score, considering application complexity and deadline proximity"),
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
- Eligibility Fit: Does the startup actually meet the grant's stated requirements — industry focus, geographic restrictions, revenue caps, demographic criteria, and any other eligibility rules?
- Competition Level: How favorable is the competition for this grant? Consider the grant's popularity, typical number of applicants, award rate, and how well-positioned this startup is relative to typical applicants. Higher score means better odds.
- Timeline Readiness: Can the startup realistically prepare a strong, complete application before the deadline? Consider application complexity, required materials, and how much preparation time remains.

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
