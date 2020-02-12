function ChangeLife(target, ammount, type, what, arr, log) {

    ammount = Math.round((ammount + Number.EPSILON) * 100) / 100

    "damage" == what
        ? target.clife -= ammount
        : target.clife += ammount

    if (0 < ammount) {
        showIndicator(arr, log, ammount, type, target, what)
    }
}

function showIndicator(arr, log, ammount, type, target, what) {
    let colortable = { "fire": "orange", "regeneration": "lightgreen", "poison": "green", "crit1": "red", "crit2": "yellow", "crit4": "blue", "crit8": "magenta", "lifesteal": "darkred" }
    let color = colortable[type]

    switch (type) {
        case "crit1":
            type = "physical"
            break;
        case "crit2":
            type = "crit"
            break;
        case "crit4":
            type = "supercrit"
            break;
        case "crit8":
            type = "megacrit"
            break;
        default:
            break;
    }

    log.push(`<div>${target.name} gets <span style="color:${color}">${ammount}</span> ${what} through ${type}<div>`)

    if (target.version == null) {
        arr.push({ text: ammount, color: color });
        setTimeout(() => {
            try {
                arr.shift();
            }
            catch{ }
        }, 500);
    }
}

function checkpoison(target, attacker, arr, log) {
    0 < target.status.poison &&
        (ChangeLife(target, attacker.magic / 4, "poison", "damage", arr, log),
            target.status.poison--);

    0 < target.status.fire
        && (ChangeLife(target, attacker.magic / 3, "fire", "damage", arr, log),
            target.status.fire--);

    0 < target.status.slow
        && target.status.slow--;
}

function checkRegeneration(target, arr, log) {
    target.regeneration + target.clife <= target.life
        ? ChangeLife(target, target.regeneration, "regeneration", "heal", arr, log)
        : ChangeLife(target, target.life - target.clife, "regeneration", "heal", arr, log)
}


