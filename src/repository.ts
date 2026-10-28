
import type { Wizard, Spell, NewWizard } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

// Repository générique du professeur
export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

// Repository des sorciers
export class WizardRepository extends Repository<Wizard> {

  // =====================================
  // EXERCICE 1 : ADD NEW WIZARD
  // =====================================

  // Ajouter un sorcier avec un ID automatique
  addWizard(newWizard: NewWizard): Wizard {

    // Commencer avec un identifiant égal à 1
    let nextId: number = 1;

    // Parcourir les sorciers enregistrés
    for (const wizard of this.getAll()) {

      // Trouver le prochain identifiant disponible
      if (wizard.id >= nextId) {
        nextId = wizard.id + 1;
      }
    }

    // Créer le sorcier avec son identifiant
    const wizard: Wizard = {
      ...newWizard,
      id: nextId
    };

    // Enregistrer le sorcier
    this.add(wizard);

    // Retourner le sorcier créé
    return wizard;
  }

  // =====================================
  // EXERCICE 2 : FIND WIZARDS BY HOUSE
  // =====================================

  // Rechercher les sorciers appartenant à une maison
  findByHouse(house: Wizard["house"]): Wizard[] {

    // Récupérer tous les sorciers et filtrer par maison
    return this.getAll().filter(
      wizard => wizard.house === house
    );
  }
}

// =====================================
// EXERCICE 4 : VALIDATE SPELL POWER
// =====================================

export class SpellRepository extends Repository<Spell> {

    // Vérifier la puissance avant d'ajouter un sort
    @ValidateSpellPower
    override add(spell: Spell): void {

        // Appeler la méthode add() du Repository parent
        super.add(spell);
    }
}
