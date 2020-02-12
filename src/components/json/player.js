var player = {
    "name": "Rimuro",
    "speed": 2500,
    "dmg": 1,
    "cspeed": 0,
    "magic": 1,
    "life": 10,
    "clife": 10,
    "regeneration": 0,
    "recovery": 1,
    "resistence": {
        "magic": 0,
        "physical": 0,
        "projectile": 0,
        "poison": 0,
        "fire": 0
    },
    "chance": {
        "slow": 0,
        "double": 0,
        "crit": 0,
        "supercrit": 0,
        "megacrit": 0,
        "stun": 0,
        "dodge": 0,
        "silence": 0,
        "fire": 0,
        "poison": 0,
        "instakill": 0
    },
    "effects": {
        "lifesteal": 0,
        "thornmail": 0,
        "block": 0,
        "spellvamp": 0
    },
    "counter": {},
    "skills": [],
    "sp": 1,
    "status": {
        "poison": 0,
        "stun": 0,
        "fire": 0,
        "silence": 0,
        "slow": 0
    },
    "time": 0,
    "auto": false,
    "lastenemy": "bat",
    "log": [],
    "version": 1.1,
    "highscore": {
        "vampire": -1,
        "hydra": -1,
        "iron_golem": -1,
        "chulthuluseye": -1
    },
    "tutorial": 0,
    "prestige": 0
}

export default player;