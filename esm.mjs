await import("https://cdn.plot.ly/plotly-2.34.0.min.js")
const esm = Plotly
delete window.Plotly
export{esm}

// nevermind, this works fine:
// Plotly = (await import("https://esm.sh/plotly.js@2.34.0")).default
