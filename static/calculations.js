// returns crops per minute
function calculateFarming(ff, mult, efficiency) {
    return (1 + (ff * 0.01)) * mult * efficiency * 1200;
}

// returns mining resources per minute
function calculateMining(bs, ms, mf, em, pickobulusMult, mult, efficiency) {
    var ticks = Math.round(30 * bs / ms);
    var tickSoftcap = ticks < 4 && ticks > 0 ? 4 : ticks;
    return ((1 + (mf * 0.01)) * mult * efficiency * (1 + (em * 0.01)) * (1200 / tickSoftcap)) + ((1 + (mf * 0.01)) * mult * efficiency * pickobulusMult);
}

const Fishing = {
    water: {
        squid: {level: 1, weight: 1200},
        sea_walker: {level: 1, weight: 800},
        sea_guardian: {level: 5, weight: 600},
        sea_witch: {level: 7, weight: 700},
        sea_archer: {level: 9, weight: 550},
        rider_of_the_deep: {level: 11, weight: 400},
        catfish: {level: 13, weight: 250},
        sea_leech: {level: 16, weight: 160},
        guardian_defender: {level: 17, weight: 130},
        deep_sea_protector: {level: 18, weight: 88},
        water_hydra: {level: 19, weight: 18}
    }, hotspot: {
        frog_man: {level: 5, weight: 1000},
        snapping_turtle: {level: 10, weight: 250},
    }, bayou: {
        dumpster_diver: {level: 5, weight: 500},
        trash_gobbler: {level: 5, weight: 750},
        banshee: {level: 10, weight: 300},
        bayou_sludge: {level: 15, weight: 200}
    }, galatea: {
        bogged: {level: 5, weight: 5000},
        wetwing: {level: 7, weight: 2875},
        tadgang: {level: 5, weight: 1500},
        ent: {level: 12, weight: 500}
    }
}
// returns an object with fishing stats per minute. runs simulation, outputs are random.
function calculateFishing(scc, fs, fl, region, mult) {
    if(!Fishing) return "An error ocurred. [Fishing] object not present."
    var lureTicks = 56 + 275 - ((fs / 300) * 275); // 300 = FS cap. 275 ticks = Base time to lure fish. 56 ticks = Base time for fish to bite + human reaction time.
    var rolls = 1200 / lureTicks;
    var pool = [];
    for(const arg in Fishing) {
        if(!region.includes(arg)) continue;
        for(const arg2 in Fishing[arg]) {
            if(Fishing[arg][arg2].level <= fl) {
                pool.push({weight: Fishing[arg][arg2].weight, name: arg2});
            } 
        }
    }
    var totalweight = 0;
    for(const arg of pool) totalweight += arg.weight;
    if(region.includes("park")) totalweight *= 3;
    var object = {};
    for(const arg of pool) {
        object[arg.name] = (arg.weight / totalweight) * (scc * 0.01) * rolls * mult;
    }
    if(region.includes("park")) {
        object.squid += (scc * 0.01 * 4 / 9) * rolls * mult;
        object.night_squid = (scc * 0.01 * 2 / 9) * rolls * mult;
    }
    object.generic_no_sea_creature = (1 - (scc * 0.01)) * rolls * mult;
    return object;
}
