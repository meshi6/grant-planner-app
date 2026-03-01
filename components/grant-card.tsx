"use client"

import { useState } from "react"
import {
  Calendar,
  DollarSign,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Target,
  Wallet,
  Rocket,
  RotateCcw,
  Gauge,
  ShieldCheck,
  Users,
  Timer,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Grant, StartupQuestion } from "@/lib/mock-data"
import { type ScorecardResult } from "@/components/scorecard-dialog"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "N/A"
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return "TBD"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getDeadlineStatus(deadline: string) {
  const now = new Date()
  const dl = new Date(deadline + "T00:00:00")
  const diffDays = Math.ceil(
    (dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diffDays < 0)
    return { label: "Past due", variant: "destructive" as const }
  if (diffDays <= 14)
    return { label: `${diffDays}d left`, variant: "warning" as const }
  return { label: formatDate(deadline), variant: "default" as const }
}

function getScoreColor(s: number) {
  if (s >= 8) return "text-success"
  if (s >= 5) return "text-warning"
  return "text-destructive"
}

function getScoreStroke(s: number) {
  if (s >= 8) return "stroke-success"
  if (s >= 5) return "stroke-warning"
  return "stroke-destructive"
}

function getScoreBg(s: number) {
  if (s >= 8) return "bg-success/10"
  if (s >= 5) return "bg-warning/10"
  return "bg-destructive/10"
}

function MiniScoreRing({
  score,
  label,
  icon: Icon,
}: {
  score: number
  label: string
  icon: React.ElementType
}) {
  const circumference = 2 * Math.PI * 16
  const strokeDashoffset =
    circumference - ((score / 10) * 100 / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-10 w-10">
        <svg
          className="h-10 w-10 -rotate-90"
          viewBox="0 0 40 40"
          aria-hidden="true"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            strokeWidth="2.5"
            className="stroke-muted"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`${getScoreStroke(score)} transition-all duration-700 ease-out`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[11px] font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <Icon className={`h-2.5 w-2.5 ${getScoreColor(score)}`} />
        <span className="text-[9px] font-medium text-muted-foreground leading-none">
          {label}
        </span>
      </div>
    </div>
  )
}

interface GrantCardProps {
  grant: Grant
  scorecard: ScorecardResult | null
  startupQuestions: StartupQuestion[]
  onRequestScore: (grantId: string) => void
}

export function GrantCard({
  grant,
  scorecard,
  onRequestScore,
}: GrantCardProps) {
  const [flipped, setFlipped] = useState(false)
  const deadlineStatus = getDeadlineStatus(grant.deadline)

  const overallScore = scorecard
    ? Math.round(
        (scorecard.missionAlignment +
          scorecard.budgetFeasibility +
          scorecard.projectImpact +
          scorecard.eligibilityFit +
          scorecard.competitionLevel +
          scorecard.timelineReadiness) /
          6
      )
    : null

  function handleScorecardClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (scorecard) {
      setFlipped((f) => !f)
    } else {
      onRequestScore(grant.id)
    }
  }

  return (
    <div
      className="group/card"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ---- FRONT ---- */}
        <Card
          className="flex flex-col overflow-hidden transition-shadow hover:shadow-md hover:border-primary/30"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 flex-1">
                {grant.name}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {/* Scorecard button */}
                <button
                  onClick={handleScorecardClick}
                  className={`relative rounded-md p-1.5 transition-colors ${
                    scorecard
                      ? "text-primary hover:bg-primary/10"
                      : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted"
                  }`}
                  aria-label={
                    scorecard
                      ? `View scorecard for ${grant.name} (${overallScore}/10)`
                      : `Generate scorecard for ${grant.name}`
                  }
                >
                  <Gauge className="h-4 w-4" />
                  {overallScore !== null && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {overallScore}
                    </span>
                  )}
                </button>
                <a
                  href={grant.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-primary hover:bg-primary/10"
                  aria-label={`Open ${grant.name} application`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {grant.submitted && grant.granted && (
                <Badge className="bg-success text-success-foreground text-xs">
                  Granted
                </Badge>
              )}
              {grant.submitted && !grant.granted && (
                <Badge variant="secondary" className="text-xs">
                  Submitted
                </Badge>
              )}
              {!grant.submitted && (
                <Badge variant="outline" className="text-xs">
                  Not Submitted
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 shrink-0 text-primary" />
                <span className="font-medium text-foreground">
                  {formatCurrency(grant.grantAmount)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0 text-primary" />
                <span
                  className={
                    deadlineStatus.variant === "destructive"
                      ? "text-destructive font-medium"
                      : deadlineStatus.variant === "warning"
                        ? "text-warning font-medium"
                        : "text-foreground"
                  }
                >
                  {deadlineStatus.label}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Submission Date
                </span>
                <span className="text-foreground font-medium">
                  {formatDate(grant.submissionDate)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {grant.submitted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  Submitted
                </span>
                <span className="text-foreground font-medium">
                  {grant.submitted ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {grant.granted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  Granted
                </span>
                <span className="text-foreground font-medium">
                  {grant.granted ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---- BACK (Scorecard) ---- */}
        <Card
          className="absolute inset-0 flex flex-col overflow-hidden border-primary/20"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {scorecard ? (
            <>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Scorecard
                    </p>
                    <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-1 mt-0.5">
                      {grant.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${getScoreBg(overallScore ?? 0)}`}>
                      <span className={`text-base font-bold ${getScoreColor(overallScore ?? 0)}`}>
                        {overallScore}
                      </span>
                      <span className="text-[10px] text-muted-foreground">/10</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-2 pt-0">
                {/* Score rings - 3x2 grid */}
                <div className="grid grid-cols-3 gap-x-2 gap-y-3 py-1">
                  <MiniScoreRing
                    score={scorecard.missionAlignment}
                    label="Mission"
                    icon={Target}
                  />
                  <MiniScoreRing
                    score={scorecard.budgetFeasibility}
                    label="Budget"
                    icon={Wallet}
                  />
                  <MiniScoreRing
                    score={scorecard.projectImpact}
                    label="Impact"
                    icon={Rocket}
                  />
                  <MiniScoreRing
                    score={scorecard.eligibilityFit}
                    label="Eligibility"
                    icon={ShieldCheck}
                  />
                  <MiniScoreRing
                    score={scorecard.competitionLevel}
                    label="Competition"
                    icon={Users}
                  />
                  <MiniScoreRing
                    score={scorecard.timelineReadiness}
                    label="Timeline"
                    icon={Timer}
                  />
                </div>

                {/* Summary */}
                <div className="border-t border-border pt-2 flex-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Summary
                  </p>
                  <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                    {scorecard.summary}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFlipped(false)
                    }}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Flip Back
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRequestScore(grant.id)
                    }}
                  >
                    <Gauge className="h-3 w-3" />
                    Rescore
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No scorecard yet</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
