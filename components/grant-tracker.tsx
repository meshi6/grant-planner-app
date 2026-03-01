"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GrantCard } from "@/components/grant-card"
import { ScorecardDialog, type ScorecardResult } from "@/components/scorecard-dialog"
import { mockGrants, type Grant, type StartupQuestion } from "@/lib/mock-data"

type FilterCategory =
  | "all"
  | "submission_date"
  | "granted"
  | "deadline"
  | "grant_amount"
  | "score"

type SortOption = "default" | "name_az" | "amount_desc" | "deadline_asc"

const filterOptions: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "score", label: "Score" },
  { value: "submission_date", label: "Submission Date" },
  { value: "granted", label: "Granted" },
  { value: "deadline", label: "Deadline" },
  { value: "grant_amount", label: "Grant Amount" },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "name_az", label: "Name A\u2013Z" },
  { value: "amount_desc", label: "Amount (High to Low)" },
  { value: "deadline_asc", label: "Deadline (Soonest)" },
]

function applyFilter(grants: Grant[], filter: FilterCategory, scorecards?: Record<string, ScorecardResult>): Grant[] {
  switch (filter) {
    case "score":
      return grants.filter((g) => scorecards && scorecards[g.id])
    case "submission_date":
      return grants.filter((g) => g.submissionDate !== null)
    case "granted":
      return grants.filter((g) => g.granted)
    case "deadline": {
      const now = new Date()
      return grants.filter(
        (g) => new Date(g.deadline + "T00:00:00") >= now
      )
    }
    case "grant_amount":
      return grants.filter(
        (g) => g.grantAmount !== null && g.grantAmount > 0
      )
    default:
      return grants
  }
}

function applySort(grants: Grant[], sort: SortOption): Grant[] {
  const copy = [...grants]
  switch (sort) {
    case "name_az":
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case "amount_desc":
      return copy.sort((a, b) => {
        const aAmt = a.grantAmount ?? 0
        const bAmt = b.grantAmount ?? 0
        return bAmt - aAmt
      })
    case "deadline_asc":
      return copy.sort((a, b) => {
        const aDate = new Date(a.deadline)
        const bDate = new Date(b.deadline)
        return aDate.getTime() - bDate.getTime()
      })
    default:
      return copy.sort((a, b) => {
        const aIdx = parseInt(a.id)
        const bIdx = parseInt(b.id)
        if (aIdx !== bIdx) return aIdx - bIdx
        const nameComp = a.name.localeCompare(b.name)
        if (nameComp !== 0) return nameComp
        return (b.grantAmount ?? 0) - (a.grantAmount ?? 0)
      })
  }
}

interface GrantTrackerProps {
  startupQuestions: StartupQuestion[]
}

export function GrantTracker({ startupQuestions }: GrantTrackerProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterCategory>("all")
  const [sort, setSort] = useState<SortOption>("default")

  // Scorecard state: map of grantId -> ScorecardResult
  // Initialize with sample scorecard from mock data if available
  const [scorecards, setScorecards] = useState<Record<string, ScorecardResult>>(() => {
    const initial: Record<string, ScorecardResult> = {}
    mockGrants.forEach((grant) => {
      if (grant.scorecard) {
        initial[grant.id] = grant.scorecard
      }
    })
    return initial
  })

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [scoringGrantId, setScoringGrantId] = useState<string | null>(null)

  const scoringGrant = scoringGrantId
    ? mockGrants.find((g) => g.id === scoringGrantId) ?? null
    : null

  function handleRequestScore(grantId: string) {
    setScoringGrantId(grantId)
    setDialogOpen(true)
  }

  function handleScorecardResult(result: ScorecardResult) {
    if (scoringGrantId) {
      setScorecards((prev) => ({ ...prev, [scoringGrantId]: result }))
    }
  }

  const filteredGrants = useMemo(() => {
    let result = [...mockGrants]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.link.toLowerCase().includes(q)
      )
    }

    // Filter
    result = applyFilter(result, filter, scorecards)

    // Sort
    result = applySort(result, sort)

    return result
  }, [search, filter, sort])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold font-display text-foreground">
          Grant Tracker
        </h2>
        <p className="text-sm text-muted-foreground">
          Browse grants and generate AI-powered scorecards
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grants by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4 hidden sm:block" />
          </div>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as FilterCategory)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {filteredGrants.length} of {mockGrants.length} grants
      </p>

      {/* Grid */}
      {filteredGrants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGrants.map((grant) => (
            <GrantCard
              key={grant.id}
              grant={grant}
              scorecard={scorecards[grant.id] ?? null}
              startupQuestions={startupQuestions}
              onRequestScore={handleRequestScore}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <p className="text-sm text-muted-foreground">
            No grants match your search or filter.
          </p>
          <button
            className="mt-2 text-sm text-primary hover:underline"
            onClick={() => {
              setSearch("")
              setFilter("all")
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Scorecard Dialog */}
      {scoringGrant && (
        <ScorecardDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          grantName={scoringGrant.name}
          grantLink={scoringGrant.link}
          startupQuestions={startupQuestions}
          onResult={handleScorecardResult}
        />
      )}
    </div>
  )
}
