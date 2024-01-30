var linkmanager = {
    loaded: false,
    load: async function(pathLangForce){
        if(pathLangForce==undefined){
            var pathLang = window.location.pathname.substring(ahorn.settings.luckySiteUrlLangPos[0],ahorn.settings.luckySiteUrlLangPos[1]);
        }else{
            var pathLang = pathLangForce;
            console.warn("Custom pathLang im Linkmanager wird angewendet.");
        }
        var location = window.location.origin + window.location.pathname.replace("index.html","");//Prepare location
        for(j=0;j<Object.keys(sitemap).length;j++){
            var siteId = Object.keys(sitemap)[j];
            for(k=0;k<Object.keys(sitemap[siteId]).length;k++){
                var langId = Object.keys(sitemap[siteId])[k];
                if(langId == pathLang){
                    if(sitemap[siteId][langId].link == location){
                        if(typeof customNavbar != "undefined" && customNavbar != undefined && customNavbar != 0 && customNavbar != null){
                            var navbarList = customNavbar;
                            console.log("CustomNavbar angewendet");
                        }else{
                            var navbarList = ["template","home", "article"];
                        }
                        linkmanager.pageData = {
                            siteId: siteId,
                            lang: langId,
                            parents: [],
                            navbar: navbarList,
                            data: sitemap[siteId][langId]
                        };
                        var parentId = siteId;
                        while(sitemap.getParent(parentId) != false){ //loading parents List
                            parentId = sitemap.getParent(parentId);
                            linkmanager.pageData.parents.unshift(parentId);
                        }
                        var ableToLoad = true;
                        //console.log(linkmanager.pageData);
                    }
                }
            }
        }
        if(!ableToLoad){
            if(sitemap.byLang[window.location.pathname.substring(ahorn.settings.luckySiteUrlLangPos[0],ahorn.settings.luckySiteUrlLangPos[1])] == undefined){
                console.warn("Der Pfad dieser Seite ist keiner Sprache zugeordnet.");
                if(pathLangForce==undefined){
                    if(ahorn.settings.rootHTMLDefaultLang!=undefined){
                        linkmanager.load(ahorn.settings.rootHTMLDefaultLang);
                        return;
                    }
                }else{
                    console.error("rootHTMLDefaultLang konnte nicht angewendet werden.");
                }
            }else 
            if(ahorn.settings.enableAutoMaintenance){
                if(url_data.forceLoad){ //Forceload
                    console.error("Seite wurde zwangsgeladen. Es kann zu unerwarteten Fehlern kommen. Der Linkmanager und pageData sind möglicherweise nicht verfügbar.");
                    setFooterPath();
                    if(ahorn.settings.uniFooter){
                        await initUniFooter();
                        loadUniFooter();
                    }
                    await setFooterLangs();
                    await setAutoNavbar();
                    autoLink_initLangs();
                    setAutoLinks();
                    linkmanager.loaded = true;
                    return;
                }else{
                    window.location = sitemap.byLang[window.location.pathname.substring(ahorn.settings.luckySiteUrlLangPos[0],ahorn.settings.luckySiteUrlLangPos[1])].maintenance.link;
                }
            }
            console.error("Linkmanager ist auf diser Seite nicht verfügbar. Möglicherweise wurde die Seite noch nicht in sitemap.js hinzugefügt.");
            console.warn("setFooterPath(), setFooterLangs(), setAutoNavbar() und setAutoLinks() werden nicht ausgeführt.");
            return;
        }
        setFooterPath();
        if(ahorn.settings.uniFooter){
            await initUniFooter();
            loadUniFooter();
        }
        await setFooterLangs();
        await setAutoNavbar();
        autoLink_initLangs();
        setAutoLinks();
        linkmanager.loaded = true;
    }
}

