const btnContratar= document.querySelector(".botonContratar")
const navToggle= document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")
const cajaContrata = document.querySelector(".cajaContrata")

/*Funcinoalidad de PAQUETES*/
var btn_basico = document.getElementById("btn_basico");
var btn_estandar = document.getElementById("btn_estandar");
var btn_premium = document.getElementById("btn_premium");
var btn_turbo = document.getElementById("btn_turbo");

/*Campos del PopUp*/
var txt_nombre = document.getElementById("nombre_popUp");
var txt_telefono = document.getElementById("telefono_popUp");
var txt_correo = document.getElementById("correo_popUp");

/*Boton carta derechos minimos*/
var btn_cartaDerechosMinimos = document.getElementById("cartaDerMin");
var btn_cartaDerechosMinimos2 = document.getElementById("cartaDerMin2");

btn_cartaDerechosMinimos.addEventListener("click",()=>{    
  download(this.btn_cartaDerechosMinimos.id);
});

btn_cartaDerechosMinimos2.addEventListener("click",()=>{    
  download("cartaDerMin");
});

function download(filename) {
  const link="./docs/"+filename+".pdf"
window.open(link,"_blank");
}

/* MAP CANVAS*/ 
function initialize() {
var lat=19.4722;
  var lon=-97.93701;
  var myLatLng = new google.maps.LatLng(lat,lon); 
  var mapOptions = {
    zoom: 12,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.RoadMap,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: false
  };
  
  var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  var terrenate = [
    new google.maps.LatLng(19.46889,-97.92106), new google.maps.LatLng(19.48149,-97.91305), new google.maps.LatLng(19.4847,-97.91259), new google.maps.LatLng(19.48445,-97.91684), new google.maps.LatLng(19.48269,-97.92014), new google.maps.LatLng(19.48195,-97.9238), new google.maps.LatLng(19.4789,-97.92449), new google.maps.LatLng(19.47627,-97.92885), new google.maps.LatLng(19.47344,-97.92778), new google.maps.LatLng(19.47097,-97.92865), new google.maps.LatLng(19.46924,-97.92486),   ]; 
  var toluca =[
    new google.maps.LatLng(19.47071,-97.94959), new google.maps.LatLng(19.47265,-97.9518), new google.maps.LatLng(19.4737,-97.95537), new google.maps.LatLng(19.47347,-97.96052), new google.maps.LatLng(19.47031,-97.96042), new google.maps.LatLng(19.46728,-97.96316), new google.maps.LatLng(19.46565,-97.95861), new google.maps.LatLng(19.46383,-97.95585), new google.maps.LatLng(19.46445,-97.95299), new google.maps.LatLng(19.46654,-97.94785), new google.maps.LatLng(19.46851,-97.94791), 
  ];
  var capulin =[
    new google.maps.LatLng(19.45149,-97.90282), new google.maps.LatLng(19.45311,-97.90369), new google.maps.LatLng(19.45416,-97.90727), new google.maps.LatLng(19.45364,-97.9104), new google.maps.LatLng(19.45109,-97.91115), new google.maps.LatLng(19.4481,-97.9151), new google.maps.LatLng(19.44615,-97.91217), new google.maps.LatLng(19.44695,-97.90933), new google.maps.LatLng(19.44709,-97.90583), new google.maps.LatLng(19.44861,-97.90257), new google.maps.LatLng(19.45009,-97.9025), 
  ];
  var cortezco=[
    new google.maps.LatLng(19.46721,-97.90455), new google.maps.LatLng(19.46848,-97.90306), new google.maps.LatLng(19.47019,-97.903), new google.maps.LatLng(19.47237,-97.90139), new google.maps.LatLng(19.47274,-97.90456), new google.maps.LatLng(19.47124,-97.90479), new google.maps.LatLng(19.47012,-97.90635), new google.maps.LatLng(19.46754,-97.90676), 
  ];
  var victoria=[
    new google.maps.LatLng(19.43887,-97.94706), new google.maps.LatLng(19.43987,-97.94495), new google.maps.LatLng(19.44231,-97.94491), new google.maps.LatLng(19.44441,-97.9454), new google.maps.LatLng(19.44588,-97.94665), new google.maps.LatLng(19.44688,-97.94825), new google.maps.LatLng(19.44593,-97.95125), new google.maps.LatLng(19.44312,-97.94983), new google.maps.LatLng(19.44214,-97.95015), new google.maps.LatLng(19.44062,-97.94982), new google.maps.LatLng(19.43926,-97.94886), 
  ];
  var bravo =[
    new google.maps.LatLng(19.41829,-97.96629), new google.maps.LatLng(19.42064,-97.96552), new google.maps.LatLng(19.42224,-97.96418), new google.maps.LatLng(19.42395,-97.96444), new google.maps.LatLng(19.4256,-97.96561), new google.maps.LatLng(19.42608,-97.96756), new google.maps.LatLng(19.42477,-97.97005), new google.maps.LatLng(19.42319,-97.97079), new google.maps.LatLng(19.42158,-97.97042), new google.maps.LatLng(19.41981,-97.97047), new google.maps.LatLng(19.41841,-97.96907), 
  ];
  var galeana =[
    new google.maps.LatLng(19.40768,-97.95796), new google.maps.LatLng(19.40913,-97.95423), new google.maps.LatLng(19.412,-97.95295), new google.maps.LatLng(19.41418,-97.9519), new google.maps.LatLng(19.41614,-97.95199), new google.maps.LatLng(19.41745,-97.95362), new google.maps.LatLng(19.41796,-97.95604), new google.maps.LatLng(19.41581,-97.95647), new google.maps.LatLng(19.41532,-97.9584), new google.maps.LatLng(19.41364,-97.9585), new google.maps.LatLng(19.4117,-97.95834), new google.maps.LatLng(19.41038,-97.9607), new google.maps.LatLng(19.4089,-97.95995),  
  ];
  var villareal =[
    new google.maps.LatLng(19.52454,-97.8996), new google.maps.LatLng(19.52675,-97.89613), new google.maps.LatLng(19.5297,-97.89514), new google.maps.LatLng(19.53144,-97.89302), new google.maps.LatLng(19.53461,-97.89255), new google.maps.LatLng(19.53619,-97.8941), new google.maps.LatLng(19.53695,-97.89737), new google.maps.LatLng(19.53658,-97.8987), new google.maps.LatLng(19.53791,-97.90051), new google.maps.LatLng(19.53757,-97.90297), new google.maps.LatLng(19.53313,-97.90466), new google.maps.LatLng(19.5291,-97.90551), new google.maps.LatLng(19.52572,-97.90317),    
  ];
  areaterrenate = new google.maps.Polygon({
    paths: terrenate,
    draggable: false, // turn off if it gets annoying
    editable: false,
    strokeColor: '#0042ff ',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b2ff',
    fillOpacity: 0.35
  });
  areatoluca = new google.maps.Polygon({ 
    paths: toluca,
    draggable: false, // turn off if it gets annoying
    editable: false,
    strokeColor: '#0042ff ',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b2ff',
    fillOpacity: 0.35
  });
  areagaleana = new google.maps.Polygon({ 
    paths: galeana,
    draggable: false, // turn off if it gets annoying
    editable: false,
    strokeColor: '#0042ff ',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b2ff',
    fillOpacity: 0.35
  });
  areabravo = new google.maps.Polygon({ 
    paths: bravo,
    draggable: false, // turn off if it gets annoying
    editable: false,
    strokeColor: '#0042ff ',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b2ff',
    fillOpacity: 0.35
  });
  areacapulin = new google.maps.Polygon({ 
    paths: capulin,
    draggable: false, // turn off if it gets annoying
    editable: false,
    strokeColor: '#0042ff ',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b2ff',
    fillOpacity: 0.35
  });
  areacortexco = new google.maps.Polygon({ 
    paths: cortezco,
    draggable: false, // turn off if it gets annoying
    editable: false,
    strokeColor: '#0042ff ',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b2ff',
    fillOpacity: 0.35
  });
  areavictoria = new google.maps.Polygon({ 
    paths: victoria,
    draggable: false, // turn off if it gets annoying
    editable: false,
    strokeColor: '#0042ff ',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b2ff',
    fillOpacity: 0.35
  });
  areavillareal = new google.maps.Polygon({ 
    paths: villareal,
    draggable: false, // turn off if it gets annoying
    editable: false,
    strokeColor: '#0042ff ',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b2ff',
    fillOpacity: 0.35
  });
  
  areaterrenate.setMap(map);
  areabravo.setMap(map);
  areacapulin.setMap(map);
  areagaleana.setMap(map);
  areatoluca.setMap(map);
  areavictoria.setMap(map);
  areacortexco.setMap(map);
  areavillareal.setMap(map);
}
/*Ventana PopUp de paquetes*/
btn_basico.addEventListener("click",()=>{
  txt_nombre.value="";
  txt_telefono.value="";
  txt_correo.value="";
  document.form_pop.info_pqt.value = ""
  document.form_pop.info_pqt.value = "Hola! me interesa el paquete básico de 4 Mb $300.00"
});
btn_estandar.addEventListener("click",()=>{
  txt_nombre.value="";
  txt_telefono.value="";
  txt_correo.value="";
  document.form_pop.info_pqt.value = ""
  document.form_pop.info_pqt.value = "Hola! me interesa el paquete estandar 5 Mb $400.00"
});
btn_premium.addEventListener("click",()=>{
  txt_nombre.value="";
  txt_telefono.value="";
  txt_correo.value="";
  document.form_pop.info_pqt.value = ""
  document.form_pop.info_pqt.value = "Hola! me interesa el paquete premium 6Mb $500.00"
});
btn_turbo.addEventListener("click",()=>{
  txt_nombre.value="";
  txt_telefono.value="";
  txt_correo.value="";
  document.form_pop.info_pqt.value = ""
  document.form_pop.info_pqt.value = "Hola! me interesa el paquete turbo 10 Mb $900.00"
});
function showPopup(){     
    $('.pop-up').addClass('show')
    $('.pop-up-wrap').addClass('show')
}
function closePopup(){
    $('.pop-up').removeClass('show')
    $('.pop-up-wrap').removeClass('show')
}

/*Icono de chat por whatsapp*/
function sinCoverturaContacto(){                                                           
    window.open("https://wa.me/+522411195233?text=Hola!%20estoy%20fuera%20de%20la%20zona%20de%20cobertura%20¿Qué%20puedo%20hacer?%20","_blank");  
}

//Mostrar Ocultar Menú
navToggle.addEventListener("click",()=>{
    navMenu.classList.toggle("nav-menu_visible");

    if (navMenu.classList.contains("nav-menu_visible")){
        navToggle.setAttribute("aria-label","Cerrar menú")
    }else{
        navToggle.setAttribute("aria-label","Abrir menú")
    }        
});

/*Mostrar ocultar enlace a paquetes*/
window.addEventListener('scroll',()=>{
  let scrollTop= document.documentElement.scrollTop;
  let alturaAnimado= cajaContrata.offsetTop;  
  if(alturaAnimado<scrollTop){
    $('.cajaContrata').removeClass('cajaContrata_mostrar') 
    $('.cajaContrata').addClass('cajaContrata_ocultar')    
  }else{
    $('.cajaContrata').removeClass('cajaContrata_ocultar')
    $('.cajaContrata').addClass('cajaContrata_mostrar')  
  }     
   
});