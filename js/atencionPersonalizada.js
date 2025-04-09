function obtenerdatos()
        {
            var nombre_cliente = document.getElementById('nombre_cliente').value;
            var numero_equipo= Number(document.getElementById('numero_equipo').value);
            var email_cliente= document.getElementById('email_cliente').value;
            var mensaje_cliente = document.getElementById('mensaje_cliente').value; 
            var enlace;
            if(nombre_cliente==""||email_cliente==""||mensaje_cliente==""){
                alert("Por favor llene todos los campos");
            }
            else if(numero_equipo==""||!Number.isInteger(numero_equipo)){
                alert("Por favor ingrese un número de equipo valido, P/ej si su equipo es TLAXICOM50 el numero de equipo es 50");
            }else{  
                const nombreregex = nombre_cliente.replaceAll(/ /g, "%20");
                //const numero_equiporegex=numero_equipo.replaceAll(/ /g, "%20"); 
                const email_clienteregex=email_cliente.replaceAll(/ /g, "%20")   
                const mensaje_clienteregex=mensaje_cliente.replaceAll(/ /g, "%20")      
                enlace="https://wa.me/+522411195233?text=Hola%20soy%20"+nombreregex+
                "%20con%20el%20numero%20de%20equipo%20"+numero_equipo+
                "%20y%20tengo%20el%20siguiente%20problema:%20"+mensaje_clienteregex
                /*console.log("tag: "+nombreregex+" "+numero_equipo+" "+email_clienteregex+" "+mensaje_clienteregex+"\n"+
                enlace);*/
                window.open(enlace,"_blank");
            }
        }

