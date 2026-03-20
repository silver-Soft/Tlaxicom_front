const btnContratar = document.querySelector(".botonContratar");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const cajaContrata = document.querySelector(".cajaContrata");

/*Funcinoalidad de PAQUETES*/
var btn_basico = document.getElementById("btn_basico");
//var btn_estandar = document.getElementById("btn_estandar");
var btn_premium = document.getElementById("btn_premium");
var btn_turbo = document.getElementById("btn_turbo");

/*Campos del PopUp*/
var txt_nombre = document.getElementById("nombre_popUp");
var txt_telefono = document.getElementById("telefono_popUp");
var txt_correo = document.getElementById("correo_popUp");

const slider = document.getElementById('showCaseSlider')
const slides = slider.querySelectorAll('.item')
const dotContainer = document.querySelector('.dot-container')

/** @type {HTMLDivElement[]} */
let dots = []

const autoSlideInterval = 3000
let index = 0
let sliding = false
let timer = null

/* MAP CANVAS*/
function initialize() {
  var lat = 19.4722;
  var lon = -97.93701;
  var myLatLng = new google.maps.LatLng(lat, lon);
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
    fullscreenControl: false,
  };

  var map = new google.maps.Map(
    document.getElementById("map-canvas"),
    mapOptions
  );

  const zonas = [
    {
      tipo: "fibra", //TERRENATE
      coordenadas: [
        new google.maps.LatLng(19.48504021002807, -97.91293740227955),
        new google.maps.LatLng(19.48222660160904, -97.91893735290957),
        new google.maps.LatLng(19.48141423473217, -97.92244059475925),
        new google.maps.LatLng(19.47721164420519, -97.92777948753628),
        new google.maps.LatLng(19.4729243675541, -97.9274917173082),
        new google.maps.LatLng(19.47150121798063, -97.92828292220331),
        new google.maps.LatLng(19.47007474708765, -97.92799985374805),
        new google.maps.LatLng(19.46816117569897, -97.92597145336116),
        new google.maps.LatLng(19.46784124329036, -97.92286458375855),
        new google.maps.LatLng(19.46795749713652, -97.91997309877034),
        new google.maps.LatLng(19.46779825534726, -97.91549567709478),
        new google.maps.LatLng(19.47600554752903, -97.91155166175876),
        new google.maps.LatLng(19.48327448756057, -97.91171856280495),
        new google.maps.LatLng(19.48504021002807, -97.91293740227955),
      ],
    },
    {
      tipo: "fibra", //TOLUCA
      coordenadas: [
        new google.maps.LatLng(19.4724123617668, -97.95067106370119),
        new google.maps.LatLng(19.47490293912335, -97.95569996046173),
        new google.maps.LatLng(19.47464276303582, -97.9584904833938),
        new google.maps.LatLng(19.4732076060473, -97.96029386170038),
        new google.maps.LatLng(19.47032100336061, -97.96191308333863),
        new google.maps.LatLng(19.46879162942195, -97.96270429867945),
        new google.maps.LatLng(19.46655584187037, -97.96110414412831),
        new google.maps.LatLng(19.46569728633838, -97.96003012864975),
        new google.maps.LatLng(19.4644846395945, -97.9572333846952),
        new google.maps.LatLng(19.46368752725476, -97.95511313224942),
        new google.maps.LatLng(19.46337425377564, -97.95144386052692),
        new google.maps.LatLng(19.46967753774974, -97.94809132674057),
        new google.maps.LatLng(19.4724123617668, -97.95067106370119),
      ],
    },
    {
      tipo: "fibra", //VICTORIA
      coordenadas: [
        new google.maps.LatLng(19.44947286081392, -97.94752863854428),
        new google.maps.LatLng(19.44898840440593, -97.95143374171104),
        new google.maps.LatLng(19.44594161092107, -97.95190763023209),
        new google.maps.LatLng(19.44243939383018, -97.95134236732956),
        new google.maps.LatLng(19.43775264643233, -97.94893820570795),
        new google.maps.LatLng(19.43890170218439, -97.94440815387904),
        new google.maps.LatLng(19.444515485425, -97.94466531044399),
        new google.maps.LatLng(19.44947286081392, -97.94752863854428),
      ],
    },
    {
      tipo: "fibra", //BRAVO
      coordenadas: [
        new google.maps.LatLng(19.41937370007383, -97.97076421452691),
        new google.maps.LatLng(19.41862633507723, -97.96964629140352),
        new google.maps.LatLng(19.41836522463774, -97.96771630226732),
        new google.maps.LatLng(19.41852242791291, -97.96620719468112),
        new google.maps.LatLng(19.42098178392391, -97.96467501014043),
        new google.maps.LatLng(19.42119577617129, -97.96457648082415),
        new google.maps.LatLng(19.42379886650949, -97.9638004406043),
        new google.maps.LatLng(19.42517254430721, -97.96373069667052),
        new google.maps.LatLng(19.4252321360598, -97.96371180281858),
        new google.maps.LatLng(19.42643762841571, -97.96533230092723),
        new google.maps.LatLng(19.42620040667719, -97.96661529875084),
        new google.maps.LatLng(19.42602995704921, -97.96819568804518),
        new google.maps.LatLng(19.41937370007383, -97.97076421452691),
      ],
    },
    {
      tipo: "fibra", //CAPULIN
      coordenadas: [
        new google.maps.LatLng(19.45175083880799, -97.91000056862374),
        new google.maps.LatLng(19.44866031281817, -97.91115754154247),
        new google.maps.LatLng(19.44740264132871, -97.90814525626445),
        new google.maps.LatLng(19.44723788859834, -97.90532801264123),
        new google.maps.LatLng(19.44728511028421, -97.90531052470376),
        new google.maps.LatLng(19.45074026656224, -97.90388347457811),
        new google.maps.LatLng(19.45302624610888, -97.90841317330721),
        new google.maps.LatLng(19.45175083880799, -97.91000056862374),
      ],
    },
    {
      tipo: "wireless", //AMELES
      coordenadas: [
        new google.maps.LatLng(19.46415432232619, -97.90033175939661),
        new google.maps.LatLng(19.46285754096371, -97.89948359355611),
        new google.maps.LatLng(19.46202686342493, -97.89776248548894),
        new google.maps.LatLng(19.46277434746263, -97.89688362223619),
        new google.maps.LatLng(19.46278458483867, -97.89687472287315),
        new google.maps.LatLng(19.46468623057326, -97.89596156078238),
        new google.maps.LatLng(19.46531669775542, -97.89686036639289),
        new google.maps.LatLng(19.46551883879908, -97.89908820292099),
        new google.maps.LatLng(19.46415432232619, -97.90033175939661),
      ],
    },
    {
      tipo: "wireless", //CORTEZCO
      coordenadas: [
        new google.maps.LatLng(19.46946058981327, -97.90690262370248),
        new google.maps.LatLng(19.46847378580023, -97.90581599292406),
        new google.maps.LatLng(19.46785094582979, -97.90394249189595),
        new google.maps.LatLng(19.46801600921083, -97.90293233734364),
        new google.maps.LatLng(19.47000432358959, -97.90248500386105),
        new google.maps.LatLng(19.47135342071169, -97.90520129201347),
        new google.maps.LatLng(19.46946058981327, -97.90690262370248),
      ],
    },
    {
      tipo: "fibra", //GALEANA
      coordenadas: [
        new google.maps.LatLng(19.40906170467606, -97.96123031997733),
        new google.maps.LatLng(19.4074311545568, -97.95899198728155),
        new google.maps.LatLng(19.40790385768131, -97.95743536951476),
        new google.maps.LatLng(19.40821575934309, -97.95585875919721),
        new google.maps.LatLng(19.4094404250538, -97.95393995185223),
        new google.maps.LatLng(19.40957980793682, -97.95387548660939),
        new google.maps.LatLng(19.40976639209924, -97.95378864781743),
        new google.maps.LatLng(19.40993071074591, -97.95371116167811),
        new google.maps.LatLng(19.41301763909771, -97.95199107007008),
        new google.maps.LatLng(19.41306074800782, -97.95193954208533),
        new google.maps.LatLng(19.41326564543292, -97.95183836665815),
        new google.maps.LatLng(19.41336848440505, -97.95178758811785),
        new google.maps.LatLng(19.41674532004951, -97.95029596103159),
        new google.maps.LatLng(19.41933388816012, -97.95598010738966),
        new google.maps.LatLng(19.40906170467606, -97.96123031997733),
      ],
    },
    {
      tipo: "wireless", //VILLARREAL
      coordenadas: [
        new google.maps.LatLng(19.53446484815974, -97.90067196166035),
        new google.maps.LatLng(19.53143484670837, -97.90000420538512),
        new google.maps.LatLng(19.52893451166487, -97.89812324540802),
        new google.maps.LatLng(19.52812318047869, -97.89646162231338),
        new google.maps.LatLng(19.52883903285309, -97.8951544587668),
        new google.maps.LatLng(19.53080588564651, -97.89384359760419),
        new google.maps.LatLng(19.5330005060385, -97.89250246641534),
        new google.maps.LatLng(19.53519928113936, -97.89285897763692),
        new google.maps.LatLng(19.53674975358111, -97.89696096765621),
        new google.maps.LatLng(19.53706023871724, -97.89986529326792),
        new google.maps.LatLng(19.53446484815974, -97.90067196166035),
      ],
    },
    {
      tipo: "wireless", //RINCON
      coordenadas: [
        new google.maps.LatLng(19.49753224292899, -97.90060933573052),
        new google.maps.LatLng(19.49749096950746, -97.90457303145529),
        new google.maps.LatLng(19.49661481173988, -97.90556665681341),
        new google.maps.LatLng(19.49584608471091, -97.90553609275874),
        new google.maps.LatLng(19.49354171238115, -97.90524964993304),
        new google.maps.LatLng(19.49033725884576, -97.90494682609261),
        new google.maps.LatLng(19.48967569809486, -97.90534846953003),
        new google.maps.LatLng(19.48824312632518, -97.90390659574301),
        new google.maps.LatLng(19.48869801298758, -97.90276632672281),
        new google.maps.LatLng(19.49061733401199, -97.9006278778792),
        new google.maps.LatLng(19.49189727773506, -97.89926912657781),
        new google.maps.LatLng(19.49393567733169, -97.89801239579238),
        new google.maps.LatLng(19.4959439765171, -97.89674690840445),
        new google.maps.LatLng(19.49688655919324, -97.89648069227205),
        new google.maps.LatLng(19.49815019219266, -97.898335164458),
        new google.maps.LatLng(19.49753224292899, -97.90060933573052),
      ],
    },
    {
      tipo: "fibra", //CARDENAS
      coordenadas: [
        new google.maps.LatLng(19.53939149623004, -97.97845502855219),
        new google.maps.LatLng(19.5418525396271, -97.97163954529466),
        new google.maps.LatLng(19.54189294286754, -97.97161142244214),
        new google.maps.LatLng(19.54304713306922, -97.97150337093572),
        new google.maps.LatLng(19.5429052462508, -97.97392329055207),
        new google.maps.LatLng(19.54200329451856, -97.97765595038054),
        new google.maps.LatLng(19.54358941375176, -97.98001955770661),
        new google.maps.LatLng(19.5474836240519, -97.98321116355842),
        new google.maps.LatLng(19.54822093412078, -97.98642656884952),
        new google.maps.LatLng(19.54687876537674, -97.98859288797262),
        new google.maps.LatLng(19.54317413922603, -97.98990800183168),
        new google.maps.LatLng(19.53967904954151, -97.98883352547146),
        new google.maps.LatLng(19.53368372359582, -97.98398301764307),
        new google.maps.LatLng(19.53939149623004, -97.97845502855219),
      ],
    },
    {
      tipo: "wireless", //LAGUNA
      coordenadas: [
        new google.maps.LatLng(19.51444860537723, -97.99535419546524),
        new google.maps.LatLng(19.51467541224213, -97.99497581889038),
        new google.maps.LatLng(19.51550234095951, -97.99363031408841),
        new google.maps.LatLng(19.51711468212327, -97.99184719688671),
        new google.maps.LatLng(19.51717289501821, -97.99179412392952),
        new google.maps.LatLng(19.51723525004795, -97.99168350633954),
        new google.maps.LatLng(19.51916656010293, -97.99061883352809),
        new google.maps.LatLng(19.52065771633348, -97.99116271570796),
        new google.maps.LatLng(19.52019048173609, -97.99329915218458),
        new google.maps.LatLng(19.51990413551773, -97.99697761482511),
        new google.maps.LatLng(19.51901104211032, -97.99858845589598),
        new google.maps.LatLng(19.5166462715221, -97.99893768463717),
        new google.maps.LatLng(19.51444860537723, -97.99535419546524),
      ],
    },
    {
      tipo: "wireless", //ZAPATA
      coordenadas: [
        new google.maps.LatLng(19.56326784660337, -97.91998509754627),
        new google.maps.LatLng(19.56099186046184, -97.92153807414249),
        new google.maps.LatLng(19.55902040480167, -97.92243510041942),
        new google.maps.LatLng(19.55767167255944, -97.92087333106063),
        new google.maps.LatLng(19.55463983477894, -97.9174506559831),
        new google.maps.LatLng(19.55399817209254, -97.91526908385944),
        new google.maps.LatLng(19.55458234567273, -97.91127170731717),
        new google.maps.LatLng(19.55571280446627, -97.90908385112816),
        new google.maps.LatLng(19.55714416271503, -97.90673077658666),
        new google.maps.LatLng(19.55876229288724, -97.907696143034),
        new google.maps.LatLng(19.56129200160715, -97.9164615964073),
        new google.maps.LatLng(19.56326784660337, -97.91998509754627),
      ],
    },
    {
      tipo: "fibra", //DIAZ ORDAZ
      coordenadas: [
        new google.maps.LatLng(19.57693746491569, -97.95274292368157),
        new google.maps.LatLng(19.57783396715146, -97.95231174869798),
        new google.maps.LatLng(19.57819460841913, -97.9519046460608),
        new google.maps.LatLng(19.57922051987366, -97.95331565171497),
        new google.maps.LatLng(19.58032106335108, -97.9556518572893),
        new google.maps.LatLng(19.58198161044917, -97.95846949736898),
        new google.maps.LatLng(19.58457694512367, -97.96254277765789),
        new google.maps.LatLng(19.58457538485912, -97.96401322084586),
        new google.maps.LatLng(19.58342251940467, -97.96455967669978),
        new google.maps.LatLng(19.58161800070258, -97.96355022575507),
        new google.maps.LatLng(19.57974738174637, -97.96096899565904),
        new google.maps.LatLng(19.57768001435852, -97.95791980898316),
        new google.maps.LatLng(19.57565438248939, -97.9548480140307),
        new google.maps.LatLng(19.57479553892409, -97.95313755176315),
        new google.maps.LatLng(19.57693746491569, -97.95274292368157),
      ],
    },
    {
      tipo: "wireless", //ATEZQUILLA
      coordenadas: [
        new google.maps.LatLng(19.64753986305761, -97.9878628615468),
        new google.maps.LatLng(19.64848452253206, -97.98473586994096),
        new google.maps.LatLng(19.65051735536644, -97.98376662265179),
        new google.maps.LatLng(19.65054909024316, -97.9837871877032),
        new google.maps.LatLng(19.65161376966331, -97.98445094239653),
        new google.maps.LatLng(19.65213711127905, -97.98530324777316),
        new google.maps.LatLng(19.65212174446651, -97.98541445081368),
        new google.maps.LatLng(19.65257458401131, -97.98897581275762),
        new google.maps.LatLng(19.65319266916074, -97.99003606203996),
        new google.maps.LatLng(19.65534514986679, -97.99148589025491),
        new google.maps.LatLng(19.65850521920666, -97.99096928167654),
        new google.maps.LatLng(19.66084477992801, -97.99162044985982),
        new google.maps.LatLng(19.66248783745862, -97.99255767258781),
        new google.maps.LatLng(19.66218125298341, -97.99546697637065),
        new google.maps.LatLng(19.66143105332552, -97.99620563700658),
        new google.maps.LatLng(19.65968505821204, -97.99703796160976),
        new google.maps.LatLng(19.657095780796, -97.99768392490144),
        new google.maps.LatLng(19.65626266576732, -97.99856835490122),
        new google.maps.LatLng(19.65309775319849, -97.99634170383095),
        new google.maps.LatLng(19.64753986305761, -97.9878628615468),
      ],
    },
  ];

  zonas.forEach((zona) => {
    const strokeColor = zona.tipo === "wireless" ? "#13cb2c" : "#00a6ff";
    const fillColor = zona.tipo === "wireless" ? "#70ff00" : "#006cff";

    const poligono = new google.maps.Polygon({
      paths: zona.coordenadas,
      strokeColor: strokeColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: fillColor,
      fillOpacity: 0.35,
    });

    poligono.setMap(map);
  });
}

