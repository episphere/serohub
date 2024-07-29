console.log(`index.js loaded at\n${Date()}`);


(async function(){
    seroHub = (await import(`./seroHub.mjs`)).seroHub
})()