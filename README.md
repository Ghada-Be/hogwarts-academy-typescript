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

**Résultat :** Luna a bien été enregistrée avec l'ID 4. ✅

**Prochaine étape :** Exercice 2 — Filtrer les sorciers par maison.
