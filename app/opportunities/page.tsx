"use client"

import { useState, useMemo } from "react"
import {
  Search,
  SlidersHorizontal,
  Globe,
  X,
  ArrowLeft,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { OpportunityCard } from "@/components/opportunity-card"
import {
  mockOpportunities,
  focusAreaOptions,
  locationOptions,
  eligibilityOptions,
  type Opportunity,
} from "@/lib/mock-opportunities"
import { AppHeader } from "@/components/app-header"

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("")
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedEligibility, setSelectedEligibility] = useState("any")
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  function toggleFocusArea(area: string) {
    setSelectedFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  function toggleLocation(loc: string) {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    )
  }

  function clearAllFilters() {
    setSearch("")
    setSelectedFocusAreas([])
    setSelectedLocations([])
    setSelectedEligibility("any")
    setShowNewOnly(false)
  }

  const activeFilterCount =
    selectedFocusAreas.length +
    selectedLocations.length +
    (selectedEligibility !== "any" ? 1 : 0) +
    (showNewOnly ? 1 : 0)

  const filtered = useMemo(() => {
    let result = [...mockOpportunities]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.organization.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.focusAreas.some((a) => a.toLowerCase().includes(q))
      )
    }

    if (selectedFocusAreas.length > 0) {
      result = result.filter((o) =>
        selectedFocusAreas.some((area) => o.focusAreas.includes(area))
      )
    }

    if (selectedLocations.length > 0) {
      result = result.filter((o) =>
        selectedLocations.some((loc) => o.locations.includes(loc))
      )
    }

    if (selectedEligibility !== "any") {
      result = result.filter(
        (o) =>
          o.eligibilityType === selectedEligibility ||
          o.eligibilityType === "any"
      )
    }

    if (showNewOnly) {
      result = result.filter((o) => o.isNew)
    }

    return result
  }, [search, selectedFocusAreas, selectedLocations, selectedEligibility, showNewOnly])

  const filterSidebar = (
    <div className="flex flex-col gap-6">
      {/* New only toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <Checkbox
          checked={showNewOnly}
          onCheckedChange={(checked) => setShowNewOnly(checked === true)}
        />
        <span className="text-sm font-medium text-foreground">
          New opportunities only
        </span>
      </label>

      {/* Focus areas */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-semibold text-foreground group/trigger">
          Focus Area
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]/trigger:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 pt-3">
            {focusAreaOptions.map((area) => (
              <label
                key={area}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Checkbox
                  checked={selectedFocusAreas.includes(area)}
                  onCheckedChange={() => toggleFocusArea(area)}
                />
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {area}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Locations */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-semibold text-foreground group/trigger">
          Location
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]/trigger:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 pt-3">
            {locationOptions.map((loc) => (
              <label
                key={loc}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Checkbox
                  checked={selectedLocations.includes(loc)}
                  onCheckedChange={() => toggleLocation(loc)}
                />
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {loc}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Eligibility */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-semibold text-foreground group/trigger">
          Eligibility
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]/trigger:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 pt-3">
            {eligibilityOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Checkbox
                  checked={selectedEligibility === opt.value}
                  onCheckedChange={() =>
                    setSelectedEligibility(
                      selectedEligibility === opt.value ? "any" : opt.value
                    )
                  }
                />
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={clearAllFilters}
        >
          Clear all filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold font-display text-foreground">
                Global Opportunities
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover grants and funding programs curated for your startup
              </p>
            </div>
          </div>
        </div>

        {/* Search bar + mobile filter toggle */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, organization, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden shrink-0 relative"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {showNewOnly && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs cursor-pointer hover:bg-destructive/10"
                onClick={() => setShowNewOnly(false)}
              >
                New Only
                <X className="h-3 w-3" />
              </Badge>
            )}
            {selectedFocusAreas.map((area) => (
              <Badge
                key={area}
                variant="secondary"
                className="gap-1 text-xs cursor-pointer hover:bg-destructive/10"
                onClick={() => toggleFocusArea(area)}
              >
                {area}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            {selectedLocations.map((loc) => (
              <Badge
                key={loc}
                variant="secondary"
                className="gap-1 text-xs cursor-pointer hover:bg-destructive/10"
                onClick={() => toggleLocation(loc)}
              >
                {loc}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            {selectedEligibility !== "any" && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs cursor-pointer hover:bg-destructive/10"
                onClick={() => setSelectedEligibility("any")}
              >
                {eligibilityOptions.find((o) => o.value === selectedEligibility)?.label}
                <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}

        {/* Main layout: sidebar + grid */}
        <div className="flex gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-8">{filterSidebar}</div>
          </aside>

          {/* Mobile filters drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute inset-y-0 right-0 w-80 max-w-full bg-card border-l border-border p-6 overflow-y-auto shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold text-foreground">
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {filterSidebar}
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-4">
              Showing {filtered.length} of {mockOpportunities.length}{" "}
              opportunities
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
                <Globe className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  No opportunities found
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
