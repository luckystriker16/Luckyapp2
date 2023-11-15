window.addEventListener("load",resizeHeader);
window.addEventListener("resize",resizeHeader);

var headerResizeCount = 0;

function resizeHeader(){
    //console.log("resize");
    headerResizeCount++;
    var header = document.getElementsByTagName("header")[0];
    header.style.height = window.innerHeight +"px";
}