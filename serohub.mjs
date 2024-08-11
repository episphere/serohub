//const Plotly = (await import("https://esm.sh/plotly.js@2.34.0")).default
const Plotly = (await import("https://episphere.github.io/plotly/esm.mjs")).esm
const localForage = (await import('https://esm.run/localforage@1.9.0/src/localforage.js')).default
const url = 'https://episphere.github.io/serohub/seroprevalence.json.zip'
let seroHub={
    loadedAt:Date(),
    loadedFrom:url
}
let dt = await localForage.getItem('seroHub_Prevalence')
//if(true){
if(!dt){
    const loadZip = (await import('https://episphere.github.io/serohub/loadZip.mjs'))
    dt = await loadZip.loadZippedFiles(url)
    localForage.setItem('seroHub_Prevalence',dt)
}
seroHub.seroprevalence=dt['seroprevalence.json']
// transpose
seroHub.variables = Object.keys(seroHub.seroprevalence.seroprevalences[0])
seroHub.values=function(variable='age'){
    if(typeof(variable)=='number'){
        variable = seroHub.variables[variable]
    }
    console.log(`reading variable "${variable}"`)
    return seroHub.seroprevalence.seroprevalences.map(row=>row[variable])
}
seroHub.uniqueValues=function(variable='age'){
    if(typeof(variable)=='number'){
        variable = seroHub.variables[variable]
    }
    console.log(`unique values for "${variable}"`)
    return [... new Set(seroHub.seroprevalence.seroprevalences.map(row=>row[variable]))]
}
// Plots



export{
    seroHub
}