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
} from "./types";

import { WizardRepository, SpellRepository } from "./repository";
import { Log, Cache } from "./decorators";
import type { SpellCastEvent } from "./types";

function isHouse(value: unknown): value is House {
  return (
    value === "Gryffindor" ||
    value === "Slytherin" ||
    value === "Ravenclaw" ||
    value === "Hufflepuff"
  );
}

// Type guard: safely narrow unknown data to a Wizard.
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

  getSpellEvents(events: AcademyEvent[]): Extract<AcademyEvent, { type: "spell-cast" }>[] {
    return events.filter(
      (event): event is Extract<AcademyEvent, { type: "spell-cast" }> =>
        event.type === "spell-cast"
    );
  }
}

const wizards = new WizardRepository();
const spells = new SpellRepository();

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

console.log("\n--- Cast a spell ---");
console.log(academy.castSpell(1, 101));

console.log("\n--- Find wizards by house ---");
console.log(academy.findByHouse("Gryffindor"));

console.log("\n--- Update a wizard ---");
academy.updateWizard(1, { level: 6 });
console.log(wizards.findById(1));

console.log("\n--- Type guard ---");
const unknownWizard: unknown = wizards.findById(1);
if (isWizard(unknownWizard)) {
  console.log(`${unknownWizard.name} belongs to ${unknownWizard.house}`);
}

console.log("\n--- Record utility type ---");
const points: HousePoints = {
  Gryffindor: 100,
  Slytherin: 80,
  Ravenclaw: 90,
  Hufflepuff: 70
};
console.log(points);

console.log("\n--- Extract spell-cast events ---");
const events: AcademyEvent[] = [
  { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
  { type: "level-up", wizardId: 2, newLevel: 9 },
  { type: "wizard-expelled", wizardId: 3 }
];
console.log(academy.getSpellEvents(events));

// Compile-time demonstrations: these aliases are checked by TypeScript.
type CastArguments = Parameters<AcademyService["castSpell"]>;
type CastResult = ReturnType<AcademyService["castSpell"]>;
type AttackOutput = SpellOutput<"attack">; // number
type HealingOutput = SpellOutput<"healing">; // string
type SpellItem = ArrayElement<Spell[]>; // Spell
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

// Afficher le titre de l'exercice
console.log("\n--- Exercise 1: Add New Wizard ---");

// Créer un nouveau sorcier sans donner son ID
const luna = wizards.addWizard({
    name: "Luna Lovegood",
    house: "Ravenclaw",
    level: 5,
    active: true
});

// Afficher le sorcier créé
console.log("New wizard:", luna);

// Vérifier que le sorcier est enregistré
console.log("Saved wizard:", wizards.findById(luna.id));
// =====================================
// EXERCICE 2 : FIND WIZARDS BY HOUSE
// =====================================

// Afficher le titre de l'exercice
console.log("\n--- Exercise 2: Find Wizards by House ---");

// Rechercher les sorciers de Gryffindor
console.log("Gryffindor:", wizards.findByHouse("Gryffindor"));

// Rechercher les sorciers de Slytherin
console.log("Slytherin:", wizards.findByHouse("Slytherin"));

// Rechercher les sorciers de Ravenclaw
console.log("Ravenclaw:", wizards.findByHouse("Ravenclaw"));

// Tester une maison sans sorciers enregistrés
console.log("Hufflepuff:", wizards.findByHouse("Hufflepuff"));
// =====================================
// EXERCICE 3 : SPELL CAST EVENT
// =====================================

// Fonction qui gère un événement de lancement de sort
function handleSpellCast(event: SpellCastEvent): void {

    // Afficher le sorcier et le sort utilisé
    console.log(
        `Wizard ${event.wizardId} cast ${event.spellName}`
    );
}

// Tester la fonction avec un événement
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

// Test 1 : Ajouter un sort valide
spells.add({
    id: 103,
    name: "Protego Maxima",
    category: "defense",
    power: 50
});

// Test 2 : Essayer d'ajouter un sort invalide
try {
    spells.add({
        id: 104,
        name: "Invalid Spell",
        category: "attack",
        power: -10
    });
} catch (error: unknown) {

    // Afficher le message d'erreur
    if (error instanceof Error) {
        console.log("Spell refused:", error.message);
    }
}

// Vérifier si les sorts sont enregistrés
console.log("Valid spell:", spells.findById(103));
console.log("Invalid spell:", spells.findById(104));

 // =====================================
 // EXERCICE 5 : CACHE DECORATOR
 // =====================================

 console.log("\n--- Exercise 5: Cache Decorator ---");

 // Classe pour calculer la puissance d'un sort
 class SpellCalculator {

     // Utiliser notre décorateur Cache
     @Cache
     calculatePower(basePower: number, multiplier: number): number {

         // Message affiché uniquement si le calcul est effectué
         console.log("Calculating...");

         // Calculer et retourner la puissance
         return basePower * multiplier;
     }
 }

 // Créer un objet SpellCalculator
 const calculator = new SpellCalculator();

 // Premier appel : calcul effectué et résultat enregistré
 console.log(calculator.calculatePower(10, 3));

 // Deuxième appel : récupérer le résultat du cache
 console.log(calculator.calculatePower(10, 3));

 // Troisième appel : nouveaux paramètres, nouveau calcul
 console.log(calculator.calculatePower(5, 2));
