/*
class seroHub{
    constructor(info='this is an observable subject'){
        this.created = Date();
        // load data if not cached 
       
    }
}*/


const localForage = await (await import('https://esm.sh/localforage@1.10.0')).default


const seroHub={
    createdAt:Date()
}
// check that data is loaded


//debugger

export{
    seroHub
}