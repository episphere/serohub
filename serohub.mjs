const seroHub={
    loadedAt:Date()
}

// unzip remote loadZippedFiles
const url = 'https://episphere.github.io/serohub/seroprevalence.json.zip'
const loadZip = (await import('https://episphere.github.io/serohub/loadZip.mjs'))
const dt = await loadZip.loadZippedFiles(url)
seroHub.seroprevalence=dt['seroprevalence.json']

export{
    seroHub
}
