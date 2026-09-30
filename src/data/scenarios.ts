import type { ImageSource } from "expo-image";

// Media lives apart from the text so a scenario can point at its own set
// later; for now every scenario reuses the Iraq War assets.
export type ScenarioMedia = {
	cover: ImageSource | number;
	// Behind the options: one image for the first round, another for every round after it.
	backgrounds: {
		firstRound: ImageSource | number;
		laterRounds: ImageSource | number;
	};
	videos: {
		intro: number;
		// One per option, in option order.
		decisions: number[];
	};
};

export type Scenario = {
	id: string;
	title: string;
	// Card text on the Scenarios list.
	summary: string;
	// Longer text on the briefing before the simulation starts.
	briefing: string;
	// Length of the simulation in seconds.
	duration: number;
	// The five decisions, in the same order as media.videos.decisions.
	options: string[];
	media: ScenarioMedia;
};

const sharedOptions = [
	"Naval Quarantine: Blockade Cuba to stop the Soviet ships and negotiate in secret.",
	"Wait for Signal from Moscow",
	"Yield to Time Pressure: Launch on schedule despite the risks, under political and media pressure.",
	"Signal US Ships with Sonar",
	"Order an Air Strike on the Missile Sites",
];

const iraqWarMedia: ScenarioMedia = {
	cover: require("@/assets/scenarios/iraq-war/images/bg.webp"),
	backgrounds: {
		firstRound: require("@/assets/scenarios/iraq-war/images/bg-1.webp"),
		laterRounds: require("@/assets/scenarios/iraq-war/images/bg-2.webp"),
	},
	videos: {
		intro: require("@/assets/scenarios/iraq-war/videos/intro.mp4"),
		decisions: [
			require("@/assets/scenarios/iraq-war/videos/karar-1.mp4"),
			require("@/assets/scenarios/iraq-war/videos/karar-2.mp4"),
			require("@/assets/scenarios/iraq-war/videos/karar-3.mp4"),
			require("@/assets/scenarios/iraq-war/videos/karar-4.mp4"),
			require("@/assets/scenarios/iraq-war/videos/karar-5.mp4"),
		],
	},
};

export const scenarios: Scenario[] = [
	{
		id: "iraq-war",
		title: "Iraq War",
		summary:
			"2003. The Chemical Weapon Allegations Are On Your Desk. Your Decision Will Determine The Fate Of Millions.",
		briefing:
			"March 2003. Intelligence Says Iraq Is Hiding Weapons Of Mass Destruction, But The Evidence Is Thin And The UN Is Divided. The World Is Waiting For Your Call.",
		duration: 97,
		options: sharedOptions,
		media: iraqWarMedia,
	},
	{
		id: "cuban-missile-crisis",
		title: "Cuban Missile Crisis (1962)",
		summary:
			"A World On The Brink Of Nuclear Annihilation. You Are In Kennedy's Seat.",
		briefing:
			"October 1962. Soviet Missiles Are Being Installed In Cuba, 90 Miles From Florida. Every Hour Brings The World Closer To Nuclear War.",
		duration: 85,
		options: sharedOptions,
		media: iraqWarMedia,
	},
	{
		id: "chernobyl",
		title: "Chernobyl Disaster (1986)",
		summary:
			"A Reactor Has Exploded In The Night. Every Hour Of Silence Puts More Lives At Risk.",
		briefing:
			"April 1986. Reactor Four Is Burning And Radiation Is Spreading Over Pripyat. Evacuate And Admit The Disaster, Or Keep It Quiet And Buy Time.",
		duration: 102,
		options: sharedOptions,
		media: iraqWarMedia,
	},
	{
		id: "apollo-13",
		title: "Apollo 13 (1970)",
		summary:
			"An Oxygen Tank Has Exploded 200,000 Miles From Earth. Three Astronauts Are Counting On You.",
		briefing:
			"April 1970. Power And Oxygen Are Running Out On The Way To The Moon. Every Minute Counts, And Every Choice Could Be The Last One.",
		duration: 88,
		options: sharedOptions,
		media: iraqWarMedia,
	},
	{
		id: "berlin-wall",
		title: "Fall Of The Berlin Wall (1989)",
		summary:
			"Crowds Are Gathering At The Checkpoints. One Order Could Start A Massacre Or End A Division.",
		briefing:
			"November 1989. Thousands Are Pushing Against The Gates And The Guards Are Waiting For Orders. History Will Remember What You Decide Tonight.",
		duration: 91,
		options: sharedOptions,
		media: iraqWarMedia,
	},
	{
		id: "bay-of-pigs",
		title: "Bay Of Pigs Invasion (1961)",
		summary:
			"The Invasion Is Failing On The Beach. Air Support Could Save It, Or Start A War.",
		briefing:
			"April 1961. The Exile Brigade Is Pinned Down At Playa Girón. Send The Planes And Own The Invasion, Or Hold Back And Watch It Fall.",
		duration: 79,
		options: sharedOptions,
		media: iraqWarMedia,
	},
];
