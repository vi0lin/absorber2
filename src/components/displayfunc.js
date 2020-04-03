export function getboni(tags) {
    let boni = { value: 1, chance: false };
    if (tags.includes("poisonous")) {
        boni.key = "poison";
        boni.chance = true
        boni.value = 5;
    } else if (tags.includes("fire")) {
        boni.key = "fire";
        boni.chance = true
        boni.value = 5;
    } else if (tags.includes("animal")) {
        boni.key = "speed";
        boni.value = 20;
    } else if (tags.includes("plant")) {
        boni.key = "regeneration";
        boni.value = 0.2;
    } else if (tags.includes("food")) {
        boni.key = "recovery";
        boni.value = 2;
    } else {
        boni.key = "life";
    }
    return boni;
}