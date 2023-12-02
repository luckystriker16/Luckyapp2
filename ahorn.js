var ahorn = {}

window.onload = async ()=>{
    if ('serviceWorker' in navigator) { navigator.serviceWorker.register(await getAbsoluteLink("sw.js")).then(function(registration){registration.update()})}; //experimenteller Offlinemodus
}

window.addEventListener("load", init_ahorn);

async function init_ahorn(){
    await init_Settings();
    await ahorn.loadSettings();
    //Setting lastPage und currentPage;
    if(window.location.href != ahorn.settings.currentPage){ //Bei Seitenwechsel
        ahorn.changeSetting("lastPage", ahorn.settings.currentPage);
        ahorn.changeSetting("currentPage", window.location.href);
    }
    if(!(ahorn.settings.visits>1)){
        await ahorn.changeSetting("visits", ahorn.settings.visits+1);
    }
    ahorn.version = "dv.23112.0";
    await init_lang(); //language Einstellungen aktualisieren
    if(ahorn.settings.visits == 1){ //Beim ersten Besuch bevorzugte Sprache verwenden
        setAutoLang();
    }
    await loadLinkmanager();
    await loadEmbeddedStyles(["stylesheets/error/error.css"]);
    await loadEmbeddedScripts(["stylesheets/error/error.js"]);
    await loadEmbeddedFunctions(["start_error_stylesheet"]);
    loadNavbar();
    await init_cookies();
    await init_darkmode();
    setTextfields();
    if(document.getElementById("banner")){
        document.getElementById("banner").style.display = "none";
    }else{
        console.warn("Kein Banner verfügbar.");
    }
}

async function loadLinkmanager(){
    if(typeof linkmanager == "undefined"){ //Wenn noch nicht geschehen Dateien für Linkmanager Laden
        await scriptLoader("stylesheets/linkmanager/linkmanager.js");
        //console.log("esting");
    }
    if(typeof sitemap == "undefined"){
        await scriptLoader("sitemap.js")
    }
    for(i=0;i<100;i++){
        if(typeof linkmanager != "undefined" && typeof sitemap != "undefined"){
            linkmanager.load();
            return 
        }else{
            await sleep(200);
        }
    }
    console.warn("Linkmanager konnte nicht geladen werden.")
}

async function loadFunction(functionName){
    for(i=0;i<100;i++){
        if(typeof window[functionName] == "function"){
            window[functionName]();
            return true;
        }else{
            await sleep(100);
        }
    }
    console.warn(`Funktion ${functionName} konnte nicht geladen werden.`)
}

async function loadEmbeddedStyles(list){
    await list.forEach(async(elem)=>{cssLoader_(elem)});
}

async function loadEmbeddedScripts(list){
    await list.forEach(async(elem)=>{await scriptLoader(elem)});
}

async function loadEmbeddedFunctions(list){
    list.forEach((elem)=>{loadFunction(elem)});
}

async function getAbsoluteLink(link){
    if(window.location.origin != "file://"){
        if(document.getElementsByTagName("base")[0]){
            return document.getElementsByTagName("base")[0].href +"/"+ link;
        }else{
            return window.location.origin +"/LuckySite"+ link;
        }
    }
}

async function getLocalLink(link){
    if(window.location.origin != "file://"){
        if(document.getElementsByTagName("base")[0]){
            return window.location.href + link;
        }else{
            return link;
        }
    }
}

function setTextfields(){ //Autofill Textfelder
    for(i=0;i<document.getElementsByClassName("versionDisplay").length;i++){
        document.getElementsByClassName("versionDisplay")[i].innerHTML = ahorn.version;
    }
}

function Werteliste (querystring) {
    if (querystring == '') return;
    var wertestring = querystring.slice(1);
    var paare = wertestring.split("&");
    var paar, name, wert;
    for (var i = 0; i < paare.length; i++) {
      paar = paare[i].split("=");
      name = paar[0];
      wert = paar[1];
      name = unescape(name).replace("+", " ");
      wert = unescape(wert).replace("+", " ");
      this[name] = wert;
    }
}
var url_data = new Werteliste(location.search);

async function get_data(url, noinfo){
    var data

    if(!url.includes("https")){
        if(url.includes("http")){
            url = url.replace("http","https");
            //console.log(url);
        }
    }else{
        //console.log(url);
    }
    
    await fetch(url)
    
    .then((response) => response.text())

    .then((data_text) => {data = JSON.parse(data_text)});

    return data;
}

function sleep(ms) { //Sleep funktion, wird ausgelöst mit: await sleep(ms) !!Aufrufende funktion muss asynchron sein!!
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scriptLoader(path, callback, callback_alt){ //Ein JS script einbetten
    return new Promise(async(resolve)=>{
        var script = await document.createElement('script');
        script.type = "text/javascript";
        //script.async = true;
        script.src = path;
        script.onload = new Promise(async (resolve)=>{  
            if(!callback){
                if(callback_alt){
                    console.log("alt")
                    callback = window[callback_alt];
                }
            }
            if(typeof(callback) == "function"){
                await callback();
            }
            //console.log(linkmanager)
        resolve();
        });
        try
        {
        var scriptOne = document.getElementsByTagName('script')[0];
        scriptOne.parentNode.insertBefore(script, scriptOne);
        }
        catch(e)
        {
        document.getElementsByTagName("head")[0].appendChild(script);
        }
        resolve();
    })
}

function cssLoader_(file, callback){ //Ein CSS stylesheet einbetten
    var link = document.createElement("link");
    link.href = file;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    link.onload = function(){
        if(typeof(callback) == "function"){
            callback();
        }
    }
}

function createHTML(htmlString) { //HTML element erstellen
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }