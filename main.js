        const el = e => document.getElementById(e);
        var req_pushed = new Set();
        var time_total = 0;
        window.addEventListener("load", () => {
             el("B").addEventListener("click", async function () {
                  var stream = await fetch("https://api.hypixel.net/resources/skyblock/bingo");
                  var object = await stream.json();
                  var array = object.goals;
                  while(array.length > 0){
                      // Dynamic HTML creation
                      var goal = array[0];
                      var filteredLore = goal.lore.replaceAll(/\xA7./g, "");
                      var TableObject = TABLE[filteredLore];
                      var goalType = !!goal.tiers ? 0 : (filteredLore.startsWith("Reach ") && filteredLore.endsWith(" Collection.")) ? 1 : !TableObject ? 3 : 2;
                      var string;
                      switch(goalType){
                          case 0:
                              string = `[COMMUNITY] ${filteredLore}`;
                              break;
                          case 1:
                              var collection = goal.name.substring(0, goal.name.length - 10);
                              var CollectionsObject = COLLECTION_GOALS[collection];
                              if(!CollectionsObject){
                                  string = `${filteredLore}<br><span style="color: #f00">No data found for Collection Goal.</span>`;
                              } else if (CollectionsObject == "Minion"){
                                  string = `${filteredLore}<br>No data found for Collection Goal.`;
                              } else {
                                  var TimeEst = CollectioneObject.formula(goal.requiredAmount);
                                  time_total += isNaN(TimeEst) || TimeEst == 2147483647 ? 0 : TimeEst;
                                  if(!req_pushed.has(CollectionsObject.requirement)) {
                                      req_pushed.add(CollectionsObject.requirement);
                                      array.push({lore: CollectionsObject.requirement});
                                  }
                                  string = `${filteredLore}<br>Calculated Time Estimate: ${TimeEst.toFixed(2)} min<br>Requirements (if any): ${CollectionsObject.requirement}`;
                              }
                              break;
                          case 2:
                              string = `${filteredLore}<br>Base Time Estimate: ${TableObject.time} min<br>Requirements (if any): ${TableObject.need}`;
                              var TimeEst = parseInt(TableObject.time);
                              time_total += isNaN(TimeEst) || TimeEst == 2147483647 ? 0 : TimeEst;
                              if(!req_pushed.has(TableObject.need)) {
                                  req_pushed.add(TableObject.need);
                                  array.push({lore: TableObject.need});
                              }
                              break;
                          default:
                              string = `${filteredLore}<br><span style="color: #f00">No data found for this goal.</span>`;
                              break;
                      }
                      el("root").innerHTML += "<div>" + string + "<br></div><br>";
                      
                      array.shift();
                  } // Post-generation
                  el("C").textContent = (time_total/60).toFixed(2);
                  el("B").style = "display: none;";
             });
        });