export function checkTurn(target, attacker, arr, log, list) {
    checkpoison(target, attacker, arr, log);
    if (checkStun(target)) {
        let dodge = false, att = false, crit = 1, block = 0;

        checkRegeneration(target, arr, log)

        null != attacker.chance &&
            null != attacker.chance.dodge &&
            Math.floor(10001 * Math.random()) <= 100 * attacker.chance.dodge &&
            (dodge = true);


        if (!dodge) {
            if (null != target.chance) {
                if (target.status.silence <= 0) {

                    if (target.chance.double != null) {
                        Math.floor(10001 * Math.random()) <= 100 * target.chance.double &&
                            (att = true)
                    }

                    if (target.chance.poison != null) {
                        Math.floor(10001 * Math.random()) <= 100 * target.chance.poison &&
                            (attacker.status.poison++ ,
                                log.push(`<div>${target.name} <span style="color:green">poisoned</span> ${attacker.name}<div>`));
                    }

                    if (target.chance.instakill != null) {
                        Math.floor(10001 * Math.random()) <= 100 * target.chance.instakill
                            && (attacker.clife = -1,
                                log.push(`<div>${target.name} <span style="color:purple">instakilled</span> ${attacker.name}<div>`));
                    }

                    if (target.chance.fire != null) {

                        Math.floor(10001 * Math.random()) <= 100 * target.chance.fire &&
                            (attacker.status.fire++ ,
                                log.push(`<div>${target.name} <span style="color:orange">burned</span> ${attacker.name}<div>`));
                    }

                    if (target.chance.slow != null) {
                        Math.floor(10001 * Math.random()) <= 100 * target.chance.slow &&
                            (attacker.status.slow++ ,
                                log.push(`<div>${target.name} <span style="color:lightgrey">slowed</span> ${attacker.name}<div>`));
                    }

                    if (target.chance.stun != null) {
                        Math.floor(10001 * Math.random()) <= 100 * target.chance.stun &&
                            (attacker.status.stun++ ,
                                log.push(`<div>${target.name} <span style="color:lightyellow">stunned</span> ${attacker.name}<div>`));
                    }

                    if (target.chance.silence != null) {
                        Math.floor(10001 * Math.random()) <= 100 * target.chance.silence &&
                            (attacker.status.silence++ ,
                                log.push(`<div>${target.name} <span style="color:white">silenced</span> ${attacker.name}<div>`));
                    }


                    if (target.chance.crit != null) {
                        if (Math.floor(Math.random() * 10001) <= target.chance.crit * 100) {
                            crit = 2;
                            if (target.chance.supercrit != null) {
                                if (Math.floor(Math.random() * 10001) <= target.chance.supercrit * 100) {
                                    crit = 4;
                                    if (target.chance.megacrit != null) {
                                        if (Math.floor(Math.random() * 10001) <= target.chance.megacrit * 100) {
                                            crit = 8;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    target.status.silence--;
                }
            }


            attacker.effects != null &&
                attacker.effects.block != null &&
                (block = attacker.effects.block);


            animateObject(list, "animated");
            checkCrit(crit, attacker, target, block, arr, log)

            if (att) {
                setTimeout(() => {
                    try {
                        arr.shift();
                        log.push(`<div>${target.name} attacks second time<div>`)
                        checkCrit(crit, scrit, mcrit, attacker, target, block, arr, log)
                    }
                    catch{ }
                }, 500);
            }
        } else {
            log.push(`<div>${attacker.name} dodged<div>`);
        }
    }
}

function checkCrit(crit, attacker, target, block, arr, log) {
    let dmg = (target.dmg * crit) - block
    ChangeLife(attacker, dmg, "crit" + crit, "damage", arr, log)
    checklifesteal(target, dmg, arr, log);
}

function checklifesteal(target, dmg, arr, log) {
    null != target.effects &&
        null != target.effects.lifesteal &&
        (target.clife + dmg * (target.effects.lifesteal / 100) <= target.life
            ? ChangeLife(target, dmg * (target.effects.lifesteal / 100), "lifesteal", "heal", arr, log)
            : ChangeLife(target, target.life - target.clife, "lifesteal", "heal", arr, log));
}




export function checkSpeed(target) {
    target.cspeed +=
        0 < target.status.slow
            ? 80
            : 100;

    if (target.cspeed >= target.speed) {
        target.cspeed = 0;
        return true;
    }
    return false;
}




export function animateObject(list, name) {
    if (list.length > 0) {
        list.add(name);
        setTimeout(() => {
            try {
                list.remove(name);
            } catch { }
        }, 500);
    }
}

export function absorbEnemy(target, attacker, log, kong, enemyimage, func) {
    log.push(`<div>${target.name} killed  ${attacker.name}<div>`);
    animateObject(enemyimage, "die");

    for (let a in attacker.gain)
        if ("effects" != a && "chance" != a && "speed" != a)
            target[a] += attacker.gain[a];
        else if ("speed" == a)
            target[a] -= attacker.gain[a];
        else if ("effects" == a)
            for (let b in attacker.gain.effects)
                target.effects[b] += attacker.gain.effects[b];
        else if ("chance" == a)
            for (let b in attacker.gain.chance)
                target.chance[b] += attacker.gain.chance[b];

    target.counter[attacker.id]++;

    if (attacker.boss) {
        target.sp++;
        target.highscore[attacker.id] = target.time;
        log.push(`<div>${attacker.name} was killed in ${target.time}<div>`)
        try {
            kong.stats.submit(attacker.id, target.time);
        } catch{
        }
        if (attacker.id == "chulthuluseye") {
            func();
        }
    }
}
export function respawn(target) {
    target.clife = target.life;
    target.cspeed = 0;
    target.status.slow = 0;
    target.status.poison = 0;
    target.status.stun = 0;
    target.status.silence = 0;
    target.status.fire = 0;
}

export function checkPlayerDeath(player, log, enemy) {
    if (player.clife <= 0) {
        log.push(`<div>${enemy.name} killed  ${player.name}<div>`);
        respawn(enemy);
        return true;
    }
    return false;
}


function checkStun(a) {
    return !!(0 >= a.status.stun)
        || (a.status.stun-- , !1)
}