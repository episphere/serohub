console.log(`index.js loaded at\n${Date()}`);

(async function(){
    //if(await localForage.getItem('seroHub'))
    seroHub = (await import(`./seroHub.mjs`)).seroHub
    

})()