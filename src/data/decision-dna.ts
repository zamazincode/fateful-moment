import type { ImageSource } from "expo-image";

export type TraitId = "vision" | "courage" | "risk" | "control" | "empathy" | "ethics";

export type Trait = {
  id: TraitId;
  label: string;
};

// Clockwise from the top of the radar chart.
export const traits: Trait[] = [
  { id: "vision", label: "Vision" },
  { id: "courage", label: "Courage" },
  { id: "risk", label: "Risk" },
  { id: "control", label: "Control" },
  { id: "empathy", label: "Empathy" },
  { id: "ethics", label: "Ethics" },
];

export type ArchetypeId =
  | "cool-headed-strategist"
  | "cautious-innovator"
  | "brave-visionary"
  | "empathetic-leader"
  | "pragmatic-tactician"
  | "principled-resister"
  | "crisis-manager"
  | "reckless-charger"
  | "charismatic-manipulator"
  | "over-analyst"
  | "selfless-protector"
  | "harmonizer";

export type Archetype = {
  id: ArchetypeId;
  title: string;
  avatar: ImageSource | number;
};

export const archetypes: Record<ArchetypeId, Archetype> = {
  "cool-headed-strategist": {
    id: "cool-headed-strategist",
    title: "Cool-Headed Strategist",
    avatar: require("@/assets/avatar-images/cool-headed-strategist.webp"),
  },
  "cautious-innovator": {
    id: "cautious-innovator",
    title: "Cautious Innovator",
    avatar: require("@/assets/avatar-images/cautious-innovator.webp"),
  },
  "brave-visionary": {
    id: "brave-visionary",
    title: "Brave Visionary",
    avatar: require("@/assets/avatar-images/brave-visionary.webp"),
  },
  "empathetic-leader": {
    id: "empathetic-leader",
    title: "Empathetic Leader",
    avatar: require("@/assets/avatar-images/empathetic-leader.webp"),
  },
  "pragmatic-tactician": {
    id: "pragmatic-tactician",
    title: "Pragmatic Tactician",
    avatar: require("@/assets/avatar-images/pragmatic-tactician.webp"),
  },
  "principled-resister": {
    id: "principled-resister",
    title: "Principled Resister",
    avatar: require("@/assets/avatar-images/principled-resister.webp"),
  },
  "crisis-manager": {
    id: "crisis-manager",
    title: "Crisis Manager",
    avatar: require("@/assets/avatar-images/crisis-manager.webp"),
  },
  "reckless-charger": {
    id: "reckless-charger",
    title: "Reckless Charger",
    avatar: require("@/assets/avatar-images/reckless-charger.webp"),
  },
  "charismatic-manipulator": {
    id: "charismatic-manipulator",
    title: "Charismatic Manipulator",
    avatar: require("@/assets/avatar-images/charismatic-manipulator.webp"),
  },
  "over-analyst": {
    id: "over-analyst",
    title: "Over-Analyst",
    avatar: require("@/assets/avatar-images/over-analyst.webp"),
  },
  "selfless-protector": {
    id: "selfless-protector",
    title: "Selfless Protector",
    avatar: require("@/assets/avatar-images/selfless-protector.webp"),
  },
  harmonizer: {
    id: "harmonizer",
    title: "Harmonizer",
    avatar: require("@/assets/avatar-images/harmonizer.webp"),
  },
};

export type DecisionDna = {
  archetype: ArchetypeId;
  quote: string;
  // 0 to 100 per trait.
  scores: Record<TraitId, number>;
  patterns: string[];
  blindSpot: {
    trait: TraitId;
    question: string;
    description: string;
  };
};

// Static for now; later this is meant to be built from the choices made in the simulation.
export const decisionDna: DecisionDna = {
  archetype: "brave-visionary",
  quote:
    "You see the big picture and walk towards it - no matter the cost. Ethics sometimes take a back seat, but few surpass you in the courage to take action.",
  scores: {
    vision: 88,
    courage: 82,
    risk: 79,
    control: 55,
    empathy: 38,
    ethics: 31,
  },
  patterns: [
    "You are not afraid to take action under pressure. While others hesitate, you have already taken a step. This positions you as a natural leader in crisis moments.",
    "You prioritize long-term impact over short-term costs. You see the big picture — but this sometimes makes it difficult for you to see the people in front of you.",
    "When ethics conflict with interests, your tendency is clear: you choose the interest. This pattern repeated in 5 out of 6 scenarios. It works in the short term — but creates erosion of trust in the long term.",
  ],
  blindSpot: {
    trait: "ethics",
    question: "How much will you pay to win?",
    description:
      "Your vision and courage are strong — but your ethics score is your lowest dimension. While reaching big goals, you often overlook how those around you feel and what they sacrifice. Your leadership capacity is high, but the mark you leave is not always positive.",
  },
};
