"use client"

import { useState } from "react"
import {
  Calendar,
  DollarSign,
  ExternalLink,
  MapPin,
  Plus,
  Check,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Opportunity } from "@/lib/mock-opportunities"

function formatCurrency(amount: number | null): string {
  if (amount === null) return "TBD"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getDeadlineUrgency(deadline: string) {
  const now = new Date()
  const dl = new Date(deadline + "T00:00:00")
  const diffDays = Math.ceil(
    (dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diffDays < 0) return { label: "Closed", urgent: true }
  if (diffDays <= 14) return { label: `${diffDays}d left`, urgent: true }
  if (diffDays <= 30) return { label: `${diffDays}d left`, urgent: false }
  return {
    label: new Date(deadline + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    urgent: false,
  }
}

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [added, setAdded] = useState(false)
  const deadlineInfo = getDeadlineUrgency(opportunity.deadline)

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {opportunity.isNew && (
                <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 leading-relaxed">
                  NEW
                </Badge>
              )}
              <span className="text-xs text-muted-foreground truncate">
                {opportunity.organization}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
              {opportunity.title}
            </h3>
          </div>
          <a
            href={opportunity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-primary hover:bg-primary/10"
            aria-label={`Open ${opportunity.title} details`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 pt-0">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {opportunity.description}
        </p>

        {/* Focus area tags */}
        <div className="flex flex-wrap gap-1">
          {opportunity.focusAreas.map((area) => (
            <Badge
              key={area}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 leading-relaxed font-normal"
            >
              {area}
            </Badge>
          ))}
        </div>

        {/* Details grid */}
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-foreground font-medium truncate">
              {opportunity.amountMin && opportunity.amountMax
                ? `${formatCurrency(opportunity.amountMin)} - ${formatCurrency(opportunity.amountMax)}`
                : formatCurrency(opportunity.amountMax ?? opportunity.amountMin)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {deadlineInfo.urgent ? (
              <Clock className="h-3.5 w-3.5 shrink-0 text-destructive" />
            ) : (
              <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
            )}
            <span
              className={`font-medium ${deadlineInfo.urgent ? "text-destructive" : "text-foreground"}`}
            >
              {deadlineInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground col-span-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-foreground truncate">
              {opportunity.locations.join(", ")}
            </span>
          </div>
        </div>

        {/* Add to tracker button */}
        <Button
          variant={added ? "secondary" : "default"}
          size="sm"
          className="w-full gap-2 text-xs"
          onClick={() => setAdded(!added)}
          disabled={deadlineInfo.label === "Closed"}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Added to Tracker
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Add to Tracker
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
