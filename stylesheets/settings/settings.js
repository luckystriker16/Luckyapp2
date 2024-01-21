var settingsStorageName = "ahornSettings";

function init_Settings(){ //ONLOAD
    ahorn.loadSettings = ()=>{
        var settings_version = 18; //Muss bei änderung der Standardeinstellungen geändert werden.
        if(localStorage.getItem(settingsStorageName)){
            if(settings_version > JSON.parse(localStorage.getItem(settingsStorageName)).settings_version){
                localStorage.removeItem(settingsStorageName);
                ahorn.loadSettings();
                console.warn("Einstellungen Aktualisiert");
            }
            ahorn.settings = JSON.parse(localStorage.getItem(settingsStorageName));
        }else{
            ahorn.settings = { //standard settings
                settings_version: settings_version,
                visits: 0, //Anzahl der Seitenbesuche seit letztem zurücksetzen
                darkmode: false, //Darkmode an/aus
                cookies: false, //Cookies akzepiert
                lang: "de", //Eingestellte Sprache ??????
                lastLang: "de", //Letzte Sprache
                currentPage: window.location.href, //aktuelle Seite
                autoDarkmode: false, //Automatisches Anpassen des Darkmodes an die Userpräferenzen
                enableAutoMaintenance: true, //AutoMaintenance wird eine in der sitemap nicht verfügbare Seite direkt überspringen und zur Wartungsseite weiterleiten
                rootHTMLDefaultLang: "de", //["SprachId" | undefined] Soll für eine HTML-Datei im Rootverzeichnis (/) den Linkmanager nutzen, muss hier eine Sprache dafür angegeben werden.
                firstLoad: true, //Wird nach dem ersten vollen Seitenladevorgang false
                downloadToLink: true, //Ist der Wert true, werden AutoLinks mit autoLink-type="download" als normaler Link geladen, wenn download_name im linkmanger nicht gesetzt oder "wartung" ist.
                luckySiteUrlLangPos: [11,13], //Gibt die Position der Sprachinformationen in der URL an, sodasss sie mit substring() ausgelesen werden könnnen.
            }
            localStorage.setItem(settingsStorageName, JSON.stringify(ahorn.settings));
        }
    };
    
    ahorn.changeSetting = (setting, value)=>{
        //console.log(`Einstellung ${setting} wird von ${ahorn.settings[setting]} zu ${value} geändert.`)
        ahorn.settings[setting] = value;
        localStorage.setItem(settingsStorageName, JSON.stringify(ahorn.settings));
        ahorn.loadSettings();
        //info_show("Einstellungen gespeichert.","success");
    };

    ahorn.resetSettings = ()=>{
        localStorage.removeItem(settingsStorageName);
        ahorn.loadSettings();
        console.warn("Alle Einstellungen wurden zurückgesetzt.");
    }
}