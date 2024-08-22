
let Plotly
/*
try{
    Plotly = (await import("https://esm.sh/plotly.js@2.34.0")).default
} catch(err){
    Plotly = await require("https://cdn.plot.ly/plotly-2.34.0.min.js")
}
*/
if(typeof(define)=='undefined'){
    Plotly = (await import("https://esm.sh/plotly.js@2.34.0")).default
}else{
    define(['https://cdn.plot.ly/plotly-2.34.0.min.js'],[function(mod){Plotly=mod}])
}
console.log(`ploting with`,Plotly)
//const Plotly = (await import("https://episphere.github.io/plotly/esm.mjs")).esm
const localForage = (await import('https://esm.run/localforage@1.9.0/src/localforage.js')).default
const url = 'https://episphere.github.io/serohub/seroprevalence.json.zip'
let seroHub={
    loadedAt:Date(),
    loadedFrom:url,
    Plotly:Plotly
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

seroHub.plotSeroprevalence=function(div=seroHubDiv){ // values vs time
    if(!div){
        div = document.createElement('div')
        document.body.appendChild(div)
    }
    console.log('ploting at ',div)
    // start and end of each collection
    // let xx = seroHub.seroprevalence.seroprevalences.map(x=>[Date.parse(x.collection_start),Date.parse(x.collection_end)])
    let xx = seroHub.seroprevalence.seroprevalences.map(x=>[x.collection_start,x.collection_end])
    let yy = seroHub.seroprevalence.seroprevalences.map(x=>[x.seroprevalence,x.seroprevalence])
    let traces=xx.slice(0,1000).map((z,i)=>{
        return {
            x:[xx[i][0],xx[i][1]],
            y:[yy[i][0],yy[i][1]]
        }
    })
    let layout = {
        title:'test plot',
        width:1000,
        height:1000
    }
    Plotly.newPlot(div,traces,layout)
}

seroHub.byGroup = function(xx=seroHub.seroprevalence.seroprevalences,attr='antigen_target',vals){
    if(!vals){vals = seroHub.uniqueValues(attr)}
    let grp = {}
    vals.sort().forEach(v=>{
        grp[v]=xx.filter(x=>(x[attr]==v))
    })
    return grp
}

seroHub.plotByGroup = function(div,grps=seroHub.byGroup()){
    if(!div){
        div = document.createElement('div')
        document.body.appendChild(div)
    }
    let traces = []
    Object.keys(grps).forEach((grp,i)=>{
        traces.push({
            x:grps[grp].map(x=>x['collection_midpoint']),
            y:grps[grp].map(x=>x['seroprevalence']),
            type:'scatter',
            name:grp,
            mode:'markers',
            marker:{
                opacity:0.5,
                symbol:i,   //seroHub.Plotly.PlotSchema.get().traces.scatter.attributes.marker.symbol.values
                size:10,
            }
        })
    })
    let layout = {
        title:`Prevalence over time, by antigen target`,
        width:1000,
        height:1000,
        xaxis:{
            title:`Midpoint collection date`
        },
        yaxis:{
            title:`Prevalence`
        },
    }
    Plotly.newPlot(div,traces,layout)
}

//serohub.dt = seroHub.seroprevalence.seroprevalences // array
/*
serohub.group = function(xx=seroHub.seroprevalence.seroprevalences,attr='antigen_target',vals){
    if(!vals){
        vals = seroHub.uniqueValues(attr)
    }
    vals
    return grp 
}
*/

export{
    seroHub
}