async function setFooterPath(){
    if(document.getElementsByClassName("fPath")[0]){
        try{
            var fPath = document.getElementsByClassName("fPath")[0];
            if(linkmanager.pageData.parents.length == 0){ //Wenn Keine Parents verfügbar
                fPath.innerHTML = "<a href='"+ sitemap[linkmanager.pageData.siteId][linkmanager.pageData.lang].link +"'>"+'<img alt="Home" src="'+ await getAbsoluteLink("/media/la/logo_1440.png") +'"></a>';
            }else{
                fPath.innerHTML = "";
            }
            for(i=0;i<linkmanager.pageData.parents.length;i++){ //Wenn Parents verfügbar, durchloopen
                var currentParent = linkmanager.pageData.parents[i];
                //console.log(currentParent);
                if(typeof sitemap[currentParent][linkmanager.pageData.lang] != "undefined"){ //Wenn der Pfad nicht in der aktuellen Sprache verfügbar ist überspringen
                    if(currentParent == "home"){ //Wenn Home, dann Bild hinzufügen
                        fPath.innerHTML += "<a href='"+ sitemap[currentParent][linkmanager.pageData.lang].link +"'>"+'<img alt="Home" src="'+ await getAbsoluteLink("/media/la/logo_1440.png") +'"></a>';
                    }else{
                        fPath.innerHTML += "<a href='"+ sitemap[currentParent][linkmanager.pageData.lang].link +"'><div>"+ sitemap[currentParent][linkmanager.pageData.lang].path +"</div></a>";
                    }
                    var pathDivider = "<div>/</div>"; // Trennzeichen
                    fPath.innerHTML += pathDivider;
                }
            }
            fPath.innerHTML += "<a href='"+ linkmanager.pageData.data.link +"'><div>"+ linkmanager.pageData.data.path +"</div></a>";
        }catch(err){
            console.warn("Footer Path konnte nicht gesetzt werden.");
        }
    }
}

async function setFooterLangs(){
    if(document.getElementsByClassName("fLang")[0]){
        for(jh=0;jh<document.getElementsByClassName("fLang").length;jh++){
            var fLang = document.getElementsByClassName("fLang")[jh];
            var footerLangs = {
                de:{
                    name: "Deutsch",
                    img: "/media/DE Symbol.png"
                },
                en:{
                    name: "English",
                    img: "/media/EN Symbol.png"
                },
                fr:{
                    name: "Francaise"
                },
                es:{
                    name: "Español"
                },
                pl:{
                    name: "Polski"
                }
            }
            var fLangOLDHtml = fLang.innerHTML;
            try{
                fLang.innerHTML = "";
                for(ih=0;ih<Object.keys(footerLangs).length;ih++){
                    var fLangNameImg = "";
                    if(fLang.getAttribute("fLang-img")=="true"){
                        if(footerLangs[Object.keys(footerLangs)[ih]].img){
                            fLangNameImg = "<img alt='country flag "+ Object.keys(footerLangs)[ih] +"' src='"+ await getAbsoluteLink(footerLangs[Object.keys(footerLangs)[ih]].img) +"'></img>";
                        }
                    }
                    var fLangSelectedClasses = "";
                    if(fLang.getAttribute("fLang-optionsOnly")=="true"){
                        if(footerLangs[Object.keys(footerLangs)[ih]].img){
                            fLangSelectedClasses = "hidden";
                        }
                    }
                    if(Object.keys(footerLangs)[ih]==linkmanager.pageData.lang){
                        fLang.innerHTML += "<a href='"+ linkmanager.pageData.data.link +"' class='fLangSelected "+ fLangSelectedClasses +"'>"+ fLangNameImg + footerLangs[Object.keys(footerLangs)[ih]].name +"</a>";
                    }else{
                        try{
                            fLang.innerHTML += "<a href='"+ sitemap[linkmanager.pageData.siteId][Object.keys(footerLangs)[ih]].link +"'>"+ fLangNameImg + footerLangs[Object.keys(footerLangs)[ih]].name +"</a>";
                        }catch(err){
                            //console.warn(`Die Seite ist nicht auf ${footerLangs[Object.keys(footerLangs)[i]].name} verfügbar.`);
                        }
                    }
                }
            }catch(err){
                console.log(err);
                console.warn("Footer Lang konnte nicht gesetzt werden.");
                try{
                    fLang.innerHTML = fLangOLDHtml;
                }catch(err){
                    console.warn("Manuelle Footer Lang auswahl konnte nicht wiederhergestellt werden.")
                }
            }
        }
    }
}

var unifooter;

