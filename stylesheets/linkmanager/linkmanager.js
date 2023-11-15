var linkmanager = {
    loaded: false,
    load: async function(){
        var location = window.location.pathname.replace("index.html","");//Prepare location
        for(j=0;j<Object.keys(sitemap).length;j++){
            var siteId = Object.keys(sitemap)[j];
            for(k=0;k<Object.keys(sitemap[siteId]).length;k++){
                var langId = Object.keys(sitemap[siteId])[k];
                if(langId == window.location.pathname.substring(1,3)){
                    if(sitemap[siteId][langId].link == location){
                        linkmanager.pageData = {
                            siteId: siteId,
                            lang: langId,
                            parents: [],
                            navbar: ["home", "template"],
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
            if(ahorn.settings.enableAutoMaintenance){
                window.location = sitemap.byLang[window.location.pathname.substring(1,3)].maintenance.link;
            }
            console.error("Linkmanager ist auf diser Seite nicht verfügbar. Möglicherweise wurde die Seite noch nicht in sitemap.js hinzugefügt.");
            console.warn("setFooterPath(), setFooterLangs(), setAutoNavbar() und setAutoLinks() werden nicht ausgeführt.");
            return;
        }
        setFooterPath();
        setFooterLangs();
        setAutoNavbar();
        setAutoLinks();
        linkmanager.loaded = true;
    },
    test: function(){
        console.warn("TEST");
    }
}

function setFooterPath(){
    if(document.getElementsByClassName("fPath")[0]){
        try{
            var fPath = document.getElementsByClassName("fPath")[0];
            if(linkmanager.pageData.parents.length == 0){ //Wenn Keine Parents verfügbar
                fPath.innerHTML = "<a href='"+ sitemap[linkmanager.pageData.siteId][linkmanager.pageData.lang].link +"'>"+'<img src="/media/la/logo_1440.png"></a>';
            }else{
                fPath.innerHTML = "";
            }
            for(i=0;i<linkmanager.pageData.parents.length;i++){ //Wenn Parents verfügbar, durchloopen
                var currentParent = linkmanager.pageData.parents[i];
                //console.log(currentParent);
                if(typeof sitemap[currentParent][linkmanager.pageData.lang] != "undefined"){ //Wenn der Pfad nicht in der aktuellen Sprache verfügbar ist überspringen
                    if(currentParent == "home"){ //Wenn Home, dann Bild hinzufügen
                        fPath.innerHTML += "<a href='"+ sitemap[currentParent][linkmanager.pageData.lang].link +"'>"+'<img src="/media/la/logo_1440.png"></a>';
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

function setFooterLangs(){
    if(document.getElementsByClassName("fLang")[0]){
        var fLang = document.getElementsByClassName("fLang")[0];
        var footerLangs = {
            de:{
                name: "Deutsch"
            },
            en:{
                name: "Englisch"
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
            for(i=0;i<Object.keys(footerLangs).length;i++){
                if(Object.keys(footerLangs)[i]==linkmanager.pageData.lang){
                    fLang.innerHTML += "<a href='"+ linkmanager.pageData.data.link +"' class='fLangSelected'>"+ footerLangs[Object.keys(footerLangs)[i]].name +"</a>";
                }else{
                    try{
                        fLang.innerHTML += "<a href='"+ sitemap[linkmanager.pageData.siteId][Object.keys(footerLangs)[i]].link +"'>"+ footerLangs[Object.keys(footerLangs)[i]].name +"</a>";
                    }catch(err){
                        console.warn(`Die Seite ist nicht auf ${footerLangs[Object.keys(footerLangs)[i]].name} verfügbar.`);
                    }
                }
            }
        }catch(err){
            console.warn("Footer Lang konnte nicht gesetzt werden.");
            try{
                fLang.innerHTML = fLangOLDHtml;
            }catch(err){
                console.warn("Manuelle Footer Lang auswahl konnte nicht wiederhergestellt werden.")
            }
        }
    }
}

function setAutoNavbar(){
    var navbarElements = linkmanager.pageData.navbar;
    if(document.getElementsByTagName("nav")){
        var nav = document.getElementsByTagName("nav")[0];
        var navChilds = nav.children;
        if(navbarElements.length != 0){
            nav.innerHTML = '<div id="closeNav">X</div>';
            for(i=0;i<navbarElements.length;i++){
                if(navbarElements[i]=="home"){
                    nav.innerHTML += "<img src='/media/la/logo_1440.png' class='autoLink' autoLink-type='onsiteNOa' autoLink-Id='"+ navbarElements[i] +"'></img>"
                }else{
                    nav.innerHTML += "<a class='autoLink nava' autoLink-type='onsite' autoLink-Id='"+ navbarElements[i] +"'></a>";
                }
            }
        }
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
                        autoLinks[i].href = sitemap[id][linkmanager.pageData.lang].link;
                        autoLinks[i].innerHTML = sitemap[id][linkmanager.pageData.lang].path;
                    }
                }
            }else if(autoLinks[i].getAttribute("autoLink-type") == "onsiteNOa"){
                if(autoLinks[i].getAttribute("autoLink-Id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(sitemap[id][linkmanager.pageData.lang]!=undefined){
                        var link = sitemap[id][linkmanager.pageData.lang].link;
                        autoLinks[i].onclick= ()=>{window.location = link}
                    }
                }
            }else if(autoLinks[i].getAttribute("autoLink-type") == "offsite"){
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                        autoLinks[i].href = ahorn.autoLinks[id].href;
                        autoLinks[i].innerHTML = ahorn.autoLinks[id].name;
                }
            }else{
                if(autoLinks[i].getAttribute("autoLink-id")!=undefined){
                    id = autoLinks[i].getAttribute("autoLink-id");
                    if(sitemap[id][linkmanager.pageData.lang]!=undefined){
                        autoLinks[i].href = sitemap[id][linkmanager.pageData.lang].link;
                        autoLinks[i].innerHTML = sitemap[id][linkmanager.pageData.lang].path;
                    }
                }
            }
        }catch(err){
            console.warn(`[autoLinks] Es liegt ein Problem mit dem folgenden AutoLink vor:`);
            console.warn(autoLinks[i]);
        }
    }
}

ahorn.autoLinks = {
    youtube: {
        name: "YouTube",
        href: "https://www.youtube.com/"
    }
}