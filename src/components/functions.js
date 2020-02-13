function changeLife(a, b, c, d, e, f) {
    b = Math.round(100 * (b + Number.EPSILON)) / 100;

    if (isNaN(b)) return;

    "damage" == d
        ? a.clife -= b
        : a.clife += b;

    0 < b && showIndicator(e, f, b, c, a, d);
}

function showIndicator(a, b, c, d, e, f) {
    let g = { fire: "orange", regeneration: "lightgreen", poison: "green", crit1: "red", crit2: "yellow", crit4: "blue", crit8: "magenta", lifesteal: "darkred", bleed: "crimson", reflect: "gold" }[d];

    switch (d) {
        case "crit1": d = "physical"; break;
        case "crit2": d = "crit"; break;
        case "crit4": d = "supercrit"; break;
        case "crit8": d = "megacrit"; break;
        default:
    }

    b.push(`<div>${e.name} gets <span style="color:${g}">${c}</span> ${f} through ${d}</div>`);

    if (null == e.version) {
        a.push({ text: c, color: g });
        setTimeout(() => { try { a.shift() } catch{ } }, 500)
    }

}

function checkDot(a, b, c, d) {
    if (0 < a.status.poison) {
        changeLife(a, b.magic / 4, "poison", "damage", c, d);
        a.status.poison--
    }
    if (0 < a.status.fire) {
        changeLife(a, b.magic / 3, "fire", "damage", c, d),
            a.status.fire--
    }
    if (0 < a.status.bleed) {
        changeLife(a, b.dmg / 10, "bleed", "damage", c, d),
            a.status.bleed--
    }

    0 < a.status.slow && a.status.slow--;
}

function checkRegeneration(a, b, c) {
    if (a.status.bury <= 0) {
        a.regeneration + a.clife <= a.life
            ? changeLife(a, a.regeneration, "regeneration", "heal", b, c)
            : changeLife(a, a.life - a.clife, "regeneration", "heal", b, c)
    } else {
        (a.regeneration * 4) + a.clife <= a.life
            ? changeLife(a, (a.regeneration * 10), "regeneration", "heal", b, c)
            : changeLife(a, a.life - a.clife, "regeneration", "heal", b, c)
    }
}

function checkChance(a) {
    return !!(null != a && Math.floor(10001 * Math.random()) <= 100 * a)
}

function checkDodge(a, b) {
    if (null != b.chance) {
        if (null != a.effects)
            if (a.effects.precision != null)
                if (checkChance(b.chance.dodge - a.effects.precision))
                    return true;

        if (checkChance(b.chance.dodge))
            return true;
    }
    return false;
}

function checkDouble(a) {
    return !!checkChance(a.chance.double)
}

function checkPoison(a, b, l) {
    if (checkChance(a.chance.poison)) {
        b.status.poison++;
        l.push(`<div>${a.name} <span style="color:green">poisoned</span> ${b.name}</div>`)
    }
}

function checkBleed(a, b, l) {
    if (checkChance(a.chance.bleed)) {
        b.status.bleed++;
        l.push(`<div>${a.name} <span style="color:crimson">cuted</span> ${b.name}</div>`)
    }
}

function checkFire(a, b, l) {
    if (checkChance(a.chance.fire)) {
        b.status.fire++;
        l.push(`<div>${a.name} <span style="color:orange">burned</span> ${b.name}</div>`)
    }
}

function checkInstakill(a, b) {
    return !!checkChance(a.chance.instakill) && (b.clife = -1)
}

function checkSlow(a, b, l) {
    if (checkChance(a.chance.slow)) {
        b.status.slow++;
        l.push(`<div>${a.name} <span style="color:lightgrey">slowed</span> ${b.name}</div>`)
    }
}

function checkStun(a, b, l) {
    if (checkChance(a.chance.stun)) {
        b.status.stun++;
        l.push(`<div>${a.name} <span style="color:lightyellow">stunned</span> ${b.name}</div>`)
    }
}

function checkSilence(a, b, l) {
    if (checkChance(a.chance.silence)) {
        b.status.silence++;
        l.push(`<div>${a.name} <span style="color:white">silenced</span> ${b.name}</div>`)
    }
}

function checkBury(a, l) {
    if (checkChance(a.chance.bury)) {
        a.status.bury += 4;
        l.push(`<div>${a.name} <span style="color:white">buried</span> himself</div>`)
        return true;
    }
    return false;
}