async function initUniFooter(){
    switch (linkmanager.pageData.lang) {
        case "x": //Hier SprachId einfügen
            unifooter = [
                {
                    title: "Template",
                    hidden: true, //Wenn hidden true ist, wird der Abschnitt nicht im Footer angezeigt.
                    links: [
                        {
                            autoLinkId: "home",
                            autoLinkType: "onsite",
                            autoLinkLang: "de",
                            attribute: "autoLink-keepText autoLink-setText" //Hier können weitere Attribute als plain Text eingegeben werden
                        },
                        {
                            autoLinkId: "home",
                            autoLinkType: "onsite",
                            autoLinkLang: "de",
                            attribute: "autoLink-keepText autoLink-setText" //Hier können weitere Attribute als plain Text eingegeben werden
                        }
                    ]
                },
            ]
            break;
        case "de"://Deutsch
            unifooter = [
                {
                    title: "Funktionen",
                    links: [
                        {
                            autoLinkId: "article"
                        }
                    ]
                },
                {
                    title: "Templates",
                    links: [
                        {
                            autoLinkId: "template"
                        }
                    ]
                }
            ];
            break;
        case "en"://Englisch
            unifooter = [
                {
                    title: "Functionality",
                    links: [
                        {
                            autoLinkId: "article"
                        }
                    ]
                },
                {
                    title: "Templates",
                    links: [
                        {
                            autoLinkId: "template"
                        }
                    ]
                }
            ];
            break;
        default://Fallback
            unifooter = [
                {
                    title: "Funktionen",
                    links: [
                        {
                            autoLinkId: "article"
                        }
                    ]
                },
                {
                    title: "Templates",
                    links: [
                        {
                            autoLinkId: "template"
                        }
                    ]
                }
            ];
            break;
    }
}

function loadUniFooter(){
    try{
        if((typeof blockUniFooter == "undefined" || blockUniFooter == false ) && (typeof blockUniFooter == "undefined" || blockUniFooter != true)){
            var attributes = [["autoLink-id","autoLinkId"],["autoLink-type","autoLinkType"],["autoLink-lang","autoLinkLang"]];
            var fLinks = document.getElementsByClassName("fLinks")[0];
            fLinks.innerHTML = "";
            for(i=0;i<unifooter.length;i++){
                if(unifooter[i].hidden == true){
                    i++;
                }
                var linklistHtml = "";
                if(unifooter[i].title){
                    linklistHtml += "<div>"+ unifooter[i].title +"</div>";
                }
                if(unifooter[i].links != undefined){
                    unifooter[i].links.forEach((link)=>{
                        var autoLinkAttributes = "";
                        attributes.forEach((attribute)=>{
                            if(attribute[1] && link[attribute[1]] != undefined){
                                autoLinkAttributes += attribute[0]+'="'+ link[attribute[1]] +'" ';
                            }
                        });
                        if(link.attribute!=undefined){
                            autoLinkAttributes += link.attribute;
                        }
                        linklistHtml += '<a class="autoLink" '+ autoLinkAttributes +'></a>';
                    });
                }
                fLinks.innerHTML += '<div class="fLinklist">'+ linklistHtml +'</div>';
            }
            setAutoLinks();
            console.log("uniFooter geladen");
        }else{
            console.warn("UniFooter wurde blockiert");
        }
    }catch{
        console.warn("Laden des UniFooters ist fehlgeschlagen. Der Footer wird möglicherweise nicht richtig angezeigt oder ist nicht verfügbar.");
    }
}

async function setAutoNavbar(){
    try{
        var navbarElements = linkmanager.pageData.navbar;
        if(document.getElementsByTagName("nav")){
            var nav = document.getElementsByTagName("nav")[0];
            var navChilds = nav.children;
            if(navbarElements.length != 0){
                nav.innerHTML = '<div id="closeNav">X</div>';
                for(k=0;k<navbarElements.length;k++){
                    if(navbarElements[k]=="home"){
                        nav.innerHTML += "<img  alt='Home | Ahorn Logo' src='"+ await getAbsoluteLink('/media/la/logo_1440.png')+ "' class='autoLink' autoLink-type='onsiteNOa' autoLink-Id='"+ navbarElements[k] +"'></img>"
                    }else{
                        nav.innerHTML += "<a class='autoLink nava' autoLink-type='onsite' autoLink-Id='"+ navbarElements[k] +"'></a>";
                    }
                }
            }
        }
    }catch(err){
        console.warn("Beim erstellen der AutoNavbar ist ein Fehler aufgetreten.")
    }
}

