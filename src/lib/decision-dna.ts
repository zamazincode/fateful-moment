import { traits, type Trait, type TraitId } from "@/data/decision-dna";

// The blind spot is the lowest scoring trait; on a tie the one earlier in `traits` wins.
export function lowestTrait(scores: Record<TraitId, number>): Trait {
  return traits.reduce((lowest, trait) => (scores[trait.id] < scores[lowest.id] ? trait : lowest));
}
