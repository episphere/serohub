
console.log(`seroHub ES6 module imported at,\n${Date()}`)

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
// add row number
seroHub.seroprevalence.seroprevalences.forEach((x,i)=>{seroHub.seroprevalence.seroprevalences[i].row=i+1})
// list variables
seroHub.variables = Object.keys(seroHub.seroprevalence.seroprevalences[0])
// extract values of an attribute
seroHub.values=function(variable='age'){
    if(typeof(variable)=='number'){
        variable = seroHub.variables[variable]
    }
    console.log(`reading variable "${variable}"`)
    return seroHub.seroprevalence.seroprevalences.map(row=>row[variable])
}
// unique values for a variable
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

seroHub.plotByGroup = function(div,grps=seroHub.byGroup(),divData){
    if(!div){ //main div
        div = document.createElement('div')
        document.body.appendChild(div)
    }
    if(!divData){
        divData = document.createElement('div')
        div.parentElement.appendChild(divData)
        divData.innerHTML='Summary row information pops up when you mouse hover the plot above. When you click, the corresponding full entry will be displayed here.'
    }
    let traces = []
    Object.keys(grps).forEach((grp,i)=>{
        traces.push({
            x:grps[grp].map(x=>x['collection_midpoint']),
            y:grps[grp].map(x=>x['seroprevalence']),
            text:grps[grp].map(x=>`row: ${x.row}, state:${x.collection_state}, age: ${x.age})`),
            //text:grps[grp].map((x,j)=>`row ${x.row+1} (${x.collection_state}, age: ${x.age})`),
            /*
            text:grps[grp].map((x,j)=>{
                //return `(${JSON.stringify(x,null,3)})`
                //x=seroHub.seroprevalence.seroprevalences[x.row-1]
                return `row: ${x.row+1}, state: ${x.collection_state}`
            }),
            */
            type:'scatter',
            name:grp,
            mode:'markers',
            marker:{
                opacity:0.5,
                symbol:['circle-open','square-open','cross-open','hexagon-open','triangle-up-open','triangle-down-open','triangle-left-open','triangle-right-open','diamond-open'][i],   //seroHub.Plotly.PlotSchema.get().traces.scatter.attributes.marker.symbol.values
                size:7,
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
        .then(function(gd) {
            gd.on('plotly_click',
            function(data) {
                // Function to execute on hover
                // console.log(data);
                //divData.innerHTML=seroHub.seroprevalence.seroprevalences[parseInt('row 35957 (California, age: )'.match(/row ([0-9]+)/)[1])].row
                let i = grps[data.points[0].fullData.name][data.points[0].pointIndex].row-1
                // divData.innerHTML=JSON.stringify(seroHub.seroprevalence.seroprevalences[i],null,3)
                divData.innerHTML='' // clear
                let taRow = document.createElement('textarea')
                let btDownload = document.createElement('button')
                //console.log(btDownload)
                btDownload.id="btDownload"
                btDownload.innerHTML='download entry'
                btDownload.onclick=function(){
                    console.table(taRow.value)
                }
                divData.appendChild(btDownload)
                taRow.id="taRow"
                taRow.style.backgroundColor='white'
                taRow.style.color='navy'
                taRow.style.fontSize=10
                divData.appendChild(taRow)
                taRow.style.width='100%'
                taRow.style.height='100em'
                taRow.value=JSON.stringify(seroHub.seroprevalence.seroprevalences[i],null,3)
            });
        })
        //.then(function(gd) {
        //    gd.on('plotly_click',
        //    function(data) {console.log(data)})})
    
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