function setAutoLinks(){
    var autoLinks = document.getElementsByClassName("autoLink");
    for(i=0;i<autoLinks.length;i++){
        try{
            if(autoLinks[i].getAttribute("autoLink-type") == "onsite"){
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(sitemap[id][linkmanager.pageData.lang]!=undefined){
                        var autoLink_lang = linkmanager.pageData.lang;
                        var autoLink_path = sitemap[id][autoLink_lang].path
                        if(autoLinks[i].getAttribute("autoLink-lang")!=undefined){
                            var autoLink_lang = autoLinks[i].getAttribute("autoLink-lang");
                        }
                        if(autoLinks[i].getAttribute("autoLink-keepText")!=undefined){
                            var autoLink_path = autoLinks[i].innerHTML;
                        }
                        try{
                            autoLinks[i].href = sitemap[id][autoLink_lang].link;
                            autoLinks[i].innerHTML = autoLink_path;
                        }catch{
                            autoLinks[i].href = sitemap[id][linkmanager.pageData.lang].link;
                            autoLinks[i].innerHTML = sitemap[id][linkmanager.pageData.lang].path;
                            console.log("autoLink lang error fallback");
                        }
                    }else{// Wenn die Seite in der aktuellen Sprache nicht verfügbar ist
                        console.warn("Onsite AutoLink " + id + " ist in der aktuellen Sprache nicht verfügbar. Bitte hinzufügen oder Link ändern.")
                    }
                }
            }else if(autoLinks[i].getAttribute("autoLink-type") == "onsiteNOa"){ //Hier wird der Text des Elements nicht automatisch gesetzt.
                if(autoLinks[i].getAttribute("autoLink-Id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(sitemap[id][linkmanager.pageData.lang]!=undefined){
                        var autoLink_lang = linkmanager.pageData.lang;
                        if(autoLinks[i].getAttribute("autoLink-lang")!=undefined){ //Lang
                            var autoLink_lang = autoLinks[i].getAttribute("autoLink-lang");
                        }
                        if(autoLinks[i].getAttribute("autoLink-setText")!=undefined){ //Autotext
                            try{
                                autoLinks[i].innerHTML = sitemap[id][linkmanager.pageData.lang].path;
                            }catch(err){
                                console.warn("Bei folgendem autoLink konnte der Text nicht gesetzt werden:");
                                console.warn(autoLinks[i]);
                            }
                        }
                        try{
                            var link = sitemap[id][autoLink_lang].link;
                        }catch{
                            var link = sitemap[id][linkmanager.pageData.lang].link;
                            console.log("autoLink lang error fallback");
                        }
                        //var link = sitemap[id][linkmanager.pageData.lang].link; //Zu viel?????
                        autoLinks[i].onclick= ()=>{window.location = link}
                    }else{// Wenn die Seite in der aktuellen Sprache nicht verfügbar ist
                        console.warn("Onsite AutoLink " + id + " ist in der aktuellen Sprache nicht verfügbar. Bitte hinzufügen oder Link ändern.")
                    }
                }
            }else if(autoLinks[i].getAttribute("autoLink-type") == "offsite"){
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    var ahorn_autoLinks = JSON.parse(JSON.stringify(ahorn.autoLinks)); //Echte kopie von ahorn.autoLinks erstellen.
                    if(autoLinks[i].getAttribute("autoLink-lang")!=undefined){ //Lang
                        var autoLink_lang = autoLinks[i].getAttribute("autoLink-lang");
                        try{
                            var elem_autoLink = getAutoLinkByLang(id, autoLink_lang);
                            if(elem_autoLink != false){
                                ahorn_autoLinks[id] = elem_autoLink;
                            }else{
                                console.warn("autoLink Fehler bei offsite Lang Fallback");
                                ahorn_autoLinks = ahorn.autoLinks
                            }
                        }catch(err){
                            console.warn("autoLink Fehler bei offsite Lang");
                            ahorn_autoLinks = ahorn.autoLinks
                        }
                    }
                    if(ahorn_autoLinks[id].href != "wartung" && ahorn_autoLinks[id].href != "" && ahorn_autoLinks[id].href != undefined){
                        if(autoLinks[i].nodeName == "A"){
                            autoLinks[i].href = ahorn_autoLinks[id].href;
                            if(autoLinks[i].getAttribute("autoLink-keepText")==undefined){
                                autoLinks[i].innerHTML = ahorn_autoLinks[id].name;
                            }
                        }else{
                            autoLinks[i].onclick= ()=>{window.location = link}
                            if(autoLinks[i].getAttribute("autoLink-setText")!=undefined){
                                autoLinks[i].innerHTML = ahorn_autoLinks[id].name;
                            }
                        }
                    }else{
                        autoLinks[i].removeAttribute("href");
                        switch(linkmanager.pageData.lang){
                            case "de": 
                                autoLinks[i].onclick=()=>{info.show(`Dieser Link ist aktuell nicht verfügbar.`)};
                                break;
                            case "en":
                                autoLinks[i].onclick=()=>{info.show(`This link is currently not available.`)};
                                break;
                        }
                    }
                }
            }else if(autoLinks[i].getAttribute("autoLink-type") == "download"){
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(ahorn.autoLinks[id].href != "wartung" && ahorn.autoLinks[id].href != "" && ahorn.autoLinks[id].href != undefined){
                        autoLinks[i].href = ahorn.autoLinks[id].href;
                        autoLinks[i].innerHTML = ahorn.autoLinks[id].name;
                        if(ahorn.autoLinks[id].download_name != "" && ahorn.autoLinks[id].download_name != "wartung" && ahorn.autoLinks[id].download_name != undefined){
                            autoLinks[i].download = ahorn.autoLinks[id].download_name;
                        }else if(!ahorn.settings.downloadToLink || (ahorn.settings.downloadToLink && ahorn.autoLinks[id].download_force)){
                            console.warn("Downloadfunktion bei folgendem AutoLink nicht verfügbar:");
                            console.warn(autoLinks[i]);
                            autoLinks[i].removeAttribute("href");
                            switch(linkmanager.pageData.lang){
                                case "de": 
                                    autoLinks[i].onclick=()=>{info.show(`Dieser Download ist aktuell nicht verfügbar.`)}
                                    break;
                                case "en":
                                    autoLinks[i].onclick=()=>{info.show(`This download is currently not available.`)};
                                    break;
                            }
                        }
                    }else{
                        if(ahorn.autoLinks[id].name != "" && ahorn.autoLinks[id].name != "wartung" && ahorn.autoLinks[id].name != undefined){
                            autoLinks[i].innerHTML = ahorn.autoLinks[id].name;
                        }
                        autoLinks[i].removeAttribute("href");
                        switch(linkmanager.pageData.lang){
                            case "de": 
                                autoLinks[i].onclick=()=>{info.show(`Dieser Link ist aktuell nicht verfügbar.`)};
                                break;
                            case "en":
                                autoLinks[i].onclick=()=>{info.show(`This link is currently not available.`)};
                                break;
                        }
                    }
                }
            }else{
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(sitemap[id][linkmanager.pageData.lang]!=undefined){
                        var autoLink_lang = linkmanager.pageData.lang;
                        var autoLink_path = sitemap[id][autoLink_lang].path
                        if(autoLinks[i].getAttribute("autoLink-lang")!=undefined){
                            var autoLink_lang = autoLinks[i].getAttribute("autoLink-lang");
                        }
                        if(autoLinks[i].getAttribute("autoLink-keepText")!=undefined){
                            var autoLink_path = autoLinks[i].innerHTML;
                        }
                        try{
                            autoLinks[i].href = sitemap[id][autoLink_lang].link;
                            autoLinks[i].innerHTML = autoLink_path;
                        }catch{
                            autoLinks[i].href = sitemap[id][linkmanager.pageData.lang].link;
                            autoLinks[i].innerHTML = sitemap[id][linkmanager.pageData.lang].path;
                            console.log("autoLink lang error fallback");
                        }
                    }else{// Wenn die Seite in der aktuellen Sprache nicht verfügbar ist
                        console.warn("Onsite AutoLink " + id + " ist in der aktuellen Sprache nicht verfügbar. Bitte hinzufügen oder Link ändern.")
                    }
                }
            }
        }catch(err){
            //Warnmeldung für User hinzufügen
            switch(linkmanager.pageData.lang){
                case "de": 
                    autoLinks[i].onclick=()=>{info.show(`Dieser Link ist aktuell nicht verfügbar.`)};
                    break;
                case "en":
                    autoLinks[i].onclick=()=>{info.show(`This link is currently not available.`)};
                    break;
            }
            console.warn(`[autoLinks] Es liegt ein Problem mit dem folgenden AutoLink vor:`);
            console.warn(autoLinks[i]);
            autoLinks[i].removeAttribute("href");
        }
    }
}

