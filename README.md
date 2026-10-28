# 🪄 Hogwarts Academy — TypeScript

Mini-projet de 6 exercices pour pratiquer TypeScript, comprendre les concepts du cours et apprendre à coder de manière plus autonome.

 Exercice 1 — Add New Wizard 

 Objectif :** Ajouter un nouveau sorcier sans saisir son identifiant. Celui-ci doit être généré automatiquement.

 🛠️ Ma démarche

- **`types.ts`** : utilisation de `Pick` et `Omit` pour définir `NewWizard` sans `id`.
- **`repository.ts`** : création de `addWizard()` pour rechercher le prochain ID et enregistrer le sorcier.
- **`main.ts`** : test avec Luna Lovegood, qui reçoit automatiquement l'ID 4.

🔄 Fonctionnement

`NewWizard` → `addWizard()` → Génération de l'ID → Enregistrement → Vérification

 Mes difficultés

J'ai d'abord eu quelques soucis avec la configuration du projet : fichier `decorators.ts` manquant, script `typecheck` absent et conflit de README sur GitHub.

Après correction, les commandes `npm run typecheck` et `npm start` ont fonctionné.

###  Ce que j'ai appris

J'ai mieux compris les Utility Types (`Pick`, `Omit`), l'héritage, `this`, les boucles `for...of` et le fonctionnement d'un repository.

**Résultat :** Luna a bien été enregistrée avec l'ID 4. 

**Prochaine étape :** Exercice 2 — Filtrer les sorciers par maison.
Ma démarche

repository.ts : ajout de la méthode findByHouse() dans WizardRepository.

Utilisation de getAll() pour récupérer les sorciers et de .filter() pour sélectionner ceux de la maison recherchée.

main.ts : tests avec les quatre maisons.

 Fonctionnement

House → findByHouse() → getAll() → .filter() → Wizard[]

 Mes difficultés

Le point à comprendre était la fonction fléchée wizard => wizard.house === house et le fonctionnement de .filter().

Les tests ont réussi, y compris pour Hufflepuff, qui retourne un tableau vide [] puisqu'aucun sorcier n'y est enregistré.

 Ce que j'ai appris

J'ai mieux compris les tableaux, les fonctions fléchées, .filter() et le type Wizard["house"].

J'ai aussi retenu qu'une méthode qui retourne Wizard[] renvoie toujours un tableau, même lorsqu'un seul sorcier correspond.

Résultat : Harry et Hermione pour Gryffindor, Draco pour Slytherin, Luna pour Ravenclaw et aucun sorcier pour Hufflepuff.
## Exercice 3 — Spell Cast Event

**Objectif :** Gérer uniquement les événements de lancement de sorts à l'aide du Utility Type `Extract`.

### Ma démarche

- **`types.ts`** : création de `SpellCastEvent` avec `Extract` pour sélectionner uniquement les événements `spell-cast`.
- **`main.ts`** : implémentation de la fonction `handleSpellCast()` pour afficher le sorcier et le sort lancé.
- Test avec le sort `Expelliarmus`.

### Fonctionnement

`AcademyEvent` → `Extract` → `SpellCastEvent` → `handleSpellCast()`

### Mes difficultés

La principale notion à comprendre était la différence entre `Extract`, qui sélectionne des types, et `.filter()`, qui filtre des données.

J'ai également rencontré un refus de `git push`, car le dépôt distant contenait des modifications à récupérer.

### Ce que j'ai appris

J'ai appris à manipuler les unions de types, à utiliser `Extract` et à définir des paramètres de fonctions plus stricts avec TypeScript.

**Résultat :** `Wizard 1 cast Expelliarmus`
## Exercice 4 — Validate Spell Power

**Objectif :** Empêcher l'enregistrement d'un sort lorsque sa puissance est négative, en utilisant un décorateur TypeScript.

### Ma démarche

- **`decorators.ts`** : création du décorateur `ValidateSpellPower` pour vérifier la puissance avant l'enregistrement.
- **`repository.ts`** : application de `@ValidateSpellPower` à la méthode `add()` de `SpellRepository`.
- **`main.ts`** : tests avec un sort valide (`power: 50`) et un sort invalide (`power: -10`).

### Fonctionnement

`spells.add()` → `@ValidateSpellPower` → Vérification de `power` → Enregistrement ou erreur.

### Mes difficultés

J'ai rencontré une erreur `TS2305` car TypeScript ne reconnaissait pas l'exportation du décorateur dans `decorators.ts`.

J'ai également découvert le fonctionnement de `throw new Error()` et de `try/catch` pour intercepter une erreur sans interrompre tout le programme.

### Ce que j'ai appris

J'ai mieux compris les décorateurs, `override`, `super.add()` et la validation des données avant leur enregistrement.

J'ai aussi appris qu'un décorateur peut modifier le comportement d'une méthode sans changer directement sa logique principale.

**Résultat :** Le sort valide est enregistré, tandis que le sort de puissance négative est refusé. La recherche du sort invalide retourne `undefined`.


La compilation et l'exécution ont réussi.

