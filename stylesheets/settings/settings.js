var settingsStorageName = "ahornSettings";

function init_Settings(){ //ONLOAD
    ahorn.loadSettings = ()=>{
        var settings_version = 5; //Muss bei änderung der Standardeinstellungen geändert werden.
        if(localStorage.getItem(settingsStorageName)){
            if(settings_version > JSON.parse(localStorage.getItem(settingsStorageName)).settings_version){
                localStorage.removeItem(settingsStorageName);
                ahorn.loadSettings();
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
                enableAutoMaintenance: true //AutoMaintenance wird eine in der sitemap nicht verfügbare Seite direkt überspringen und zur Wartungsseite weiterleiten
            }
            localStorage.setItem(settingsStorageName, JSON.stringify(ahorn.settings));
        }
    };
    
    ahorn.changeSetting = (setting, value)=>{
        console.log(`Einstellung ${setting} wird von ${ahorn.settings[setting]} zu ${value} geändert.`)
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