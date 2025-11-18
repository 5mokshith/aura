/**
***REMOVED*******REMOVED***Agent***REMOVED***registry***REMOVED***for***REMOVED***managing***REMOVED***and***REMOVED***routing***REMOVED***to***REMOVED***specialized***REMOVED***agents
***REMOVED****/

import***REMOVED***type***REMOVED***{***REMOVED***Agent***REMOVED***}***REMOVED***from***REMOVED***'./base';

/**
***REMOVED*******REMOVED***Registry***REMOVED***of***REMOVED***all***REMOVED***available***REMOVED***agents
***REMOVED*******REMOVED***Agents***REMOVED***will***REMOVED***be***REMOVED***registered***REMOVED***here***REMOVED***as***REMOVED***they***REMOVED***are***REMOVED***implemented
***REMOVED****/
const***REMOVED***agents:***REMOVED***Map<string,***REMOVED***Agent>***REMOVED***=***REMOVED***new***REMOVED***Map();

/**
***REMOVED*******REMOVED***Get***REMOVED***an***REMOVED***agent***REMOVED***by***REMOVED***name
***REMOVED*******REMOVED***@param***REMOVED***agentName***REMOVED***-***REMOVED***Name***REMOVED***of***REMOVED***the***REMOVED***agent***REMOVED***to***REMOVED***retrieve
***REMOVED*******REMOVED***@returns***REMOVED***The***REMOVED***agent***REMOVED***instance***REMOVED***or***REMOVED***undefined***REMOVED***if***REMOVED***not***REMOVED***found
***REMOVED****/
export***REMOVED***function***REMOVED***getAgent(agentName:***REMOVED***string):***REMOVED***Agent***REMOVED***|***REMOVED***undefined***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***agents.get(agentName);
}

/**
***REMOVED*******REMOVED***List***REMOVED***all***REMOVED***registered***REMOVED***agent***REMOVED***names
***REMOVED*******REMOVED***@returns***REMOVED***Array***REMOVED***of***REMOVED***agent***REMOVED***names
***REMOVED****/
export***REMOVED***function***REMOVED***listAgents():***REMOVED***string[]***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***Array.from(agents.keys());
}

/**
***REMOVED*******REMOVED***Register***REMOVED***an***REMOVED***agent***REMOVED***in***REMOVED***the***REMOVED***registry
***REMOVED*******REMOVED***@param***REMOVED***agent***REMOVED***-***REMOVED***Agent***REMOVED***instance***REMOVED***to***REMOVED***register
***REMOVED****/
export***REMOVED***function***REMOVED***registerAgent(agent:***REMOVED***Agent):***REMOVED***void***REMOVED***{
***REMOVED******REMOVED***agents.set(agent.name,***REMOVED***agent);
}

/**
***REMOVED*******REMOVED***Check***REMOVED***if***REMOVED***an***REMOVED***agent***REMOVED***is***REMOVED***registered
***REMOVED*******REMOVED***@param***REMOVED***agentName***REMOVED***-***REMOVED***Name***REMOVED***of***REMOVED***the***REMOVED***agent***REMOVED***to***REMOVED***check
***REMOVED*******REMOVED***@returns***REMOVED***True***REMOVED***if***REMOVED***the***REMOVED***agent***REMOVED***is***REMOVED***registered
***REMOVED****/
export***REMOVED***function***REMOVED***hasAgent(agentName:***REMOVED***string):***REMOVED***boolean***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***agents.has(agentName);
}
