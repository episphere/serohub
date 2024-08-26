console.log(`index.js loaded at\n${Date()}`);

(async function(){
    seroHub = (await import("./serohub.mjs")).seroHub
    //seroHub = (await import("https://episphere.github.io/serohub/serohub.mjs")).seroHub
    seroHubMsg.innerHTML=`> ${seroHub.seroprevalence.seroprevalences.length} records loaded, ${Date().toString().slice(0,24)}`
    // seroHub.plotSeroprevalence(seroHubDiv)
    seroHubDiv.innerHTML='' // clear div before plotting
    seroHub.plotByGroup(seroHubDiv)
    return seroHub
})()



function saveFile(x=json2tsv(),fileName="seroPrevalances.tsv") { // x is the content of the file
	// var bb = new Blob([x], {type: 'application/octet-binary'});
	// see also https://github.com/eligrey/FileSaver.js
	var bb = new Blob([x]);
   	var url = URL.createObjectURL(bb);
	var a = tsv
   	a.href=url;
	if (fileName){
		if(typeof(fileName)=="string"){ // otherwise this is just a boolean toggle or something of the sort
			a.download=fileName;
		}
		a.click() // then download it automatically 
	} 
	return a
}

function json2tsv(jsn=seroHub.seroprevalence.seroprevalences){
    // find headers
    let variables = Object.keys(jsn[0])
    tsvtxt=variables.join('\t')
    for (let i=0 ; i<jsn.length ; i++){
        tsvtxt+='\n'
        tsvtxt+=variables.map((v,j)=>jsn[i][v]).join('\t')
    }
    return tsvtxt
}