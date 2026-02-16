"use client"

import { AppHeader } from "@/components/app-header"
import { StartupInfo } from "@/components/startup-info"
import { GrantTracker } from "@/components/grant-tracker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, FolderSearch } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="tracker" className="flex flex-col gap-6">
          <TabsList className="w-fit">
            <TabsTrigger value="info" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Startup Info</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="tracker" className="gap-2">
              <FolderSearch className="h-4 w-4" />
              <span className="hidden sm:inline">Grant Tracker</span>
              <span className="sm:hidden">Tracker</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <StartupInfo />
          </TabsContent>

          <TabsContent value="tracker">
            <GrantTracker />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