function autoLink_initLangs(){ //Setzt die für die aktuelle Sprache richtigen Werte für ein
    if(ahorn.autoLinks){
        for(i=0;i<Object.keys(ahorn.autoLinks).length; i++){
            var id = Object.keys(ahorn.autoLinks)[i];
            if(ahorn.autoLinks[id].langs){
                if(linkmanager.pageData && linkmanager.pageData.lang){
                    var linkLangs = ahorn.autoLinks[id].langs;
                    for(j=0;j<Object.keys(linkLangs).length;j++){
                        if(linkmanager.pageData.lang == Object.keys(linkLangs)[j]){
                            var lang = linkmanager.pageData.lang;
                            var parameters = ["name", "href", "download_name", "download_force"]; //Änderbare Parameter
                            parameters.forEach(parameter => {
                                if(linkLangs[lang][parameter] != undefined && linkLangs[lang][parameter] != "wartung" && linkLangs[lang][parameter] != ""){
                                    ahorn.autoLinks[id][parameter] = linkLangs[lang][parameter];
                                }
                            })
                        }
                    }
                }
            }   	
        }
    }
}

function getAutoLinkByLang(id, lang){ //Gibt das autoLink Object, in der entsprechenden Sprache zurück; Bei fehler wird false ausgegeben.
    ahorn_autoLinks = JSON.parse(JSON.stringify(ahorn.autoLinks)); //Echte kopie von ahorn.autoLinks erstellen.
    if(ahorn_autoLinks[id]){
        if(lang == linkmanager.pageData.lang){
            console.warn("autoLink Sprache ist gleich der Seitensprache.")
            return ahorn_autoLinks[id];
        }
        if(ahorn_autoLinks[id].langs){
            var autoLinks_temp = ahorn_autoLinks[id];
            var linkLangs = ahorn_autoLinks[id].langs;
            var parameters = ["name", "href", "download_name", "download_force"]; //Änderbare Parameter
            if(linkLangs[lang]){
                parameters.forEach(parameter => {
                    if(linkLangs[lang][parameter] != undefined && linkLangs[lang][parameter] != "wartung" && linkLangs[lang][parameter] != ""){
                        autoLinks_temp[parameter] = linkLangs[lang][parameter];
                    }
                })
                return autoLinks_temp;
            }else{
                console.warn("autoLink lang nicht verfügbar.");
                return false;
            }
        }   	
    }else{
        console.warn("autoLink id nicht verfügbar.");
        return false;
    }
}

