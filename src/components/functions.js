import {
    log,
    dmgind,
    kong,
} from "./gloabals.js"

function changeLife(a, b, c, d) {
    b = Math.round(100 * (b + Number.EPSILON)) / 100;

    if (isNaN(b)) return;

    "damage" == d
        ? a.clife -= b
        : a.clife += b;

    0 < b && showIndicator(b, c, a, d);
}

function showIndicator(c, d, e, f) {
    let g = { fire: "orange", regeneration: "lightgreen", poison: "green", crit1: "red", crit2: "yellow", crit4: "blue", crit8: "magenta", lifesteal: "darkred", bleed: "crimson", reflect: "gold" }[d];

    switch (d) {
        case "crit1": d = "physical"; break;
        case "crit2": d = "crit"; break;
        case "crit4": d = "supercrit"; break;
        case "crit8": d = "megacrit"; break;
        default:
    }

    log.push(`<div>${e.name} gets <span style="color:${g}">${c}</span> ${f} through ${d}</div>`);

    if (null == e.version) {
        dmgind.push({ text: c, color: g });
        setTimeout(() => { try { dmgind.shift() } catch{ } }, 500)
    }

}

function checkDot(a, b, c) {
    if (0 < a.status.poison) {
        changeLife(a, b.magic / 4, "poison", "damage", c);
        a.status.poison--
    }
    if (0 < a.status.fire) {
        changeLife(a, b.magic / 3, "fire", "damage", c),
            a.status.fire--
    }
    if (0 < a.status.bleed) {
        changeLife(a, b.dmg / 10, "bleed", "damage", c),
            a.status.bleed--
    }

    0 < a.status.slow && a.status.slow--;
    0 < a.status.stim && a.status.stim--;
}

function checkRegeneration(a, b, c) {
    if (a.status.bury <= 0) {
        a.regeneration + a.clife <= a.life
            ? changeLife(a, a.regeneration, "regeneration", "heal", b, c)
            : changeLife(a, a.life - a.clife, "regeneration", "heal", b, c)
    } else {
        (a.regeneration * 10) + a.clife <= a.life
            ? changeLife(a, (a.regeneration * 10), "regeneration", "heal", b, c)
            : changeLife(a, a.life - a.clife, "regeneration", "heal", b, c)
    }
}

function checkChance(a, n) {
    if (a != null) {
        let p = Math.floor(10001 * Math.random());
        if (p <= 100 * a) {
            return true;
        }
    }
    return false;
}

function checkDodge(target, attacker) {
    if (null != attacker.chance) {
        if (null != target.effects)
            if (target.effects.precision != null)
                if (checkChance(attacker.chance.dodge - target.effects.precision, "dodge")) {
                    return true;
                } else {
                    return false;
                }


        if (checkChance(attacker.chance.dodge, "dodge"))
            return true;
    }
    return false;
}

function checkDouble(a) {
    return !!checkChance(a.chance.double, "double")
}

function checkPoison(a, b) {
    if (checkChance(a.chance.poison, "poison")) {
        b.status.poison++;
        log.push(`<div>${a.name} <span style="color:green">poisoned</span> ${b.name}</div>`)
    }
}



function checkBleed(a, b) {
    if (checkChance(a.chance.bleed, "bleed")) {
        b.status.bleed++;
        log.push(`<div>${a.name} <span style="color:crimson">sliced</span> ${b.name}</div>`)
    }
}

function checkFire(a, b) {
    if (checkChance(a.chance.fire, "fire")) {
        b.status.fire++;
        log.push(`<div>${a.name} <span style="color:orange">burned</span> ${b.name}</div>`)
    }
}

function checkInstakill(a, b) {
    return !!checkChance(a.chance.instakill, "instakill") && (b.clife = -1)
}

function checkSlow(a, b) {
    if (checkChance(a.chance.slow, "slow")) {
        b.status.slow++;
        log.push(`<div>${a.name} <span style="color:lightGrey">slowed</span> ${b.name}</div>`)
    }
}

function checkStim(a) {
    if (checkChance(a.chance.stim, "stim")) {
        a.status.stim++;
        log.push(`<div>${a.name} <span style="color:green">used Stimmpack</span></div>`)
    }
}

