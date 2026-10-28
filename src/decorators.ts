/**
 * Legacy TypeScript method decorator.
 * Enable "experimentalDecorators": true in tsconfig.json.
 */
export function Log(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  descriptor.value = function (
    this: unknown,
    ...args: unknown[]
  ): unknown {
    console.log(`[CALL] ${String(propertyKey)}`, args);

    try {
      const result = originalMethod.apply(this, args);
      console.log(`[RETURN] ${String(propertyKey)}`, result);
      return result;
    } catch (error: unknown) {
      console.error(`[ERROR] ${String(propertyKey)}`, error);
      throw error;
    }
  };
}

export function MeasureTime(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => unknown;

  descriptor.value = function (
    this: unknown,
    ...args: unknown[]
  ): unknown {
    const start = Date.now();

    try {
      return originalMethod.apply(this, args);
    } finally {
      console.log(
        `[TIME] ${String(propertyKey)}: ${Date.now() - start} ms`
      );
    }
  };
}
// =====================================
// EXERCICE 4 : VALIDATE SPELL POWER
// =====================================

// Décorateur pour vérifier la puissance d'un sort
export function ValidateSpellPower(
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
): void {

    // Sauvegarder la méthode originale
    const originalMethod = descriptor.value as (
        ...args: unknown[]
    ) => unknown;

    // Remplacer la méthode par une version avec validation
    descriptor.value = function (
        this: unknown,
        ...args: unknown[]
    ): unknown {

        // Récupérer le sort passé en paramètre
        const candidate: unknown = args[0];

        // Vérifier si le sort possède une puissance négative
        if (
            typeof candidate === "object" &&
            candidate !== null &&
            "power" in candidate &&
            typeof candidate.power === "number" &&
            candidate.power < 0
        ) {
            // Refuser le sort
            throw new Error("Spell power cannot be negative");
        }

        // Sinon, exécuter la méthode originale
        return originalMethod.apply(this, args);
    };
}