ahorn.autoLinks = {
    template: {
        name: "", //Standard Anzeigename
        href: "", //Standard Link
        download_name: "", //Name und Dateipräfix der Downloaddatei (optional)
        download_force: true, //Verhindert downloadToLink (optional)
        langs: { //Hier können Sprachspezifische änderungen definiert werden (optional)
            de: { //Id der Sprache
                name: "", //Parameter, die geändert werden sollen
                href: ""
            },
            en: {
                name: "",
                href: "",
                download_name: ""
            }
        }
    },
    youtube: {
        name: "YouTube",
        href: "wartung",
    },
    luckyapps: {
        name: "LuckyApps",
        href: "wartung"
    },
    matchofmemes: {
        name: "MatchOfMemes",
        href: "wartung"
    },
    fotografiefreude: {
        name: "fotografiefreude",
        href: "wartung"
    },
    soundriseproductions: {
        name: "Soundrise Productions",
        href: "https://www.youtube.com/@soundriseproductions9976"
    },
    adac_liste: {
        name: "Liste",
        href: "https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle"
    },
    download_documentation: {
        name: "Dokumentation",
        href: "wartung",
        download_name: "Dokumentation.pdf",
        download_force: true,
        langs: {
            en: {
                name: "Documentation",
                href: "wartung",
                download_name: "Documentation.pdf"
            }
        }
    },
    download_windows:{
        name: "Download (Windows)",
        href: "wartung",
        download_name: "wartung",
        download_force: true
    },
    telegram:{
        name: "telegram",
        href: "wartung"
    },
    signal:{
        name: "signal",
        href: "wartung"
    }
}