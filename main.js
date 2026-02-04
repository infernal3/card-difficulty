const el = e => document.getElementById(e);
const bingocard = {
	req_pushed: new Set(),
	warn_flag: 0,
	time_total: 0,
	goals: []
};
window.addEventListener("load", () => {
	el("B").addEventListener("click", async function () {
		var stream = await fetch("https://api.hypixel.net/resources/skyblock/bingo");
		var object = await stream.json();
		var array = object.goals;
		el("AA").innerHTML = `Bingo #${object.id} (${object.name})<br>This bingo's modifier is ${object.modifier}.`;
		while (array.length > 0) {
			// Dynamic HTML creation
			var goal = array[0];
			var filteredLore = goal.lore.replaceAll(/\xA7./g, "");
			var TableObject = TABLE[filteredLore];
			var goalType = !!goal.tiers ? 0 : filteredLore.startsWith("Reach ") && filteredLore.endsWith(" Collection.") ? 1 : !TableObject || TableObject.time == "2147483647" ? 3 : 2;
			var string;
			var time_total0 = 0;
			switch (goalType) {
			case 0:
				string = `[COMMUNITY] ${filteredLore}`;
				break;
			case 1:
				var collection = goal.name.substring(0, goal.name.length - 10);
				var CollectionsObject = COLLECTION_GOALS[collection];
				if (!CollectionsObject) {
					string = `${filteredLore}<br><span style="color: #f00">No data found for Collection Goal.</span>`
				} else if (CollectionsObject == "Minion") {
					string = `${filteredLore}<br>This goal should be completed using Minions.`
				} else {
					var TimeEst = CollectionsObject.formula(goal.requiredAmount);
					time_total0 = isNaN(TimeEst) || TimeEst == 2147483647 ? 0 : TimeEst;
					if (!bingocard.req_pushed.has(CollectionsObject.requirement)) {
						bingocard.req_pushed.add(CollectionsObject.requirement);
						array.push({
							isRequirement: true,
							lore: CollectionsObject.requirement
						});
					}
					string = `${filteredLore}<br>Calculated Time Estimate: ${TimeEst.toFixed(2)} min`;
					if(CollectionsObject.requirement) {
						string += `<br>Requirements: ${CollectionsObject.requirement}`;
					}
				}
				break;
			case 2:
				string = filteredLore;
				if (TableObject.time == "Minion") {
					string += "<br>This goal should be completed using Minions.";
				} else {
					string += `<br>Time Estimate: ${TableObject.time} min`
				}
				if (TableObject.need) {
					string += `<br>Requirements: <a href=#${TableObject.need}>${TableObject.need}</a>`;
				}
				if (TableObject.obtain) {
					var string1 = "<br><br><div><div>Guide(s) for obtaining this goal:</div><ul>";
					for (const arg of TableObject.obtain) {
						string1 += `<li>${arg}</li>`;
					}
					string += string1 + "</ul></div>";
				}
				var TimeEst = parseInt(TableObject.time);
				time_total0 = isNaN(TimeEst) || TimeEst == 2147483647 ? 0 : TimeEst;
				if (!bingocard.req_pushed.has(TableObject.need)) {
					bingocard.req_pushed.add(TableObject.need);
					array.push({
						lore: TableObject.need,
						isRequirement: true
					});
				}
				break;
			default:
				if (filteredLore != "") bingocard.warn_flag++;
				string = `${filteredLore}<br><span style="color: #f00">No data found for this goal.</span>`;
				break
			}
			bingocard.time_total += time_total0;
			bingocard.goals.push({
				raw: goal, 
				html1: (goal.isRequirement && !goal.lore) ? "" : `<div ${goal.isRequirement ? `id="${goal.lore}" ` : ""}class="bingo-goal`,
				html2: `">${string}<br></div><br>`,
				object: TableObject || {},
				time: time_total0
			});
			array.shift();
		} // Post-generation
		el("C").textContent = (bingocard.time_total / 60).toFixed(2);
		el("B").style = "display: none;";
		for(const arg of bingocard.goals) {
			var recursiveSolve = function(param) {
				if(param.object && !param.raw.isRequirement) {
					var v = "";
					for(const arg of bingocard.goals) {
						if(param.object.need == arg.raw.lore && arg.raw.lore != "combat15" && arg.raw.lore != "hotm3") {
							v = arg;
							break;
						}
					}
					if (v) {
						console.log("recursiveSolve: adding "+JSON.stringify(v));
						return v.time + recursiveSolve(v);
					}
				}
				return 0;
			}
			var time = recursiveSolve(arg) + arg.time, color = "";
			if(time >= 60) {
				color = " hard";
			} else if (time >= 10) {
				color = " medium";
			} else if (time > 0) {
				color = " easy";
			}
			if(arg.html1) {
				el("root").innerHTML += arg.html1 + color + arg.html2;
			}
		}
		if (!!bingocard.warn_flag) el("A").textContent = `WARNING: Could not find data for ${bingocard.warn_flag} goal${bingocard.warn_flag==1?"":"s"}.`
	})
});
