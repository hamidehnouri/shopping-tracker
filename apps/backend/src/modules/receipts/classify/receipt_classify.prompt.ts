export function receiptClassifyPrompt(labels: string[]): string {
  return (
    "Classify the following receipt item labels and return ONLY JSON matching the schema. " +
    "Return one classification object per label in the same order. " +
    "Use taxonomy: department → category → subcategory → product. " +
    "department = broad area such as grocery, household, beauty, electronics, apparel, or other. " +
    "category = broad product group such as fruits, vegetables, dairy, meat, bakery, drinks, pantry, snacks, cleaning, frozen, or other. " +
    "subcategory = narrower family such as citrus, pome, allium, herbs, stalks, yogurt, eggs, bread_rolls, oil, condiments, poultry, leafy_greens. " +
    "product = normalized singular product name, lowercase, using underscores when needed. " +
    "Keep meaningful preparation differences. " +
    "Examples: Rahmspinat → creamed_spinach; Spinat → spinach; Olivenöl → olive_oil; Bio-Eier → egg; Tabasco Red Pepper → hot_sauce. " +
    "If classification is unclear, set department='other', category='other', subcategory=null, product=null. " +
    "\nLabels:\n" +
    labels.map((label, index) => `${index + 1}. ${label}`).join("\n")
  );
}
