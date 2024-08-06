console.log(`index.js loaded at\n${Date()}`);

(async function(){
    const localforage = await import('https://esm.sh/localforage@1.10.0')
    //if(await localForage.getItem('seroHub'))
    const seroHub = await (await import(`https://episphere.github.io/serohub/seroHub.mjs`)).seroHub
    seroHubMsg.innerHTML=`... data loaded ${Date().toString().slice(0,24)}`
    
    return seroHub
})()
