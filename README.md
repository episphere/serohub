# serohub
A javascript sdk for https://covid19serohub.nih.gov data:

* Live application at https://episphere.github.io/serohub
* Data as json at :  https://episphere.github.io/serohub/seroprevalence.json.zip
* Full seroHub object, with data,

```javascript
seroHub = (await import("https://episphere.github.io/serohub/serohub.mjs"))
  .seroHub
```