function checkStun(a, b) {
    if (checkChance(a.chance.stun, "stun")) {
        b.status.stun++;
        log.push(`<div>${a.name} <span style="color:lightYellow">stunned</span> ${b.name}</div>`)
    }
}

function checkSilence(a, b) {
    if (checkChance(a.chance.silence, "silence")) {
        b.status.silence++;
        log.push(`<div>${a.name} <span style="color:white">silenced</span> ${b.name}</div>`)
    }
}

function checkBury(a) {
    if (checkChance(a.chance.bury, "bury")) {
        a.status.bury += 4;
        log.push(`<div>${a.name} <span style="color:white">buried</span> himself</div>`)
        return true;
    }
    return false;
}

function checkRot(a, b) {
    if (checkChance(a.chance.rot, "rot")) {
        b.status.rot++;
        log.push(`<div>${a.name} <span style="color:darkred">casted rot on</span> ${b.name}</div>`)
    }
}

function checkBlock(a) {
    if (null != a.effects)
        if (null != a.effects.block)
            return a.effects.block
    return 0
}

function checkRotTurn(a) {
    if (a.status.rot > 0) {
        a.status.rot--;
        return true;
    }
    return false;
}

export function checkTurn(target, attacker, disfi, exit, classlist) {

    if (checkSpeed(target)) {
        return;
    }

    checkDot(target, attacker);

    if (!checkDeath(target, attacker, disfi, exit, classlist)) {
        return;
    }

    if (checkStunTurn(target)) {
        checkDeath(target, attacker, disfi, exit, classlist)
        return;
    }

    if (!checkRotTurn(target)) {
        checkRegeneration(target)
    }

    if (checkBuryTurn(target)) {
        return;
    }

    let att = false, crit = 1;

    if (checkDodge(target, attacker)) {
        log.push(`<div>${attacker.name} <span style="color:brown">dodged</span></div>`);
        checkDeath(target, attacker, disfi, exit, classlist);
        return;
    }

    if (target.status.silence <= 0) {
        if (null != target.chance) {

            if (checkInstakill(target, attacker)) {
                log.push(`<div>${target.name} <span style="color:purple">instakilled</span> ${attacker.name}</div>`)
                checkDeath(target, attacker, disfi, exit, classlist)
                return;
            }

            att = checkDouble(target);

            if (checkBury(target)) {
                return;
            }

            checkStim(target, attacker)
            checkRot(target, attacker)
            checkPoison(target, attacker)
            checkBleed(target, attacker)
            checkFire(target, attacker)
            checkSlow(target, attacker)
            checkStun(target, attacker)
            checkSilence(target, attacker)
            checkChance(target.chance.crit, "crit")
                && (crit = 2,
                    checkChance(target.chance.supercrit, "supercrit")
                    && (crit = 4,
                        checkChance(target.chance.megacrit, "megacrit")
                        && (crit = 8)));
        }
    } else {
        target.status.silence--;
    }

    let block = checkBlock(attacker)

    if (target.version != null) {
        animateObject("animated", classlist);
    }



    checkCrit(crit, attacker, target, block)

    att && setTimeout(() => {
        try {
            dmgind.shift(),
                log.push(`<div>${target.name} attacks second time<div>`),
                checkCrit(crit, scrit, mcrit, attacker, target, block)
        } catch{ }
    }, 500);

    checkCounter(target, attacker)

    checkDeath(target, attacker, disfi, exit, classlist)
}

function checkCounter(target, attacker) {
    if (attacker.chance != null) {
        if (checkChance(attacker.chance.counter, "counter")) {
            checkCrit(0, target, attacker, 0)
            log.push(`<div>${attacker.name} countered the attack</div>`)
        }
    }
}

function checkCrit(crit, attacker, target, block) {
    let dmg = target.dmg * crit - block;
    if (0 < dmg) {
        changeLife(attacker, dmg, "crit" + crit, "damage");
        checkReflect(target, attacker, target.dmg * crit);
        checkLifesteal(target, dmg);
    } else {
        log.push(`<div>${target.name} can't do any damage to ${attacker.name}</div>`)
    }
}

function checkReflect(a, b, c, d, e) {
    if (b.effects != null) {
        if (b.effects.reflect != null) {
            changeLife(a, c * (b.effects.reflect / 100), "reflect", "damage", d, e)
        }
    }

}

