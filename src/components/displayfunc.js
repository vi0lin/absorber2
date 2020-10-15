export function getboni(tags) {
    let boni = {};
    if (tags.includes("poisonous")) {
        boni.gain = {
            chance: {
                poison: 5
            }
        }
    } else if (tags.includes("fire")) {
        boni.gain = {
            chance: {
                fire: 5
            }
        }
    } else if (tags.includes("animal")) {
        boni.gain = {
            speed: 20
        }
    } else if (tags.includes("plant")) {
        boni.gain = {
            regeneration: 0.2
        }
    } else if (tags.includes("food")) {
        boni.gain = {
            recovery: 2
        }
    } else {
        boni.gain = {
            life: 1
        }
    }
    return boni;
}