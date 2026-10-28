
import {
  type Wizard,
  type Spell,
  type AcademyEvent,
  type House,
  type HousePoints,
  type SpellCategory,
  type SpellOutput,
  type ArrayElement,
  type WizardSummary,
  type WizardUpdate,
  type AttackSpell,
  type NonHealingCategory,
  type SpellCastEvent,
} from "./types";

import { WizardRepository, SpellRepository } from "./repository";
import { Log, Cache } from "./decorators";

// =====================================
// EXERCICE 6 : TYPE GUARD
// =====================================

// Tableau des quatre maisons autorisées
const validHouses: readonly House[] = [
  "Gryffindor",
  "Slytherin",
  "Ravenclaw",
  "Hufflepuff"
];

// Vérifier si une maison est valide
function isHouse(value: unknown): value is House {
  return (
    typeof value === "string" &&
    validHouses.some(house => house === value)
  );
}

// Vérifier si un objet est un sorcier valide
function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean"
  );
}

// =====================================
// CODE ORIGINAL DU PROFESSEUR
// =====================================

class AcademyService {
  constructor(
    private readonly wizards: WizardRepository,
    private readonly spells: SpellRepository
  ) {}

  @Log
  castSpell(wizardId: number, spellId: number): string {
    const wizard = this.wizards.findById(wizardId);
    const spell = this.spells.findById(spellId);

    if (!wizard || !spell) {
      throw new Error("Wizard or spell not found");
    }

    return `${wizard.name} casts ${spell.name}!`;
  }

  findByHouse(house: House): WizardSummary[] {
    return this.wizards
      .getAll()
      .filter(wizard => wizard.house === house)
      .map(({ id, name, house }) => ({ id, name, house }));
  }

  updateWizard(id: number, changes: WizardUpdate): boolean {
    return this.wizards.update(id, changes);
  }

  getSpellEvents(
    events: AcademyEvent[]
  ): Extract<AcademyEvent, { type: "spell-cast" }>[] {
    return events.filter(
      (event): event is Extract<AcademyEvent, { type: "spell-cast" }> =>
        event.type === "spell-cast"
    );
  }
}

// Création des repositories
const wizards = new WizardRepository();
const spells = new SpellRepository();

// Enregistrer les sorciers
wizards.add({
  id: 1,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  patronus: "Stag"
});

wizards.add({
  id: 2,
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 8,
  active: true
});

wizards.add({
  id: 3,
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 6,
  active: true
});

// Enregistrer les sorts
spells.add({
  id: 101,
  name: "Expelliarmus",
  category: "attack",
  power: 80
});

spells.add({
  id: 102,
  name: "Protego",
  category: "defense",
  power: 60
});

const academy = new AcademyService(wizards, spells);

// Tester le lancement d'un sort
console.log("\n--- Cast a spell ---");
console.log(academy.castSpell(1, 101));

// Rechercher les sorciers par maison
console.log("\n--- Find wizards by house ---");
console.log(academy.findByHouse("Gryffindor"));

// Modifier un sorcier
console.log("\n--- Update a wizard ---");
academy.updateWizard(1, { level: 6 });
console.log(wizards.findById(1));

// Tester le Type Guard
console.log("\n--- Type guard ---");
const unknownWizard: unknown = wizards.findById(1);

if (isWizard(unknownWizard)) {
  console.log(`${unknownWizard.name} belongs to ${unknownWizard.house}`);
}

// Tester Record
console.log("\n--- Record utility type ---");

const points: HousePoints = {
  Gryffindor: 100,
  Slytherin: 80,
  Ravenclaw: 90,
  Hufflepuff: 70
};

console.log(points);

// Tester Extract
console.log("\n--- Extract spell-cast events ---");

