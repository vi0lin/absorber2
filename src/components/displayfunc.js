function CustomRound(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function RoundAll(a, b) {
    for (let c in a)
        switch (c) {
            case "effects":
                for (let c in a.effects) b.effects[c] = CustomRound(a.effects[c]);
                break;

            case "chance":
                for (let c in a.chance) b.chance[c] = CustomRound(a.chance[c])
                break;

            case "resistance":
                for (let c in a.resistance) b.resistance[c] = CustomRound(a.resistance[c])
                break;

            default:
                "number" == typeof a[c] && (b[c] = CustomRound(a[c]));
                break;
        }

    b.recovery < 0 && (b.recovery = 1);
    b.regeneration < 0 && (b.regeneration = 0);
    b.life <= 0 && (b.life = 1);
    b.speed < 110 && (b.speed = 110)
}


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