function checkLifesteal(a, b, c, d) {
    if (null != a.effects)
        if (null != a.effects.lifesteal) {
            a.clife + b * (a.effects.lifesteal / 100) <= a.life
                ? changeLife(a, b * (a.effects.lifesteal / 100), "lifesteal", "heal", c, d)
                : changeLife(a, a.life - a.clife, "lifesteal", "heal", c, d)
        }
}

function checkSpeed(a) {
    let sp = 100;

    0 < a.status.slow && (sp -= 20);
    0 < a.status.stim && (sp += 20);

    a.cspeed += sp;

    if (a.cspeed >= a.speed) {
        a.cspeed = 0
        return false;
    }
    return true;
}

function animateObject(b, classlist) {
    if (0 < classlist.length) {
        classlist.add(b);
        setTimeout(() => { try { classlist.remove(b) } catch{ } }, 500)
    }

}

function checkEnemyDeath(target, attacker, func, res, classlist) {

    if (attacker.chance != null) {
        if (checkChance(attacker.chance.resurrect, "resurrect")) {
            respawn(attacker);
            return;
        }
    }
    if (target.version != null) {
        animateObject("die", classlist);
    }

    for (let a in attacker.gain)
        if ("effects" != a && "chance" != a && "speed" != a)
            target[a] += attacker.gain[a];
        else if ("speed" == a) {
            if (attacker.gain[a] > 0) {
                if (target[a] > 110) {
                    target[a] -= attacker.gain[a];
                } else {

                    target.sspeed += attacker.gain[a];
                }
            } else {

                if (target.sspeed > 0) {

                    target.sspeed += attacker.gain[a];
                } else {

                    target[a] -= attacker.gain[a];
                }
            }
        }
        else if ("effects" == a)
            for (let b in attacker.gain.effects)
                target.effects[b] == null
                    ? target.effects[b] = attacker.gain.effects[b]
                    : target.effects[b] += attacker.gain.effects[b]
        else if ("chance" == a)
            for (let b in attacker.gain.chance)
                target.chance[b] == null
                    ? target.chance[b] = attacker.gain.chance[b]
                    : target.chance[b] += attacker.gain.chance[b];


    target.counter[attacker.id]++;

    if (attacker.boss) {
        target.sp++;
        target.highscore[attacker.id] = target.time;
        log.push(`<div>${attacker.name} was killed in ${target.time}</div>`)

        try { kong.stats.submit(attacker.id, target.time); } catch{ }


        let lastBoss = "chulthuluseye"
        if (target.prestige == 0) {
            lastBoss = "chulthuluseye"
        } else if (target.prestige == 1) {
            lastBoss = "necromant"
        } else if (target.prestige == 2) {
            lastBoss = "darlek"
        }

        (attacker.id == lastBoss) && func();
    } else {
        log.push(`<div>${target.name} killed  ${attacker.name}</div>`);
    }
    respawn(attacker);
    checkCleared(target, attacker, res)
}

function checkDeath(target, attacker, func, res, classlist) {
    if (target.version != null) {
        if (attacker.clife <= 0) {
            checkEnemyDeath(target, attacker, func, res, classlist);
            return false;
        }
        if (target.clife <= 0) {
            checkPlayerDeath(target, attacker, res)
            return false;
        }
    } else {
        if (attacker.clife <= 0) {
            checkPlayerDeath(attacker, target, res)
            return false;
        }
        if (target.clife <= 0) {
            checkEnemyDeath(attacker, target, func, res, classlist);
            return false;
        }
    }
    return true;
}

export function respawn(t) {
    t.clife = t.life;
    t.cspeed = 0;
    t.status = {
        slow: 0, poison: 0, fire: 0, stun: 0, silence: 0, rot: 0, bleed: 0, bury: 0, stim: 0
    }
}

function checkPlayerDeath(a, b, d) {
    log.push(`<div>${b.name} killed  ${a.name}</div>`)
    respawn(b)
    d();
}

function checkBuryTurn(a) {
    if (a.status.bury > 0) {
        a.status.bury--;
        return true;
    }
    return false;
}

function checkStunTurn(a) {
    if (a.status.stun > 0) {
        a.status.stun--;
        return true;
    }
    return false;
}

function checkCleared(a, b, d) {
    a.counter[b.id] >= b.max &&
        d();
}