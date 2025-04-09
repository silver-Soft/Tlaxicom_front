var btn_tplink = document.getElementById("TL_WR845N");
var btn_mercusys = document.getElementById("MW305R");

btn_tplink.addEventListener("click",()=>{    
             download(this.btn_tplink.id);
  });  
  btn_mercusys.addEventListener("click",()=>{    
    download(this.btn_mercusys.id);
});  

  function download(filename) {
      const link="../docs/"+filename+".pdf"
    window.open(link,"_blank");
  }