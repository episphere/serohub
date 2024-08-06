console.log(`import loadZip\n${Date()}`);

const JSZip = (await import('https://esm.sh/jszip@3.10.1'))

// const url = 'https://episphere.github.io/serohub/seroprevalence.json.zip' // default file url

async function loadZippedFiles(url='https://episphere.github.io/serohub/seroprevalence.json.zip'){
    const response = await fetch(url)
    const data = response.arrayBuffer()
    const zip = await JSZip.loadAsync(data);
    const res = {}
    for (let filename in zip.files) {
            const file = zip.file(filename);
            if (file) {
                const content = await file.async('string'); 
                // Do something with the content (e.g., display, process)
                try{
                    res[filename]=JSON.parse(content)
                } catch(err){
                    //console.log(`${filename} failed json conversion`)
                    //res[filename]=content
                }
                //console.log(filename, 'length:', content.length); 
            }
        }
    //const file = zip.file('seroprevalence.json'); // note this loader expects seroprevalence.json to exist. Alternatively zip.files will keep a list of the files unzipped
    //const content = await file.async('string');
    return res
}

export{
    loadZippedFiles
}

