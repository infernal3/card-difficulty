// returns crops per minute
function calculateFarming(ff=202.5, mult=1, efficiency=1) {
    return (1 + (ff * 0.01)) * mult * efficiency * 1200;
}

// returns mining resources per minute
function calculateMining(bs=600, ms=1150, mf=180, em=54, pickobulusMult=30, mult=1, efficiency=1) {
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
        bayou_sludge: {level: 15, weight: 200},
        alligator: {level: 20, weight: 50}
    }, galatea: {
        bogged: {level: 5, weight: 5000},
        wetwing: {level: 7, weight: 2875},
        tadgang: {level: 5, weight: 1500},
        ent: {level: 12, weight: 500},
        the_loch_emperor: {level: 20, weight: 100}
    }
}
// returns an object with fishing stats per minute.
function calculateFishing(scc=33, fs=69, fl=13, tc=2.5, region="water", mult=1) {
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
    var totalweight = 0, object = {};
    for(const arg of pool) {
        totalweight += arg.weight;
        object[arg.name] = 0;
    }
    if(region.includes("park")) {
        object.squid += (scc * 0.01 * 4 / 9) * rolls * mult;
        object.night_squid = (scc * 0.01 * 2 / 9) * rolls * mult;
        totalweight *= 3;
    }
    for(const arg of pool) {
        object[arg.name] += (arg.weight / totalweight) * (scc * 0.01) * rolls * mult;
    }
    object.generic_any_sea_creature = scc * 0.01 * rolls * mult;
    object.generic_any = rolls * mult;
    object.generic_plain_fish = (1 - (scc * 0.01)) * rolls * mult * (1 - (tc * 0.01));
    object.generic_treasure = (1 - (scc * 0.01)) * rolls * mult * tc * 0.01;
    return object;
}

function calculateMinion(action_time=26, storage=64, mult=1) {
    var actions = 3600 / action_time;
    var rates = actions * mult;
    return {
        resource_gain_per_hour: rates,
        storage_filled_time: storage / rates * 3600,
    }
}

function calculateFishingMinion(action_time=75, storage=640, mult=1) {
    var x = calculateMinion(action_time, storage, mult);
    var storage_cap=parseInt(storage/64)-6;
    var used = 0;
    var storage = [0, 0, 0, 0, 0, 0];
    var time = 0;
    while(1 > 0){
        time += action_time / mult * 128;
        used++;
        storage[0] += 32;
        storage[1] += 16;
        storage[2] += 5;
        storage[3] += 4;
        storage[4] += 4;
        storage[5] += 4;
        for(i=0;i<6;i++){
            if(storage[i] >= 64){
                storage[i] = 0;
                used++;
            }
        }
        if(used >= storage_cap) break;
    }
    return {
        cod_per_hour: x.resource_gain_per_hour * 0.5,
        salmon_per_hour: x.resource_gain_per_hour * 0.25,
        pufferfish_per_hour: x.resource_gain_per_hour * 0.12,
        tropical_fish_per_hour: x.resource_gain_per_hour * 0.04,
        prismarine_shard_per_hour: x.resource_gain_per_hour * 0.03,
        prismarine_crystal_per_hour: x.resource_gain_per_hour * 0.03,
        sponge_per_hour: x.resource_gain_per_hour * 0.03,
        storage_filled_time: time
    }
}
