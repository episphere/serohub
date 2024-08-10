console.log(`index.js loaded at\n${Date()}`);

(async function(){
    seroHub = (await import("./serohub.mjs")).seroHub
    //seroHub = (await import("https://episphere.github.io/serohub/serohub.mjs")).seroHub
    seroHubMsg.innerHTML=`> ${seroHub.seroprevalence.seroprevalences.length} records loaded, ${Date().toString().slice(0,24)}`
    return seroHub
})()
