"use client"

import { useState } from "react"
import {
  Pencil,
  Check,
  X,
  Building2,
  MessageSquareText,
  Image,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { type StartupQuestion } from "@/lib/mock-data"

const categoryConfig = {
  basic: {
    label: "Business Basics",
    icon: Building2,
    description: "Company name, social media, and contact details",
  },
  narrative: {
    label: "Narrative Responses",
    icon: MessageSquareText,
    description: "Your story, mission, and impact statements",
  },
  media: {
    label: "Media & Assets",
    icon: Image,
    description: "Photos, videos, and visual materials",
  },
}

function QuestionItem({
  item,
  onSave,
}: {
  item: StartupQuestion
  onSave: (id: string, answer: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.answer)

  const isLongAnswer =
    item.category === "narrative" ||
    item.question.length > 60

  function handleSave() {
    onSave(item.id, draft)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(item.answer)
    setEditing(false)
  }

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {item.question}
          </p>
          {editing ? (
            <div className="mt-3 flex flex-col gap-2">
              {isLongAnswer ? (
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Enter your answer..."
                  className="min-h-[120px] resize-y text-sm"
                  autoFocus
                />
              ) : (
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Enter your answer..."
                  className="text-sm"
                  autoFocus
                />
              )}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1.5">
              {item.answer ? (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {item.answer}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/60 italic">
                  Not yet answered
                </p>
              )}
            </div>
          )}
        </div>
        {!editing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.question}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

interface StartupInfoProps {
  questions: StartupQuestion[]
  onSave: (id: string, answer: string) => void
}

export function StartupInfo({ questions, onSave }: StartupInfoProps) {

  const categories = ["basic", "narrative", "media"] as const
  const answeredCount = questions.filter((q) => q.answer.trim()).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display text-foreground">
            Startup Information
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Keep your answers ready for grant applications
          </p>
        </div>
        <Badge variant="secondary" className="w-fit mt-2 sm:mt-0">
          {answeredCount} / {questions.length} answered
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map((cat) => {
          const config = categoryConfig[cat]
          const Icon = config.icon
          const items = questions.filter((q) => q.category === cat)
          const catAnswered = items.filter((q) => q.answer.trim()).length

          return (
            <Collapsible key={cat} defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 text-left transition-colors hover:bg-muted group/trigger">
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {config.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {config.description}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  {catAnswered}/{items.length}
                </Badge>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]/trigger:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2 pt-3 pl-2">
                  {items.map((item) => (
                    <QuestionItem
                      key={item.id}
                      item={item}
                      onSave={onSave}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}
