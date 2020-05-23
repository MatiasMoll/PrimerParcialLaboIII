var http = new XMLHttpRequest();
var spinner;
var contenedor;

window.onload = function(){     
    this.spinner = document.getElementById("spinner");   
    this.contenedor = this.document.getElementById("contenedor");  
    http.onreadystatechange = function(){                       
        if(http.readyState ==  4 && http.status == 200){
            MostrarGrilla(JSON.parse(http.responseText));            
        }
    }
    http.open("GET","http://localhost:3000/materias",true);
    http.send();

}

function MostrarGrilla(jsonObj){
    var tabla = document.getElementById("cuerpo");
    
    for(var i = 0;i<jsonObj.length;i++){
        
        var tr = document.createElement("tr");
        tr.setAttribute("Id",jsonObj[i].id);

        var tdId = document.createElement("td");
        var tdNombre = document.createElement("td");
        var tdCuatri = document.createElement("td");
        var tdFecha = document.createElement("td");
        var tdTurno = document.createElement("td");

        tdId.appendChild(document.createTextNode(jsonObj[i].id));
        tr.appendChild(tdId);
        tdNombre.appendChild(document.createTextNode(jsonObj[i].nombre));
        tr.appendChild(tdNombre);        
        tdCuatri.appendChild(document.createTextNode(jsonObj[i].cuatrimestre));
        tr.appendChild(tdCuatri);        
        tdFecha.appendChild(document.createTextNode(jsonObj[i].fechaFinal));
        tr.appendChild(tdFecha);        
        tdTurno.appendChild(document.createTextNode(jsonObj[i].turno));
        tr.appendChild(tdTurno); 
        tr.addEventListener("dblclick", ContenedorAgregar);

        tabla.appendChild(tr);
                
            
    }
}

function ContenedorAgregar(e){
    contenedor.hidden=false;
    var fecha = (e.target.parentNode.childNodes[3].textContent).split('/');
    var deseadaInput = fecha[2]+'-'+fecha[1]+'-'+fecha[0];
    
    document.getElementById("txtNombre").value= e.target.parentNode.childNodes[1].textContent;
    document.getElementById("slcCuatri").value= e.target.parentNode.childNodes[2].textContent;
    document.getElementById("dateFinal").value = deseadaInput;
    if(e.target.parentNode.childNodes[4].textContent == 'Mañana'){
        document.getElementById("Mañana").checked = true;
        
    }else{
        document.getElementById("Noche").checked = true;
    }

    var btnCerrrar = document.getElementById("btnCerrar");
    btnCerrrar.onclick = function(){
        contenedor.hidden = true;
    }

    var btnModificar = document.getElementById("btnModificar");
    btnModificar.onclick = function(){
        ModificarObjeto(e.target.parentNode.childNodes[0].textContent,e.target.parentNode.childNodes[2].textContent);
    }

    var btnEliminar = document.getElementById("btnEliminar");
    btnEliminar.onclick = function(){
        Eliminar(e.target.parentNode.childNodes[0].textContent);
    }
}


function ModificarObjeto(Id,cuatrimestre){
    var fecha = document.getElementById("dateFinal");
    var fechaArray = fecha.value.split('-');
    var deseada = fechaArray[2]+'/'+fechaArray[1]+'/'+fechaArray[0];
    var fechaIngresadaDate = new Date(fechaArray[0],fechaArray[1],fechaArray[2]);
    var fechaHoyDate = new Date();
   

    var flag = false;
    var materia = document.getElementById("txtNombre");
    var mañana = document.getElementById("Mañana");
    var noche = document.getElementById("Noche");
    var turno;
    if(materia.value.length > 6 ){
        if(fechaIngresadaDate > fechaHoyDate){
            if(mañana.checked || noche.checked){
                fecha.className = '';
                materia.className = '';
                if(noche.checked){
                    turno = "Noche"    
                }else{
                    turno = "Mañana"
                }
                flag = true;
            }           
        }else{
            fecha.className += "error";
        }   
    }else{
        materia.className += "error";
    }
    if(flag){              
        var jsonObj = {
            "id":Id,
            "nombre":materia.value,
            "cuatrimestre":cuatrimestre.value,
            "fechaFinal": deseada,
            "turno":turno
        };
        http.onreadystatechange = function(){   
            document.getElementById("spinner").hidden = false;     
            if(http.readyState ==  4){
                
                if(http.statusText == 'OK'){
                    var fila = document.getElementById(Id).childNodes;                                
                    fila[1].textContent = materia.value;
                    fila[3].textContent = deseada;
                    fila[4].textContent = turno;
                    
                }    
                document.getElementById("spinner").hidden = true;                    
            }
           

        }
        http.open("POST","http://localhost:3000/editar",true);
        http.setRequestHeader("Content-Type","application/json");
        http.send(JSON.stringify(jsonObj));
    }else{
        document.getElementById("spinner").hidden = true;

    }
    
}

function Eliminar(Id){
        var jsonEliminar = {
        "id":Id
    };
    http.onreadystatechange = function(){    
        document.getElementById("spinner").hidden = false;     
        if(http.readyState ==  4){

            if(http.statusText == 'OK'){
                var fila = document.getElementById(Id);
                document.getElementById("cuerpo").removeChild(fila); 
            }   
            document.getElementById("spinner").hidden = true;                     
        }
        
    }

    http.open("POST","http://localhost:3000/eliminar",true);
    http.setRequestHeader("Content-Type","application/json");
    http.send(JSON.stringify(jsonEliminar));

}


