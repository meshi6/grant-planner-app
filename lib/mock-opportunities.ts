export interface Opportunity {
  id: string
  title: string
  organization: string
  description: string
  focusAreas: string[]
  locations: string[]
  amountMin: number | null
  amountMax: number | null
  deadline: string
  url: string
  isNew: boolean
  eligibilityType: "nonprofit" | "forprofit" | "individual" | "any"
}

export const focusAreaOptions = [
  "Climate",
  "Health",
  "Technology",
  "AI / ML",
  "Social Impact",
  "Education",
  "Energy",
  "Agriculture",
  "Women-Led",
  "Minority-Led",
] as const

export const locationOptions = [
  "Global",
  "United States",
  "Europe",
  "Asia",
  "Africa",
  "Latin America",
] as const

export const eligibilityOptions = [
  { value: "any", label: "All Types" },
  { value: "forprofit", label: "For-Profit" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "individual", label: "Individual" },
] as const

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Climate Innovation Accelerator",
    organization: "Global Climate Fund",
    description:
      "Supports early-stage startups developing breakthrough climate technologies in carbon capture, renewable energy storage, and emissions reduction. Includes mentorship and investor access.",
    focusAreas: ["Climate", "Energy", "Technology"],
    locations: ["Global"],
    amountMin: 100000,
    amountMax: 500000,
    deadline: "2026-05-15",
    url: "https://example.com/climate-innovation",
    isNew: true,
    eligibilityType: "forprofit",
  },
  {
    id: "opp-2",
    title: "Health Equity Research Grant",
    organization: "National Institutes of Health",
    description:
      "Funding for organizations addressing health disparities in underserved communities through technology-driven solutions, telehealth platforms, and community health infrastructure.",
    focusAreas: ["Health", "Social Impact", "Technology"],
    locations: ["United States"],
    amountMin: 50000,
    amountMax: 250000,
    deadline: "2026-04-01",
    url: "https://example.com/health-equity",
    isNew: true,
    eligibilityType: "any",
  },
  {
    id: "opp-3",
    title: "Women in STEM Enterprise Fund",
    organization: "Cartier Philanthropy",
    description:
      "Supports women-led enterprises working at the intersection of science, technology, engineering, and mathematics. Priority given to ventures with measurable social impact.",
    focusAreas: ["Women-Led", "Technology", "Education"],
    locations: ["Global"],
    amountMin: 75000,
    amountMax: 150000,
    deadline: "2026-06-30",
    url: "https://example.com/women-stem",
    isNew: false,
    eligibilityType: "forprofit",
  },
  {
    id: "opp-4",
    title: "AI for Good Challenge",
    organization: "Microsoft Philanthropies",
    description:
      "Grants for nonprofits and social enterprises using artificial intelligence and machine learning to solve pressing global challenges including accessibility, humanitarian action, and environmental sustainability.",
    focusAreas: ["AI / ML", "Social Impact", "Technology"],
    locations: ["Global"],
    amountMin: 25000,
    amountMax: 100000,
    deadline: "2026-03-20",
    url: "https://example.com/ai-for-good",
    isNew: false,
    eligibilityType: "nonprofit",
  },
  {
    id: "opp-5",
    title: "Sustainable Agriculture Innovation",
    organization: "USDA Rural Development",
    description:
      "Supports innovative agricultural practices including precision farming, sustainable supply chains, and value-added producer initiatives for rural communities.",
    focusAreas: ["Agriculture", "Climate", "Energy"],
    locations: ["United States"],
    amountMin: 50000,
    amountMax: 75000,
    deadline: "2026-07-15",
    url: "https://example.com/ag-innovation",
    isNew: true,
    eligibilityType: "any",
  },
  {
    id: "opp-6",
    title: "Minority Business Development Grant",
    organization: "SBA Office of Advocacy",
    description:
      "Financial support for minority-owned small businesses to scale operations, enter new markets, and build capacity. Includes business coaching and networking opportunities.",
    focusAreas: ["Minority-Led", "Social Impact"],
    locations: ["United States"],
    amountMin: 10000,
    amountMax: 50000,
    deadline: "2026-04-30",
    url: "https://example.com/minority-biz",
    isNew: false,
    eligibilityType: "forprofit",
  },
  {
    id: "opp-7",
    title: "European Digital Transition Fund",
    organization: "European Innovation Council",
    description:
      "Grants for startups and SMEs driving digital transformation across industries. Focus areas include cloud infrastructure, cybersecurity, IoT, and digital health solutions.",
    focusAreas: ["Technology", "Health", "AI / ML"],
    locations: ["Europe"],
    amountMin: 200000,
    amountMax: 1000000,
    deadline: "2026-08-01",
    url: "https://example.com/eu-digital",
    isNew: true,
    eligibilityType: "forprofit",
  },
  {
    id: "opp-8",
    title: "Clean Energy Fellowship",
    organization: "Department of Energy",
    description:
      "Individual fellowships for researchers and entrepreneurs developing next-generation clean energy solutions. Covers research costs, travel, and a living stipend.",
    focusAreas: ["Energy", "Climate"],
    locations: ["United States"],
    amountMin: 30000,
    amountMax: 80000,
    deadline: "2026-05-31",
    url: "https://example.com/clean-energy",
    isNew: false,
    eligibilityType: "individual",
  },
  {
    id: "opp-9",
    title: "Africa Tech Venture Grant",
    organization: "African Development Bank",
    description:
      "Catalytic funding for tech ventures based in or serving African markets. Emphasis on fintech, agritech, edtech, and healthtech solutions with regional scalability potential.",
    focusAreas: ["Technology", "Education", "Agriculture"],
    locations: ["Africa"],
    amountMin: 50000,
    amountMax: 200000,
    deadline: "2026-09-15",
    url: "https://example.com/africa-tech",
    isNew: true,
    eligibilityType: "forprofit",
  },
  {
    id: "opp-10",
    title: "LatAm Social Enterprise Fund",
    organization: "Inter-American Development Bank",
    description:
      "Supporting social enterprises across Latin America that combine financial sustainability with measurable community impact in education, healthcare, and economic inclusion.",
    focusAreas: ["Social Impact", "Education", "Health"],
    locations: ["Latin America"],
    amountMin: 40000,
    amountMax: 150000,
    deadline: "2026-06-15",
    url: "https://example.com/latam-social",
    isNew: false,
    eligibilityType: "any",
  },
]
