"use client"

import { Sparkles, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
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
        </Link>
        <nav>
          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/opportunities">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Opportunities</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
