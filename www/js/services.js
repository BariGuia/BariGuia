angular.module('starter.services', [])


    .service('MyService', function ($filter) {
        var property;
        var array;
        var item;
        var lat;
        var long;
        var arrayfarma;
        var dia=-1;

        return {
            getLat: function () {
                return lat;
            },
            getLon: function () {
                return long;
            },
            setLocation: function(value) {
                lat = value.coords.latitude;
                long = value.coords.longitude;
            },
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            },
            getArray: function () {
                return array;
            },
            setArray: function(value) {
                array = value;
            },
            getArrayFarma: function () {
                return arrayfarma;
            },
            setArrayFarma: function(value) {
                arrayfarma = value;
            },
            getItem: function () {
                return item;
            },
            setItem: function (value) {
                item=value;
            },
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
            estaDeTurno: function(){

            },
            estaAbierto: function(id){
                var hora = $filter('date')(new Date(),'HH:mm');
                var farma=arrayfarma.marcadores[id].horario;
                if (dia==1){
                    if (farma.lv[0].start1<hora && farma.lv[1].end1>hora)
                        return true;
                    if (farma.lv[2].start2<hora && farma.lv[3].end2>hora)
                        return true;
                }else if(dia==2){
                            if (farma.s[0].start1<hora && farma.s[1].end1>hora)
                                return true;
                            if (farma.s[2].start2<hora && farma.s[3].end2>hora)
                                return true;
                }else
                    if (farma.d[0].start1<hora && farma.d[1].end1>hora)
                        return true;
                    if (farma.d[2].start2<hora && farma.d[3].end2>hora)
                        return true;

                

                return false;
               
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
   
