"use client"

import { useState } from "react"
import {
  Link2,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { type StartupQuestion } from "@/lib/mock-data"

export interface ScorecardResult {
  grantName: string
  missionAlignment: number
  missionRationale: string
  budgetFeasibility: number
  budgetRationale: string
  projectImpact: number
  impactRationale: string
  summary: string
}

interface ScorecardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grantName: string
  grantLink: string
  startupQuestions: StartupQuestion[]
  onResult: (result: ScorecardResult) => void
}

export function ScorecardDialog({
  open,
  onOpenChange,
  grantName,
  grantLink,
  startupQuestions,
  onResult,
}: ScorecardDialogProps) {
  const [url, setUrl] = useState(grantLink)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasStartupInfo = startupQuestions.some((q) => q.answer.trim())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)

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

      onResult(data)
      onOpenChange(false)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-base">
            Score Grant
          </DialogTitle>
          <DialogDescription>
            Analyze <span className="font-medium text-foreground">{grantName}</span> against your startup profile.
          </DialogDescription>
        </DialogHeader>

        {!hasStartupInfo && (
          <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
            <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Fill in your Startup Info for a personalized score. Without it, the scorecard will be generic.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="grant-url" className="text-xs font-medium text-muted-foreground">
              Grant URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="grant-url"
                type="url"
                placeholder="https://example.com/grant-program"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-9"
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2.5">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={loading || !url.trim()} className="gap-2 w-full">
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