/** Go to a slide
 * @param {number} go - The index of the slide to go to
 **/
async function slideTo(go) {
  if (sliding || go === index) return
  sliding = true
  clearInterval(timer)

  slides[index].classList.remove('active')
  dots[index].classList.remove('active')

  // Ensure index is in range
  index = (go + slides.length) % slides.length

  slides[index].classList.add('active')
  dots[index].classList.add('active')

  await new Promise(resolve => setTimeout(resolve, 500))

  sliding = false
  autoSlide()
}

/** Start auto slide timer **/
function autoSlide() { 
  timer = setInterval(() => {
      slideTo(index + 1)
  }, autoSlideInterval)
}

// Create dots
if (slides.length > 1){
  let dotContainer = slider.querySelector('.dot-container')

  for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('div')

      dot.classList.add('dot')
      dotContainer.appendChild(dot)

      dots.push(dot)
      dot.addEventListener('click', () => slideTo(i))
  }
  // Set first dot active
  dots[0].classList.add('active')
}

// On ready
document.addEventListener('DOMContentLoaded', () => {
  if (slides.length <= 1) return
  
  const hammer = new Hammer(slider)
  hammer.on('swipeleft', () => slideTo(index + 1))
  hammer.on('swiperight', () => slideTo(index - 1))
  autoSlide()
})

