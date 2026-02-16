"use client"

import { useState } from "react"
import {
  Link2,
  Loader2,
  Target,
  Wallet,
  Rocket,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { type StartupQuestion } from "@/lib/mock-data"

interface ScorecardResult {
  grantName: string
  missionAlignment: number
  missionRationale: string
  budgetFeasibility: number
  budgetRationale: string
  projectImpact: number
  impactRationale: string
  summary: string
}

function ScoreRing({
  score,
  label,
  icon: Icon,
  rationale,
}: {
  score: number
  label: string
  icon: React.ElementType
  rationale: string
}) {
  const percentage = (score / 10) * 100
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  function getScoreColor(s: number) {
    if (s >= 8) return "text-success stroke-success"
    if (s >= 5) return "text-warning stroke-warning"
    return "text-destructive stroke-destructive"
  }

  function getScoreBg(s: number) {
    if (s >= 8) return "bg-success/10"
    if (s >= 5) return "bg-warning/10"
    return "bg-destructive/10"
  }

  const colorClass = getScoreColor(score)
  const bgClass = getScoreBg(score)

  return (
    <Card className="flex flex-col items-center">
      <CardHeader className="items-center pb-2">
        <div className={`rounded-full p-2 ${bgClass}`}>
          <Icon className={`h-5 w-5 ${colorClass.split(" ")[0]}`} />
        </div>
        <p className="text-sm font-semibold text-foreground text-center">
          {label}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 pt-0">
        <div className="relative h-24 w-24">
          <svg
            className="h-24 w-24 -rotate-90"
            viewBox="0 0 96 96"
            aria-hidden="true"
          >
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              strokeWidth="6"
              className="stroke-muted"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className={`${colorClass.split(" ")[1]} transition-all duration-1000 ease-out`}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-2xl font-bold ${colorClass.split(" ")[0]}`}
            >
              {score}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {rationale}
        </p>
      </CardContent>
    </Card>
  )
}

interface GrantScorecardProps {
  startupQuestions: StartupQuestion[]
}

export function GrantScorecard({ startupQuestions }: GrantScorecardProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScorecardResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    // Build a startup profile from answered questions
    const startupProfile = startupQuestions
      .filter((q) => q.answer.trim())
      .map((q) => `${q.question}: ${q.answer}`)
      .join("\n")

    try {
      const res = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, startupProfile }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong.")
        return
      }

      setResult(data)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setUrl("")
    setError(null)
    setResult(null)
  }

  const overallScore = result
    ? Math.round(
        (result.missionAlignment +
          result.budgetFeasibility +
          result.projectImpact) /
          3
      )
    : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold font-display text-foreground">
          Grant Scorecard
        </h2>
        <p className="text-sm text-muted-foreground">
          Paste a grant URL to see how well it matches your startup profile
        </p>
      </div>

      {/* Missing startup info warning */}
      {startupQuestions.filter((q) => q.answer.trim()).length === 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              No startup info provided
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in your Startup Info tab first for a personalized score. Without it, the scorecard will be generic.
            </p>
          </div>
        </div>
      )}

      {/* URL Input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="url"
            placeholder="https://example.com/grant-program"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-9"
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" disabled={loading || !url.trim()} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Grant
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        {result && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Analyzing grant page...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This may take a few seconds
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="flex flex-col gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Grant name & overall score */}
          <Card>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-5">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Analyzed Grant
                </p>
                <h3 className="text-lg font-semibold font-display text-foreground text-balance">
                  {result.grantName}
                </h3>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Overall Score
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {overallScore}
                    <span className="text-base font-normal text-muted-foreground">
                      /10
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score rings */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ScoreRing
              score={result.missionAlignment}
              label="Mission Alignment"
              icon={Target}
              rationale={result.missionRationale}
            />
            <ScoreRing
              score={result.budgetFeasibility}
              label="Budget Feasibility"
              icon={Wallet}
              rationale={result.budgetRationale}
            />
            <ScoreRing
              score={result.projectImpact}
              label="Project Impact"
              icon={Rocket}
              rationale={result.impactRationale}
            />
          </div>

          {/* Summary */}
          <Card>
            <CardContent className="py-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Summary
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {result.summary}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Target className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">
            Enter a grant URL above to generate a scorecard
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            We{"'"}ll score mission alignment, budget feasibility, and project impact against your startup profile
          </p>
        </div>
      )}
    </div>
  )
}
