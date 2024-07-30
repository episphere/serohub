const seroHub={
    loadedAt:Date(),
}

// check for cached data in localForage
const localForage = await (await import('https://esm.sh/localforage@1.10.0')).default

if(!(await localForage.keys()).map(x=>(x=='seroHub')).reduce((a,b)=>(a+b))){
    //debugger
}



//const localForage = await (await import('https://esm.sh/localforage@1.10.0')).default
const JSZip = (await import('https://esm.sh/jszip@3.10.1'))

function fetchData(url=url){
    fetch(url)
    .then(response => response.arrayBuffer())
        .then(zipData => {
            JSZip.loadAsync(zipData).then(zip => {
            // Process the unzipped files here (e.g., zip.file("filename").async("string")) 
            zip.file('seroprevalence.json')
                .async("string")
                    //.then(txt=>console.log(JSON.parse(txt)))
                    .then(txt=>{
                        seroHub.dt = JSON.parse(txt)
                        console.log(`${seroHub.dt.seroprevalences.length} reccords parsed (stored in seroHub.dt)`)
                })
        });
    });
}





// get data

let dt

const url = 'https://episphere.github.io/serohub/seroprevalence.json.zip'

fetch(url)
    .then(response => response.arrayBuffer())
    .then(zipData => {
        JSZip.loadAsync(zipData).then(zip => {
            // Process the unzipped files here (e.g., zip.file("filename").async("string")) 
            zip.file('seroprevalence.json')
                .async("string")
                //.then(txt=>console.log(JSON.parse(txt)))
                .then(txt=>{
                    seroHub.dt = JSON.parse(txt)
                    console.log(`${seroHub.dt.seroprevalences.length} reccords parsed (stored in seroHub.dt)`)
                })
        });
    });

//debugger

export{
    seroHub
}