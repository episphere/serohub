const seroHub={
    loadedAt:Date(),
}
const url = 'https://episphere.github.io/serohub/seroprevalence.json.zip'

// check for cached data in localForage
const localForage = await (await import('https://esm.sh/localforage@1.10.0')).default

//const localForage = await (await import('https://esm.sh/localforage@1.10.0')).default
const JSZip = (await import('https://esm.sh/jszip@3.10.1'))

function fetchData(url='https://episphere.github.io/serohub/seroprevalence.json.zip'){
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
                        localForage.setItem('seroHub',seroHub)
                        console.log(`${seroHub.dt.seroprevalences.length} reccords parsed (kept at seroHub.dt)`)
                })
        });
    });
}

if(! await localForage.getItem('seroHub')){ // if data not cached
    await fetchData(url)
    await localForage.setItem('seroHub',seroHub)
}

export{
    seroHub
}