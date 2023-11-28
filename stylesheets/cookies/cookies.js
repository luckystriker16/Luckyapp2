window.addEventListener("load",()=>{
    if(document.getElementById("cookieContainer")){
        document.getElementById("cookieButton").onclick = cookiesButtonClick
    }else{
        console.warn("Kein Cookie-Container verfügbar.");
    }
})

function init_cookies(){
    cookiesStyleToggle()
}

function cookiesButtonClick(){
    ahorn.changeSetting("cookies", true);
    cookiesStyleToggle();
}

function cookiesStyleToggle(){
    if(document.getElementById("cookieContainer")){
        if(ahorn.settings.cookies){
            document.getElementsByTagName("html")[0].classList.remove("noscroll");
            document.getElementById("cookieContainer").style.display = "none";
        }else{
            document.getElementsByTagName("html")[0].classList.remove("noscroll");
            document.getElementById("cookieContainer").style.display = "flex";
        }
    }else{
        console.warn("Kein Cookie-Container verfügbar.");
    }
}
