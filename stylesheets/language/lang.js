function init_lang(){
    if(!window.location.pathname.includes("/"+ahorn.settings.lang+"/")){
        if(ahorn.settings.lang == "de" && (window.location.pathname != "/index.html" && window.location.pathname != "/")){
            console.log("Wrong lang");
        }
        if(window.location.pathname.includes("/en/")){
            ahorn.Sitelang = "en";
            ahorn.changeSetting("lastLang","en");
        }else if(window.location.pathname.includes("/de/")){
            ahorn.Sitelang = "de"
            ahorn.changeSetting("lastLang","de");
        }
    }
}

function setAutoLang(){ //Wechelst automatisch zur vom User bevorzugten Sprache (navigator.language)
    var link = window.location.href;
    window.location = link.replace("/"+ahorn.Sitelang+"/", "/"+navigator.language+"/");
}