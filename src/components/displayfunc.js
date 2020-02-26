export function displayEnemyStats(f) {
    let fil = JSON.parse(JSON.stringify(f));

    delete fil.cspeed;
    delete fil.clife;
    delete fil.name;
    delete fil.id;
    delete fil.boss;
    delete fil.max;
    delete fil.status;

    let out = "";

    for (let thing in fil)
        switch (thing) {
            case "effects":
                out += `<i>Effects:</i>`;
                for (let e in fil.effects)
                    out += `<div style='margin-left:10px'>${e} : ${fil.effects[e]}</div>`;
                break;

            case "chance":
                out += `<i>Chance:</i>`;
                for (let e in fil.chance)
                    out += `<div style='margin-left:10px'>${e} : ${fil.chance[e]}</div>`;
                break;

            case "gain":
                out += `<hr/><i>Absorb:</i>`;
                for (let n in fil.gain)
                    switch (n) {
                        case "chance":
                            out += `<div style='margin-left:10px'><i>Chance:</i></div>`;
                            for (let ab in fil.gain.chance)
                                out += `<div style='margin-left:20px'>${ab} : ${fil.gain.chance[ab]}</div>`;
                            break;

                        case "effects":
                            out += `<div style='margin-left:10px'><i>Effects:</i></div>`;
                            for (let ab in fil.gain.effects)
                                out += `<div style='margin-left:20px'>${ab} : ${fil.gain.effects[ab]}</div>`;
                            break;

                        default:
                            out += `<div style='margin-left:10px'>${n} : ${fil.gain[n]}</div>`;
                            break;
                    }
                break;

            default:
                fil[thing] > 0 && (out += `<div>${thing} : ${fil[thing]}</div>`);
                break;
        }
    return out;
}

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

            default:
                "number" == typeof a[c] && (b[c] = CustomRound(a[c]));
                break;
        }

    b.recovery < 0 && (b.recovery = 1);
    b.regeneration < 0 && (b.regeneration = 0);
    b.life <= 0 && (b.life = 1);
    b.speed < 110 && (b.speed = 110)
}