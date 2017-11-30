angular.module('starter.services', [])


    .service('MyService', function ($filter) {
        var property;
        var array;
        var item;
        var lat;
        var long;
        var arrayfarma;
        var arrayTurnos;
        var dia=-1;

        return {
            //Latitud
            getLat: function () {
                return lat;
            },
            //LOngitud
            getLon: function () {
                return long;
            },
            setLocation: function(value) {
                lat = value.coords.latitude;
                long = value.coords.longitude;
            },

            //valor de paso
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            },

            //Array de bares
            getArray: function () {
                return array;
            },
            setArray: function(value) {
                array = value;
            },

            //Array de Farmacias
            getArrayFarma: function () {
                return arrayfarma;
            },
            setArrayFarma: function(value) {
                arrayfarma = value;
            },

            //Array de Turnos
            getArrayTurnos: function () {
                return arrayTurnos;
            },
            setArrayTurnos: function(value) {
                arrayTurnos = value;
            },

            //Dato a pasar a detalles
            getItem: function () {
                return item;
            },
            setItem: function (value) {
                item=value;
            },

            //Define que dia es
            diaSemana: function(){  // Lav=1 Sab=2 Dom=3
                var today = $filter('date')(new Date(),'EEE');
                switch (today) {
                    case 'Mon':
                        dia=1;
                        break;
                    case 'Tue':
                       dia=1;
                       break;
                    case 'Wed':
                        dia=1;
                        break;
                    case 'Thu':
                        dia=1;
                        break;
                    case 'Fri':
                        dia=1;
                        break;
                    case 'Sat':
                        dia=2;
                        break;
                    case 'Sun':
                        dia=3;
                        break;
                    default: dia=0;

                }

            },
            //CHequea si está de turno
            estaDeTurno: function(id){
                var hora = $filter('date')(new Date(),'HH:mm');
                //Hasta las 23
                if (arrayTurnos.idFarma3==id && hora<"23:00" && hora>"09:00"){
                    return true;
                //24 horas
                }else if(arrayTurnos.idFarma1==id || arrayTurnos.idFarma2==id){
                    return true;

                }else return false;

               
                return false;

            },
            //Chequea si esta abierto en funcion de sus horarios
            estaAbierto: function(id){
                var hora = $filter('date')(new Date(),'HH:mm');
                var farma=arrayfarma.marcadores[id].horario;
                //Lunes a viernes
                if (dia==1){
                    if (farma.lv[0].start1<hora && farma.lv[1].end1>hora)
                        return true;
                    if (farma.lv[2].start2<hora && farma.lv[3].end2>hora)
                        return true;
                //Sabado
                }else if(dia==2){
                            if (farma.s[0].start1<hora && farma.s[1].end1>hora)
                                return true;
                            if (farma.s[2].start2<hora && farma.s[3].end2>hora)
                                return true;
                //Domingo
                }else
                    if (farma.d[0].start1<hora && farma.d[1].end1>hora)
                        return true;
                    if (farma.d[2].start2<hora && farma.d[3].end2>hora)
                        return true;

                

                
               
            }
        };
    })
    

        



    /*estaAbierto(abre:string, cierra:string, abre1: string, cierra1: string){
    //console.log("estaAbierto()")
    this.dateFormat.masks.hammerTime = 'HH:MM';
    let hoy =this.dateFormat(this.now, "HH:MM");
    //start=this.dateFormat(start,"HH:MM");
    hoy= hoy.toString();
    hoy= hoy.replace(":","");
    abre= abre.replace(":","");
    cierra= cierra.replace(":","");
    abre1= abre1.replace(":","");
    cierra1= cierra1.replace(":","");
    //console.log('today: '+hoy+' abre: '+ abre+ ' cierra: '+cierra);
    if((Number(hoy) > Number(abre) && Number(hoy) < Number(cierra))||(Number(hoy) > Number(abre1) && Number(hoy) < Number(cierra1))){//this.today>this.start && this.today<this.end
      
      return true;
    }else{
      return false;
    }
  }*/
   
