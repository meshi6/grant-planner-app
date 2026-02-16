"use client"

import {
  Calendar,
  DollarSign,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Grant } from "@/lib/mock-data"

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
  if (diffDays < 0) return { label: "Past due", variant: "destructive" as const }
  if (diffDays <= 14) return { label: `${diffDays}d left`, variant: "warning" as const }
  return { label: formatDate(deadline), variant: "default" as const }
}

export function GrantCard({ grant }: { grant: Grant }) {
  const deadlineStatus = getDeadlineStatus(grant.deadline)

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 flex-1">
            {grant.name}
          </h3>
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
  )
}