const events: AcademyEvent[] = [
  { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
  { type: "level-up", wizardId: 2, newLevel: 9 },
  { type: "wizard-expelled", wizardId: 3 }
];

console.log(academy.getSpellEvents(events));

// Exemples de types du professeur
type CastArguments = Parameters<AcademyService["castSpell"]>;
type CastResult = ReturnType<AcademyService["castSpell"]>;
type AttackOutput = SpellOutput<"attack">;
type HealingOutput = SpellOutput<"healing">;
type SpellItem = ArrayElement<Spell[]>;
type AttackSpellExample = AttackSpell;
type RemainingCategories = NonHealingCategory;
type CategoryExample = SpellCategory;

const typeExamples: [
  CastArguments,
  CastResult,
  AttackOutput,
  HealingOutput,
  SpellItem,
  AttackSpellExample["category"],
  RemainingCategories,
  CategoryExample
] | null = null;

void typeExamples;

// =====================================
// EXERCICE 1 : ADD NEW WIZARD
// =====================================

console.log("\n--- Exercise 1: Add New Wizard ---");

// Ajouter Luna sans donner son identifiant
const luna = wizards.addWizard({
  name: "Luna Lovegood",
  house: "Ravenclaw",
  level: 5,
  active: true
});

// Afficher le sorcier créé
console.log("New wizard:", luna);

// Vérifier son enregistrement
console.log("Saved wizard:", wizards.findById(luna.id));

// =====================================
// EXERCICE 2 : FIND WIZARDS BY HOUSE
// =====================================

console.log("\n--- Exercise 2: Find Wizards by House ---");

// Rechercher les sorciers par maison
console.log("Gryffindor:", wizards.findByHouse("Gryffindor"));

console.log("Slytherin:", wizards.findByHouse("Slytherin"));

console.log("Ravenclaw:", wizards.findByHouse("Ravenclaw"));

console.log("Hufflepuff:", wizards.findByHouse("Hufflepuff"));

// =====================================
// EXERCICE 3 : SPELL CAST EVENT
// =====================================

// Fonction pour gérer un événement de lancement de sort
function handleSpellCast(event: SpellCastEvent): void {
  console.log(
    `Wizard ${event.wizardId} cast ${event.spellName}`
  );
}

// Tester la fonction
console.log("\n--- Exercise 3: Spell Cast Event ---");

handleSpellCast({
  type: "spell-cast",
  wizardId: 1,
  spellName: "Expelliarmus"
});

// =====================================
// EXERCICE 4 : VALIDATE SPELL POWER
// =====================================

console.log("\n--- Exercise 4: Validate Spell Power ---");

// Ajouter un sort valide
spells.add({
  id: 103,
  name: "Protego Maxima",
  category: "defense",
  power: 50
});

// Essayer d'ajouter un sort invalide
try {
  spells.add({
    id: 104,
    name: "Invalid Spell",
    category: "attack",
    power: -10
  });
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log("Spell refused:", error.message);
  }
}

// Vérifier les enregistrements
console.log("Valid spell:", spells.findById(103));
console.log("Invalid spell:", spells.findById(104));

// =====================================
// EXERCICE 5 : CACHE DECORATOR
// =====================================

console.log("\n--- Exercise 5: Cache Decorator ---");

// Classe pour calculer la puissance d'un sort
class SpellCalculator {

  // Décorateur de mise en cache
  @Cache
  calculatePower(basePower: number, multiplier: number): number {

    // Ce message apparaît uniquement si le calcul est exécuté
    console.log("Calculating...");

    return basePower * multiplier;
  }
}

// Créer un calculateur
const calculator = new SpellCalculator();

// Premier appel : CACHE MISS
console.log(calculator.calculatePower(10, 3));

// Deuxième appel : CACHE HIT
console.log(calculator.calculatePower(10, 3));

// Troisième appel : CACHE MISS
console.log(calculator.calculatePower(5, 2));

// =====================================
// EXERCICE 6 : TYPE GUARD
// =====================================

console.log("\n--- Exercise 6: Type Guard ---");

// Test 1 : Sorcier avec une maison valide
const validData: unknown = {
  id: 1,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true
};

// Test 2 : Sorcier avec une maison invalide
const invalidData: unknown = {
  id: 2,
  name: "Viktor",
  house: "Durmstrang",
  level: 5,
  active: true
};

// Vérifier les deux sorciers
console.log("Valid wizard:", isWizard(validData));
console.log("Invalid wizard:", isWizard(invalidData));
