var sitemap = {
    template: {
        de: {
            link: "/de/template.html",
            path: "TEMPLATE"
        },
        parent: "home" //Gibt den Elternabschnitt an
    },
    home: {
        de: {
            link: "/de/",
            path: "Home"
        },
        en: {
            link: "/en/maintenance/?pageId=home",
            path: "Home"
        }
    },
    maintenance: {
        de: {
            link: "/de/wartung/",
            path: "Wartung der Seite"
        },
        en: {
            link: "/en/maintenance/",
            path: "Page under Maintenance"
        },
        parent: "home"
    },
    article: {
        de: {
            link: "/de/Artikel/",
            path: "Artikel"
        },
        en: {
            link: "/en/maintenance/?pageId=article",
            path: "Article"
        },
        parent: "template"
    },
    updates: {
        de: {
            link: "/updates.html",
            path: ahorn.version
        },
        en: {
            link: "/updates.html",
            path: ahorn.version
        },
        fr: {
            link: "/updates.html",
            path: ahorn.version
        },
        es: {
            link: "/updates.html",
            path: ahorn.version
        },
        pl: {
            link: "/updates.html",
            path: ahorn.version
        }
    },
    getByLang: function(){ //Erstellt sitmap.byLang --> Auflistung der Seiten nach Sprache + Auflistung der ElternIds (parent)
        var sitemapLang = {}
        for(i=0;i<Object.keys(sitemap).length;i++){//Loop durch Namen
            var pageName = Object.keys(sitemap)[i];
            if(pageName != "getByLang" && pageName != "byLang" && pageName != "correctBase"){
                for(j=0;j<Object.keys(sitemap[pageName]).length;j++){//Loop durch Sprachen
                    if(!sitemapLang[Object.keys(sitemap[pageName])[j]]){//Wenn sprache noch nicht erfasst, hinzufügen
                        sitemapLang[Object.keys(sitemap[pageName])[j]] = {
                            [pageName]: sitemap[pageName][Object.keys(sitemap[pageName])[j]]
                        }
                    }else{
                        sitemapLang[Object.keys(sitemap[pageName])[j]][pageName] = sitemap[pageName][Object.keys(sitemap[pageName])[j]];
                    }
                    //console.log(sitemapLang);
                }
            }
        }
        sitemap.byLang = sitemapLang;
        return sitemapLang;
    },
    getParent: function(id){
        if(sitemap.byLang){
            if(typeof sitemap.byLang.parent[id] != "undefined"){
                return sitemap.byLang.parent[id]
            }else{
                return false;
            }
        }else{
            sitemap.getByLang();
            console.log("Retrying getParent");
            sitemap.getParent();
        }
    },
    correctBase: async function(){
        var sitemapLang = {}
        for(i=0;i<Object.keys(sitemap).length;i++){//Loop durch Namen
            var pageName = Object.keys(sitemap)[i];
            if(pageName != "getByLang" && pageName != "byLang" && pageName != "correctBase"){
                for(j=0;j<Object.keys(sitemap[pageName]).length;j++){//Loop durch Sprachen
                    var lang = Object.keys(sitemap[pageName])[j];
                    if(lang != "parent"){
                        sitemap[pageName][lang].link = await getAbsoluteLink(sitemap[pageName][lang].link);
                    }
                }
            }
        }
        console.log("Sitemap für Base korrigiert");
        return sitemap;
    }
}

sitemap.getByLang();

sitemap.correctBase();