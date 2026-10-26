import type { Wizard, Spell, NewWizard } from "./types";
import { Log, MeasureTime } from "./decorators";

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

export class WizardRepository extends Repository<Wizard> {

    // Méthode pour ajouter un nouveau sorcier
    addWizard(newWizard: NewWizard): Wizard {

        // Le premier identifiant commence à 1
        let nextId: number = 1;

        // Parcourir tous les sorciers enregistrés
        for (const wizard of this.getAll()) {

            // Trouver le prochain identifiant disponible
            if (wizard.id >= nextId) {
                nextId = wizard.id + 1;
            }
        }

        // Créer le nouveau sorcier avec son ID
        const wizard: Wizard = {
            ...newWizard,
            id: nextId
        };

        // Enregistrer le sorcier
        this.add(wizard);

        // Retourner le sorcier créé
        return wizard;
    }
}
export class SpellRepository extends Repository<Spell> {}
