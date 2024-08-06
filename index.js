console.log(`index.js loaded at\n${Date()}`);

(async function(){
    //const localForage = (await import('https://cdn.jsdelivr.net/npm/localforage@1.10.0/+esm')).default;
    const localForage = (await import('https://esm.run/localforage@1.9.0/src/localforage.js')).default
    console.log('length:',await localForage.getItem('seroHub'))
    let seroHub
    if( !await localForage.getItem('seroHub')){
        seroHub = await (await import(`https://episphere.github.io/serohub/serohub.mjs`)).seroHub
        localForage.setItem('seroHub',seroHub)
    } else {
        seroHub = await localForage.getItem('seroHub')
    }
    // const seroHub = await (await import(`https://episphere.github.io/serohub/serohub.mjs`)).seroHub
    seroHubMsg.innerHTML=`> ${seroHub.seroprevalence.seroprevalences.length} records loaded, ${Date().toString().slice(0,24)}`
    return seroHub
})()
