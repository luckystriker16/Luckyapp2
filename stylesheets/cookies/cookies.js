window.addEventListener("load",()=>{document.getElementById("cookieButton").onclick = cookiesButtonClick})

function init_cookies(){
    cookiesStyleToggle()
}

function cookiesButtonClick(){
    ahorn.changeSetting("cookies", true);
    cookiesStyleToggle();
}

function cookiesStyleToggle(){
    if(ahorn.settings.cookies){
        document.getElementsByTagName("html")[0].classList.remove("noscroll");
        document.getElementById("cookieContainer").style.display = "none";
    }else{
        document.getElementsByTagName("html")[0].classList.remove("noscroll");
        document.getElementById("cookieContainer").style.display = "flex";
    }
}
