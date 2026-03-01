export interface StartupQuestion {
  id: string
  question: string
  answer: string
  category: "basic" | "narrative" | "media"
}

export const defaultStartupQuestions: StartupQuestion[] = [
  {
    id: "business-name",
    question: "Business Name",
    answer: "",
    category: "basic",
  },
  {
    id: "business-facebook",
    question: "Business Facebook",
    answer: "",
    category: "basic",
  },
  {
    id: "business-twitter",
    question: "Business Twitter",
    answer: "",
    category: "basic",
  },
  {
    id: "business-instagram",
    question: "Business Instagram",
    answer: "",
    category: "basic",
  },
  {
    id: "business-linkedin",
    question: "Business LinkedIn",
    answer: "",
    category: "basic",
  },
  {
    id: "elevator-pitch",
    question: "Elevator Pitch",
    answer: "",
    category: "narrative",
  },
  {
    id: "problem-solving",
    question: "How is your product/service solving the problem?",
    answer: "",
    category: "narrative",
  },
  {
    id: "uniquely-qualified",
    question: "Why are you uniquely qualified?",
    answer: "",
    category: "narrative",
  },
  {
    id: "entrepreneurship-journey",
    question:
      "Please tell us your entrepreneurship journey in 300 words or less.",
    answer: "",
    category: "narrative",
  },
  {
    id: "grant-impact",
    question: "How would this grant impact your business?",
    answer: "",
    category: "narrative",
  },
  {
    id: "anything-else",
    question:
      "Is there anything you think we should know, success story to share, challenge to share, big win you are proud of?",
    answer: "",
    category: "narrative",
  },
  {
    id: "headshot",
    question: "Your headshot or a picture of your team",
    answer: "",
    category: "media",
  },
  {
    id: "video",
    question: "Short video about yourself or your business",
    answer: "",
    category: "media",
  },
]

export interface Grant {
  id: string
  name: string
  link: string
  deadline: string
  grantAmount: number | null
  submissionDate: string | null
  submitted: boolean
  granted: boolean
  scorecard?: {
    grantName: string
    missionAlignment: number
    missionRationale: string
    budgetFeasibility: number
    budgetRationale: string
    projectImpact: number
    impactRationale: string
    eligibilityFit: number
    eligibilityRationale: string
    competitionLevel: number
    competitionRationale: string
    timelineReadiness: number
    timelineRationale: string
    summary: string
  }
}

export const mockGrants: Grant[] = [
  {
    id: "1",
    name: "Small Business Innovation Research (SBIR) Phase I",
    link: "https://www.sbir.gov/",
    deadline: "2026-04-15",
    grantAmount: 275000,
    submissionDate: "2026-02-10",
    submitted: true,
    granted: false,
    scorecard: {
      grantName: "Small Business Innovation Research (SBIR) Phase I",
      missionAlignment: 8,
      missionRationale: "Your AI-driven supply chain optimization solution aligns well with SBIR's focus on innovative technology for small businesses. The program specifically supports tech startups addressing operational efficiency.",
      budgetFeasibility: 7,
      budgetRationale: "The $275k Phase I award matches your stated need for R&D and market validation. However, strict reporting requirements and milestone tracking may require dedicated compliance resources.",
      projectImpact: 9,
      impactRationale: "Winning SBIR Phase I would accelerate your proof-of-concept and provide credibility with larger enterprise customers. The program opens doors to Phase II funding ($750k-$1M) if results are promising.",
      eligibilityFit: 9,
      eligibilityRationale: "Your startup meets all SBIR criteria: incorporated in the US, woman-owned, under 500 employees, and in an eligible research area. You qualify for the Women-Owned Small Business advantage.",
      competitionLevel: 6,
      competitionRationale: "SBIR is highly competitive (~15% award rate) but the supply chain tech category is less saturated than AI/ML generally. Your focus on operations gives you a slight advantage in scoring.",
      timelineReadiness: 8,
      timelineRationale: "With 45 days to deadline, you have adequate time to prepare the 15-page proposal. Your existing pitch deck and technical documentation can be repurposed with minimal additional work.",
      summary: "SBIR Phase I is an excellent strategic fit for your startup. Strong mission alignment, full eligibility, and realistic timeline make this a high-priority grant to pursue. Focus on clearly articulating your technical innovation and market opportunity in the proposal."
    }
  },
  {
    id: "2",
    name: "Amber Grant for Women",
    link: "https://ambergrantsforwomen.com/",
    deadline: "2026-03-31",
    grantAmount: 10000,
    submissionDate: null,
    submitted: false,
    granted: false,
  },
  {
    id: "3",
    name: "FedEx Small Business Grant",
    link: "https://www.fedex.com/en-us/small-business/grant-contest.html",
    deadline: "2026-05-20",
    grantAmount: 50000,
    submissionDate: "2026-01-15",
    submitted: true,
    granted: true,
  },
  {
    id: "4",
    name: "National Geographic Exploration Grant",
    link: "https://www.nationalgeographic.org/grants/",
    deadline: "2026-06-01",
    grantAmount: 30000,
    submissionDate: null,
    submitted: false,
    granted: false,
  },
  {
    id: "5",
    name: "Halstead Grant for Emerging Jewelry Artists",
    link: "https://halsteadbead.com/halstead-grant",
    deadline: "2026-08-01",
    grantAmount: 7500,
    submissionDate: "2026-02-01",
    submitted: true,
    granted: false,
  },
  {
    id: "6",
    name: "USDA Value-Added Producer Grant",
    link: "https://www.rd.usda.gov/programs-services/value-added-producer-grants",
    deadline: "2026-03-15",
    grantAmount: 75000,
    submissionDate: "2026-02-12",
    submitted: true,
    granted: true,
  },
  {
    id: "7",
    name: "Visa Everywhere Initiative",
    link: "https://usa.visa.com/visa-everywhere/everywhere-initiative.html",
    deadline: "2026-07-30",
    grantAmount: 100000,
    submissionDate: null,
    submitted: false,
    granted: false,
  },
  {
    id: "8",
    name: "Cartier Women's Initiative",
    link: "https://www.cartierwomensinitiative.com/",
    deadline: "2026-05-31",
    grantAmount: 100000,
    submissionDate: "2026-02-05",
    submitted: true,
    granted: false,
  },
  {
    id: "9",
    name: "MIT Inclusive Innovation Challenge",
    link: "https://www.mitinclusiveinnovation.com/",
    deadline: "2026-04-30",
    grantAmount: 150000,
    submissionDate: null,
    submitted: false,
    granted: false,
  },
  {
    id: "10",
    name: "Patagonia Environmental Grants",
    link: "https://www.patagonia.com/actionworks/grantees/",
    deadline: "2026-08-31",
    grantAmount: 20000,
    submissionDate: null,
    submitted: false,
    granted: false,
  },
  {
    id: "11",
    name: "Google for Startups Black Founders Fund",
    link: "https://startup.google.com/",
    deadline: "2026-06-15",
    grantAmount: 100000,
    submissionDate: "2026-01-28",
    submitted: true,
    granted: false,
  },
  {
    id: "12",
    name: "SBA Community Advantage Loan Program",
    link: "https://www.sba.gov/funding-programs/grants",
    deadline: "2026-09-30",
    grantAmount: null,
    submissionDate: null,
    submitted: false,
    granted: false,
  },
]
