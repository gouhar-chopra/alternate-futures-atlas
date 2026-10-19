import type { Scenario } from "./scenario";

// Deterministic demo dataset. Every number here is a fixed, invented illustration.
export const DEMO_SCENARIO: Scenario = {
  id: "demo",
  mode: "demo",
  created_at: "2026-01-01T00:00:00.000Z",
  input: {
    decision: "What if I had accepted that job offer three years ago and moved to Bengaluru?",
    year: "2023",
    location: "Bengaluru",
    area: "Career",
    style: "multiple",
    horizon: 3,
  },
  title: "The offer in Bengaluru",
  decision_summary: "Accepting a product role at a growing startup and relocating to Bengaluru in 2023.",
  opening_narrative:
    "In this imagined timeline, accepting the offer could lead you into a faster, louder professional environment. Your early months might be shaped by new responsibilities, unfamiliar routines, and a handful of relationships that gradually influence your next steps — some of them in directions neither you nor anyone else could have planned.",
  highlights: {
    changed: "A new city, a smaller team, and a daily rhythm built around shipping quickly.",
    opportunities: "Broader ownership earlier, and a network in a dense startup ecosystem.",
    tradeoffs: "Distance from family and friends, higher rent, and less predictable job security.",
  },
  assumptions: [
    { label: "The role", description: "A mid-level product role at an early-stage startup.", source_type: "demo_assumption" },
    { label: "Location", description: "Relocation to Bengaluru, as described in the decision.", source_type: "user_provided" },
    { label: "Starting salary", description: "₹18 lakh per year, an invented round figure for illustration.", source_type: "demo_assumption" },
    { label: "Company trajectory", description: "The startup neither fails nor becomes a runaway success.", source_type: "model_assumption" },
  ],
  timelines: [
    {
      id: "a",
      title: "The steady climb",
      theme: "Growth inside one company",
      description: "You stay with the startup as it slowly finds its footing, growing with the team.",
      events: [
        { time_label: "Year 0", title: "The decision", description: "You accept, pack two suitcases and find a shared flat in Indiranagar.", possible_benefit: "A clean start and the energy of something new.", possible_tradeoff: "Leaving routines and people that quietly held you up.", assumptions: ["Relocation happens within six weeks"], uncertainty: "lower", uncertainty_note: "The move itself follows directly from the decision." },
        { time_label: "Year 1", title: "Adjustment and new routines", description: "Long weeks, a steep learning curve, and the first friendships formed over late deployments.", possible_benefit: "You might learn faster than you expected.", possible_tradeoff: "Rest and hobbies could take a back seat.", assumptions: ["Team of about 25 people"], uncertainty: "moderate", uncertainty_note: "Workplace culture is hard to anticipate from outside." },
        { time_label: "Year 2", title: "Emerging opportunities", description: "A product you lead finds real users. Responsibilities widen, and so do expectations.", possible_benefit: "Visible ownership of meaningful work.", possible_tradeoff: "Pressure tied closely to company performance.", assumptions: ["The company raises a modest follow-on round"], uncertainty: "high", uncertainty_note: "Funding and market conditions are outside anyone's control." },
        { time_label: "Year 3", title: "A possible new direction", description: "You are asked to lead a small team — or perhaps you begin to wonder about something of your own.", possible_benefit: "Leadership experience earlier in your career.", possible_tradeoff: "Less time for hands-on craft.", assumptions: ["You choose to stay"], uncertainty: "high", uncertainty_note: "Personal choices compound and diverge quickly." },
      ],
      benefits: ["Earlier leadership experience", "A strong professional network", "Skills in fast-moving product work"],
      tradeoffs: ["Higher cost of living", "Physical distance from close relationships", "Career tied to one company's fortunes"],
      unknowns: ["Whether the company would survive", "How the city would feel after the novelty faded", "Which friendships would last"],
      financial_series: [
        { period: "Y0", value: 0 }, { period: "Y1", value: 260000 }, { period: "Y2", value: 610000 }, { period: "Y3", value: 1020000 },
      ],
    },
    {
      id: "b",
      title: "The restless leap",
      theme: "Higher uncertainty, wider range",
      description: "After eighteen months, you leave to co-found a small venture with a colleague.",
      events: [
        { time_label: "Year 0", title: "The decision", description: "Same offer, same move — but you arrive already curious about what else the city holds.", possible_benefit: "Openness to unexpected doors.", possible_tradeoff: "Restlessness may make settling harder.", assumptions: [], uncertainty: "lower", uncertainty_note: "Follows from the decision." },
        { time_label: "Year 1", title: "Meetups and side projects", description: "Weekends fill with hackathons. A side project with a colleague begins to look serious.", possible_benefit: "Creative energy and new collaborators.", possible_tradeoff: "Burnout from two jobs at once.", assumptions: [], uncertainty: "moderate", uncertainty_note: "Depends on finding the right collaborator." },
        { time_label: "Year 2", title: "The second leap", description: "You leave the startup. Savings shrink while you search for your first customers.", possible_benefit: "Full ownership of a vision.", possible_tradeoff: "Income becomes irregular.", assumptions: ["Twelve months of runway"], uncertainty: "high", uncertainty_note: "Most new ventures change shape or end early." },
        { time_label: "Year 3", title: "An open question", description: "The venture is small but alive — or it closes, and you return to a role with a very different perspective.", possible_benefit: "Hard-won resilience either way.", possible_tradeoff: "Financial and emotional strain.", assumptions: [], uncertainty: "high", uncertainty_note: "Several futures are equally plausible here." },
      ],
      benefits: ["Autonomy", "Entrepreneurial experience", "A story that is entirely yours"],
      tradeoffs: ["Irregular income", "Strain on health and relationships", "Lower savings"],
      unknowns: ["Whether customers would appear", "How a co-founder relationship would hold"],
      financial_series: [
        { period: "Y0", value: 0 }, { period: "Y1", value: 240000 }, { period: "Y2", value: 180000 }, { period: "Y3", value: 210000 },
      ],
    },
    {
      id: "c",
      title: "The unexpected turn",
      theme: "A detour that changes priorities",
      description: "The city introduces you to a community and a pace of life that reshape what you want from work.",
      events: [
        { time_label: "Year 0", title: "The decision", description: "You move, expecting the job to be the main story.", possible_benefit: "A fresh environment.", possible_tradeoff: "Uncertainty about fitting in.", assumptions: [], uncertainty: "lower", uncertainty_note: "Follows from the decision." },
        { time_label: "Year 1", title: "A new community", description: "A weekend cycling group becomes your anchor in the city.", possible_benefit: "Belonging and better health.", possible_tradeoff: "Less time for overtime and visibility at work.", assumptions: [], uncertainty: "moderate", uncertainty_note: "Chance meetings are inherently unpredictable." },
        { time_label: "Year 2", title: "Rethinking priorities", description: "You negotiate a four-day week and begin teaching a weekend course.", possible_benefit: "A more balanced life.", possible_tradeoff: "Slower career progression.", assumptions: [], uncertainty: "high", uncertainty_note: "Depends on an employer's flexibility." },
        { time_label: "Year 3", title: "A quieter success", description: "Work becomes one part of a fuller life rather than its centre.", possible_benefit: "Contentment that is hard to measure.", possible_tradeoff: "Earning less than peers.", assumptions: [], uncertainty: "high", uncertainty_note: "Values shift in ways that cannot be modelled." },
      ],
      benefits: ["Community", "Balance", "New sources of meaning"],
      tradeoffs: ["Slower salary growth", "Less conventional career narrative"],
      unknowns: ["Whether the balance would last", "How you would feel about the trade in ten years"],
      financial_series: [
        { period: "Y0", value: 0 }, { period: "Y1", value: 220000 }, { period: "Y2", value: 430000 }, { period: "Y3", value: 640000 },
      ],
    },
  ],
  financial: {
    available: true,
    currency: "INR",
    basis: "demo_assumption",
    assumptions: [
      { label: "Starting salary", value: "₹18,00,000 / year (invented)" },
      { label: "Annual raise", value: "10% (assumed)" },
      { label: "Living expenses", value: "₹80,000 / month (assumed)" },
      { label: "Tax & deductions", value: "Simplified flat 20%" },
    ],
    metrics: [
      { label: "Hypothetical annual income (Y3)", value: 2178000, unit: "INR", note: "Starting salary with 10% annual raises." },
      { label: "Illustrative savings (Y3)", value: 1020000, unit: "INR", note: "Cumulative, after assumed expenses." },
      { label: "Assumed monthly expenses", value: 80000, unit: "INR", note: "Rent, food, transport." },
    ],
    breakdown: [
      { label: "Living expenses", value: 960000 },
      { label: "Taxes (simplified)", value: 435600 },
      { label: "Savings", value: 782400 },
    ],
  },
  feed: [
    { id: "f1", date_label: "March, Year 1", publication: "Elsewhere Journal", headline: "Small product teams take on bigger problems in the city's startup corridor", summary: "An imagined trend piece about lean teams shipping ambitious tools.", why_it_appears: "Your scenario places you in an early-stage product team." },
    { id: "f2", date_label: "August, Year 2", publication: "The Alternate Ledger", headline: "A modest funding round keeps a local startup on its feet", summary: "A fictional report on the company you might have joined.", why_it_appears: "Timeline A assumes a follow-on round in Year 2." },
    { id: "f3", date_label: "January, Year 3", publication: "Elsewhere Journal", headline: "Rents rise again as the city's workforce grows", summary: "An invented cost-of-living story.", why_it_appears: "Higher living costs are a key trade-off in every timeline." },
  ],
  social: [
    { profile_label: "You, elsewhere", date_label: "Week 1", post: "Two suitcases, one ceiling fan, and an inbox that already feels too full. Here we go.", fictional_reactions: 42, why_it_appears: "The move is the first concrete consequence of the decision." },
    { profile_label: "You, elsewhere", date_label: "Year 2", post: "Shipped the thing. Slept for eleven hours. Would do it again, probably.", fictional_reactions: 118, why_it_appears: "Reflects the Year 2 milestone in Timeline A." },
  ],
  reflection: {
    summary:
      "The Bengaluru that you imagine holds speed, ownership and distance in equal measure. None of it is certain. What it may point to is a curiosity about responsibility and pace that still has room in the life you have now.",
    questions: [
      "What part of this alternate life genuinely appeals to me?",
      "Is there a small version of that possibility I can explore today?",
      "What have I gained from the path I actually took?",
    ],
  },
};