function checkRot(a, b, l) {
    if (checkChance(a.chance.rot)) {
        b.status.rot++;
        l.push(`<div>${a.name} <span style="color:darkred">casted rot on</span> ${b.name}</div>`)
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

export function checkTurn(target, attacker, arr, log, list, kong, disfi, exit) {

    if (checkSpeed(target)) {
        return;
    }

    checkDot(target, attacker, arr, log);

    if (checkStunTurn(target)) {
        checkDeath(target, attacker, log, kong, list, disfi, exit)
        return;
    }

    if (!checkRotTurn(target)) {
        checkRegeneration(target, arr, log)
    }

    if (checkBuryTurn(target)) {
        return;
    }

    let att = false, crit = 1;

    if (checkDodge(target, attacker)) {
        log.push(`<div>${attacker.name} <span style="color:brown">dodged</span></div>`);
        return;
    }

    if (target.status.silence <= 0) {
        if (null != target.chance) {

            if (checkInstakill(target, attacker)) {
                log.push(`<div>${target.name} <span style="color:purple">instakilled</span> ${attacker.name}</div>`)
                checkDeath(target, attacker, log, kong, list, disfi, exit)
                return;
            }

            att = checkDouble(target);

            if (checkBury(target, log)) {
                return;
            }

            checkRot(target, attacker, log)
            checkPoison(target, attacker, log)
            checkBleed(target, attacker, log)
            checkFire(target, attacker, log)
            checkSlow(target, attacker, log)
            checkStun(target, attacker, log)
            checkSilence(target, attacker, log)
            checkChance(target.chance.crit, log)
                && (crit = 2,
                    checkChance(target.chance.supercrit)
                    && (crit = 4,
                        checkChance(target.chance.megacrit)
                        && (crit = 8)));
        }
    } else {
        target.status.silence--;
    }

    let block = checkBlock(attacker)

    animateObject(list, "animated");
    checkCrit(crit, attacker, target, block, arr, log)

    att && setTimeout(() => {
        try {
            arr.shift(),
                log.push(`<div>${target.name} attacks second time<div>`),
                checkCrit(crit, scrit, mcrit, attacker, target, block, arr, log)
        } catch{ }
    }, 500);

    checkDeath(target, attacker, log, kong, list, disfi, exit)
}

function checkCrit(crit, attacker, target, block, arr, log) {
    let dmg = target.dmg * crit - block;
    if (0 < dmg) {
        changeLife(attacker, dmg, "crit" + crit, "damage", arr, log);
        checkReflect(target, attacker, dmg, arr, log);
        checkLifesteal(target, dmg, arr, log);
    } else {
        log.push(`<div>${c.name} can't do any damage to ${b.name}</div>`)
    }
}

function checkReflect(a, b, c, d, e) {
    if (b.effects != null) {
        if (b.effects.reflect != null) {
            console.log(c * (b.effects.reflect / 100))
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
    0 < a.status.slow
        ? a.cspeed += 80
        : a.cspeed += 100;

    if (a.cspeed >= a.speed) {
        a.cspeed = 0
        return false;
    }
    return true;
}

function animateObject(a, b) {
    if (0 < a.length) {
        a.add(b);
        setTimeout(() => { try { a.remove(b) } catch{ } }, 500)
    }
}

function checkEnemyDeath(target, attacker, log, kong, enemyimage, func, res) {

    if (attacker.chance != null) {
        if (checkChance(attacker.chance.rescurrect)) {
            respawn(attacker);
            return;
        }
    }

    animateObject(enemyimage, "die");

    for (let a in attacker.gain)
        if ("effects" != a && "chance" != a && "speed" != a)
            target[a] += attacker.gain[a];
        else if ("speed" == a)
            target[a] -= attacker.gain[a];
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

        if (kong != undefined) {
            kong.stats.submit(attacker.id, target.time);
        }


        let lastboss = "chulthuluseye"
        switch (target.prestige) {
            case 0:
                lastboss = "chulthuluseye"
                break;

            case 1:
                lastboss = "necromant"
                break;

            default:
                break;
        }
        (attacker.id == lastboss) && func();
    } else {
        log.push(`<div>${target.name} killed  ${attacker.name}</div>`);
    }
    respawn(attacker);
    checkCleared(target, attacker, res)
}

function checkDeath(target, attacker, log, kong, enemyimage, func, res) {
    if (target.version != null) {
        if (attacker.clife <= 0) {
            checkEnemyDeath(target, attacker, log, kong, enemyimage, func, res);
        }
        if (target.clife <= 0) {
            checkPlayerDeath(target, attacker, log, res)
        }
    } else {
        if (attacker.clife <= 0) {
            checkPlayerDeath(attacker, target, log, res)
        }
        if (target.clife <= 0) {
            checkEnemyDeath(attacker, target, log, kong, enemyimage, func, res);
        }
    }
}

export function respawn(t) {
    t.clife = t.life;
    t.cspeed = 0;
    t.status = {
        slow: 0, poison: 0, fire: 0, stun: 0, silence: 0, rot: 0, bleed: 0, bury: 0
    }
}

function checkPlayerDeath(a, b, c, d) {
    c.push(`<div>${b.name} killed  ${a.name}</div>`)
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