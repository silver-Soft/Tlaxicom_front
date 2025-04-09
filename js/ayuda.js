const navToggle= document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")

var btn_problemasConex = document.getElementById("btn_problemasConex");
var btn_manuales = document.getElementById("btn_manuales");
var btn_conexLenta = document.getElementById("btn_conexLenta");
var btn_atencionPersonal = document.getElementById("btn_atencionPersonal");

var iframe = document.getElementById("frame_ui");

navToggle.addEventListener("click",()=>{
    navMenu.classList.toggle("nav-menu_visible"); 

    if (navMenu.classList.contains("nav-menu_visible")){
        navToggle.setAttribute("aria-label","Cerrar menú")
    }else{
        navToggle.setAttribute("aria-label","Abrir menú")
    }        
});

btn_problemasConex.addEventListener("click", ()=>{
    $('.contenidoLateral_ayuda').addClass('show')
    let ruta ="ui/problemasConex.html"
    iframe.setAttribute("src", ruta);
});
btn_manuales.addEventListener("click", ()=>{
    $('.contenidoLateral_ayuda').addClass('show')
    let ruta ="ui/manuales.html"
    iframe.setAttribute("src", ruta);
});
btn_conexLenta.addEventListener("click", ()=>{
    $('.contenidoLateral_ayuda').addClass('show')
    let ruta ="ui/conexionLenta.html"
    iframe.setAttribute("src", ruta);
});
btn_atencionPersonal.addEventListener("click", ()=>{
    $('.contenidoLateral_ayuda').addClass('show')
    let ruta ="ui/atencionPersonalizada.html"
    iframe.setAttribute("src", ruta);
});
