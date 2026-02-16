"use client"

import { Sparkles } from "lucide-react"

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-display text-foreground leading-tight">
            Grant Planner
          </h1>
          <p className="text-xs text-muted-foreground">
            Prepare, track, and win grants for your startup
          </p>
        </div>
      </div>
    </header>
  )
}
