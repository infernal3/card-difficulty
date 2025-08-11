# card-difficulty

The site is active at https://infernal3.github.io/card-difficulty.

## What does this site do?
The site essentially reads in the Hypixel API for the latest bingo card and gives a time estimate.
API Endpoint used: https://api.hypixel.net/v2/resources/skyblock/bingo

Learn more about Hypixel SkyBlock's Bingo event: https://wiki.hypixel.net/Bingo

Each goal is intended to be assigned a "raw time estimate" and a "requirement".
For example, the goal "Kill any tier II Slayer Boss within 80 seconds." is assigned a raw time estimate of **2** minutes and a requirement of **Combat 15**.
This system allows the delivery of somewhat accurate time estimates for an entire Bingo card while minimizing the most common forms of goal overlap.

## Does this take into account Community Goals?
No, community goals are not taken into account. The methods used are typically hardcoded a certain way.
For example, the method for combat level / Exterminator is hardcoded on 9k health endermen's rates.

## How are collection goals calculated?
The (manually done) collection goals are calculated assuming multiple things:
- 200 farming fortune
- 890 mining speed
- 150 mining fortune
- 48 mining spread
- 180 foraging fortune and 280 foraging fortune in The Park
- Does not take into account bingo pet collection item bonus
- Assumes maximum/optimal rates