/*Ventana PopUp de paquetes*/
btn_basico.addEventListener("click", () => {
  txt_nombre.value = "";
  txt_telefono.value = "";
  txt_correo.value = "";
  document.form_pop.info_pqt.value = "";
  document.form_pop.info_pqt.value =
    "Hola! me interesa el paquete básico de 4 Mb $300.00";
});

btn_premium.addEventListener("click", () => {
  txt_nombre.value = "";
  txt_telefono.value = "";
  txt_correo.value = "";
  document.form_pop.info_pqt.value = "";
  document.form_pop.info_pqt.value =
    "Hola! me interesa el paquete premium 6Mb $500.00";
});
btn_turbo.addEventListener("click", () => {
  txt_nombre.value = "";
  txt_telefono.value = "";
  txt_correo.value = "";
  document.form_pop.info_pqt.value = "";
  document.form_pop.info_pqt.value =
    "Hola! me interesa el paquete turbo 10 Mb $900.00";
});
function showPopup() {
  $(".pop-up").addClass("show");
  $(".pop-up-wrap").addClass("show");
}
function closePopup() {
  $(".pop-up").removeClass("show");
  $(".pop-up-wrap").removeClass("show");
}

/*Icono de chat por whatsapp*/
function sinCoverturaContacto() {
  window.open(
    "https://wa.me/+522411195233?text=Hola!%20estoy%20fuera%20de%20la%20zona%20de%20cobertura%20¿Qué%20puedo%20hacer?%20",
    "_blank"
  );
}

//Mostrar Ocultar Menú
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav-menu_visible");

  if (navMenu.classList.contains("nav-menu_visible")) {
    navToggle.setAttribute("aria-label", "Cerrar menú");
  } else {
    navToggle.setAttribute("aria-label", "Abrir menú");
  }
});

/*Mostrar ocultar enlace a paquetes*/
window.addEventListener("scroll", () => {
  let scrollTop = document.documentElement.scrollTop;
  let alturaAnimado = cajaContrata.offsetTop;
  if (alturaAnimado < scrollTop) {
    $(".cajaContrata").removeClass("cajaContrata_mostrar");
    $(".cajaContrata").addClass("cajaContrata_ocultar");
  } else {
    $(".cajaContrata").removeClass("cajaContrata_ocultar");
    $(".cajaContrata").addClass("cajaContrata_mostrar");
  }
});
