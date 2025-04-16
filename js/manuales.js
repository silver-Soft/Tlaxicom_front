var btn_tplink3 = document.getElementById("TP-LINK_3");
var btn_mercusys3 = document.getElementById("MERCUSYS_3");
var btn_mercusys2 = document.getElementById("MERCUSYS_2");
var btn_tplink2 = document.getElementById("TP-LINK_2");
var btn_asus = document.getElementById("ASUS");
var btn_huawei = document.getElementById("HUAWEI");
var btn_tenda = document.getElementById("TENDA");
var btn_vsol = document.getElementById("V-SOL");

btn_tplink3.addEventListener("click", () => {
  downloadLink(this.btn_tplink3.id);
});
btn_mercusys3.addEventListener("click", () => {
  downloadLink(this.btn_mercusys3.id);
});
btn_mercusys2.addEventListener("click", () => {
  downloadLink(this.btn_mercusys2.id);
});
btn_tplink2.addEventListener("click", () => {
  downloadLink(this.btn_tplink2.id);
});
btn_asus.addEventListener("click", () => {
  downloadLink(this.btn_asus.id);
});
btn_huawei.addEventListener("click", () => {
  downloadLink(this.btn_huawei.id);
});
btn_vsol.addEventListener("click", () => {
  downloadLink(this.btn_vsol.id);
});
btn_tenda.addEventListener("click", () => {
  downloadLink(this.btn_tenda.id);
});


function download(filename) {
  const link = "../docs/" + filename + ".pdf";
  window.open(link, "_blank");
}

function downloadLink(brand) {
  const link = "https://tlaxicom.com/docs/" + brand + ".pdf";
  console.log(link)
  window.open(link, "_blank");
}
