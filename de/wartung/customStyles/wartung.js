window.addEventListener("load",async()=>{
    if(url_data.pageId != undefined){
        if(typeof linkmanager == "undefined"){
            while(typeof linkmanager == "undefined"){
                await sleep(30);
            }
            while(!linkmanager.loaded){
                await sleep(30);
            }
            if(url_data.pageId != ahorn.settings.homeId){
                linkmanager.pageData.parents.push(url_data.pageId);
            }
            linkmanager.pageData.siteId = url_data.pageId;
            if(document.getElementsByClassName("maintenance_subtitle")[0]){
                document.getElementsByClassName("maintenance_subtitle")[0].innerHTML = `${sitemap[url_data.pageId][linkmanager.pageData.lang].path}-Seite nicht verfügbar`
            }
            setFooterPath();
            setFooterLangs();
        }
    }
});