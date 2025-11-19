/**
*Agentregistryformanagingandroutingtospecializedagents
*/

importtype{Agent}from'./base';

/**
*Registryofallavailableagents
*Agentswillberegisteredhereastheyareimplemented
*/
constagents:Map<string,Agent>=newMap();

/**
*Getanagentbyname
*@paramagentName-Nameoftheagenttoretrieve
*@returnsTheagentinstanceorundefinedifnotfound
*/
exportfunctiongetAgent(agentName:string):Agent|undefined{
returnagents.get(agentName);
}

/**
*Listallregisteredagentnames
*@returnsArrayofagentnames
*/
exportfunctionlistAgents():string[]{
returnArray.from(agents.keys());
}

/**
*Registeranagentintheregistry
*@paramagent-Agentinstancetoregister
*/
exportfunctionregisterAgent(agent:Agent):void{
agents.set(agent.name,agent);
}

/**
*Checkifanagentisregistered
*@paramagentName-Nameoftheagenttocheck
*@returnsTrueiftheagentisregistered
*/
exportfunctionhasAgent(agentName:string):boolean{
returnagents.has(agentName);
}
