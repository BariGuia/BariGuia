
angular.module('starter.controllers', [])


.controller('HomeCtrl', function($scope) {

  $scope.options = {
    autoplay: 6000,
    initialSlide: 0,
    loop: true,
    speed: 300,
  }
})





.controller('MenuCtrl', function($scope,MyService,$http,$cordovaGeolocation,$filter) {

  $scope.myFunc = function(e) {
        MyService.setProperty(e);
     
    };
    $cordovaGeolocation.getCurrentPosition()
    .then(function(position) {
      MyService.setLocation(position);
    })
    .catch(function() {
      console.log("Error de ubicacion")
      alert("Por favor enciende el GPS")

    })
    //Carga bares
    if(MyService.setArray()==null){
    $http.get('js/markers.json').then(function(response){
    MyService.setArray(response.data);
            })}
    //Carga farmacias
    if(MyService.setArrayFarma()==null){
    $http.get('js/farmacias.json').then(function(response){
    MyService.setArrayFarma(response.data);
            })}
    //Carga turno correspondiente
    if(MyService.setArrayTurnos()==null){
        hoy=new Date();
        ayer=new Date();
        ayer.setDate(ayer.getDate()-1);
        ayer=$filter('date')(ayer,'dd-MM');
      $http.get('js/turnos.json').then(function(response){
        //ANtes de las 9 -> ayer
        if ($filter('date')(hoy,'H:ss')<"09:00")
          day=ayer;
        else
          //del dia
          day=$filter('date')(hoy,'dd-MM');

        angular.forEach(response.data, function(value, key){
          if (value.dia==day){
              MyService.setArrayTurnos(value);}
        })
    
            })}
      //Quedia es hoy?
    MyService.diaSemana();
  })  

.controller('MapCtrl', function($scope,$cordovaGeolocation, $http, $filter, MyService) {

  var lat=MyService.getLat();
  var lon=MyService.getLon();
  $scope.opcion=(MyService.getProperty());
  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      	var marker = new google.maps.Marker({
        map: $scope.map,
        position: latLng
      });  

    })
  //defino estilo de mapa para borrar negocios
  var myStyle = [{
    stylers: [
      { hue: "#00ffe6" },
      { saturation: -20 }
    ]},  
    {
      featureType: "poi.business", 
      elementType: "labels", 
      stylers: [{ visibility: "off"}]
    }
  ];

  var styledMap = new google.maps.StyledMapType(myStyle, {name: "Styled Map"});
  
  //GPS aveces incorrecto
  /*var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);*/
  latLngCentro = new google.maps.LatLng(-41.135893,  -71.310535);
 
  var mapOptions = {
    mapTypeControlOptions: {
      mapTypeIds: ['myStyle']}, 
      center: latLngCentro,
      zoom: 16,
      mapTipeId: 'myStyle'
  };
  
  //Creo mapa
  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Le asigno el estilo de mapa personalizado
    $scope.map.mapTypes.set('map_style', styledMap);
    $scope.map.setMapTypeId('map_style');



    //valor inicial para variable de infowindow
    var prev_infowindow =false; 
    
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      //Espera hasta que el mapa haya cargado
      var today = $filter('date')(new Date(),'HH:mm:ss');
      //Marcadores
      console.log($scope.opcion);
      if($scope.opcion>3){
                                              //farmacias
                                              $scope.data=MyService.getArrayFarma();
                                              angular.forEach($scope.data.marcadores, function(value, key){
                                              var icono="img/farmacia_rojo.png";
                                              
                                              //Verifica si esta entre el horario y cambia el icono
                                              


                                              if (MyService.estaAbierto(value.id)|| $scope.opcion==6||MyService.estaDeTurno(value.id)){
                                                //ESta abierto?
                                                if (MyService.estaAbierto(value.id)){
                                                  icono="img/farmacia_verde.png";
                                                }
                                                //Esta de turno?
                                                if (MyService.estaDeTurno(value.id)){
                                                  icono="img/farmacia_azul.png";
                                                }
                                                
                                                //Setea marcador

                                                marker = new google.maps.Marker({
                                                  map: $scope.map,
                                                  title: value.name,
                                                  icon: icono,
                                                  position: {lat: value.lat,lng: value.lng}
                                                });
                                                
                                               
                                                //Descripcion para cada marcador en su infoWindows
                                                var infoWindow = new google.maps.InfoWindow({
                                                  content:  '<div id="farmacia"> <b><u>'
                                                  +value.nombre+'</b></u> <br>Abierto de lunes a viernes<br> De '
                                                  +value.horario.lv[0].start1+' a '+value.horario.lv[1].end1+
                                                  '<br> y de '+value.horario.lv[2].start2+' a '+value.horario.lv[3].end2+
                                                  '<br><a class="button button-clear button-dark" href="#/app/detallesFarma"'
                                                  +'ng-click="detalle()"><b>Ver Mas</b></a></div>'
                                                });

                                                //Accion del click sobre cada marcador - Abrir/cerrar infoWindows
                                                google.maps.event.addListener(marker, 'click', function(idmarker,key){

                                                  if( prev_infowindow ) {
                                                    prev_infowindow.close();
                                                  }
                                                
                                                  //Guarda el valor del marcador clickeado para luego pasar este valor a detalle()
                                                  MyService.setItem(value.id);

                                                  prev_infowindow = infoWindow;
                                                  infoWindow.open($scope.map, this);       
                                                });
                                              }
                                            })
                                            }
                                            

      else {
        //bares
          $scope.data=MyService.getArray();
          angular.forEach($scope.data.marcadores, function(value, key){
        //Verifica si esta entre el horario y cambia el icono
        if ($scope.opcion==value.tipo|| $scope.opcion==0 || $scope.opcion==6){
          if (today>value.start && today<value.end){
            var animation=google.maps.Animation.BOUNCE
          }
          //Setea marcador

          marker = new google.maps.Marker({
            map: $scope.map,
            animation: animation,
            title: value.name,
            //icon: "../img/farma.png",
            icon: {url:value.iconMarKer},
            position: {lat: value.lat,lng: value.lng}
          });
          
         
          //Descripcion para cada marcador en su infoWindows
          var infoWindow = new google.maps.InfoWindow({
            content:  '<div id="bar"> <b><u>'
            +value.name+'</b></u><br>'+ value.horario+'<br>Happy de '+value.start+' a '+value.end+
            '<br><a class="button button-clear button-dark" href="#/app/detalles"'
            +'ng-click="detalle()"><b>Ver Mas</b></a></div>'
          })

          //Accion del click sobre cada marcador - Abrir/cerrar infoWindows
          google.maps.event.addListener(marker, 'click', function(idmarker,key){

            if( prev_infowindow ) {
              prev_infowindow.close();
            }
          
            //Guarda el valor del marcador clickeado para luego pasar este valor a detalle()
            MyService.setItem(value.id);

            prev_infowindow = infoWindow;
            infoWindow.open($scope.map, this);       
          });
        }
      })
        }

      
      //Loop json
      
      

      
      function CenterControl(controlDiv, map) {

              // Set CSS for the control border.
              var controlUI = document.createElement('div');
              controlUI.style.backgroundColor='#fff';
              controlUI.style.border = '2px solid #fff';
              controlUI.style.borderRadius = '3px';
              controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
              controlUI.style.marginBottom = '22px';
              controlUI.style.marginRight = '8px';
              controlUI.style.textAlign = 'center';
              controlDiv.appendChild(controlUI);

              // Set CSS for the control interior.
              var controlText = document.createElement('div');
              controlText.style.color = 'rgb(25,25,25)';
              controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
              controlText.style.fontSize = '12px';
              controlText.style.lineHeight = '38px';
              controlText.style.paddingLeft = '5px';
              controlText.style.paddingRight = '5px';
              controlText.innerHTML = '<b>GPS</b>';
              controlUI.appendChild(controlText);

              // Setup the click event listeners: go to your location.
              controlUI.addEventListener('click', function() {
                if (lat)
                map.setCenter(new google.maps.LatLng(lat, lon));
              });

            }
              // Create the DIV to hold the control and call the CenterControl() constructor
              // passing in this DIV.
              var centerControlDiv = document.createElement('div');
              var centerControl = new CenterControl(centerControlDiv, $scope.map);
              centerControlDiv.index = 1;
              $scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
    })
})


.controller('Lista',function($scope, MyService,$filter) {
  $scope.data=MyService.getArray();
  var today = $filter('date')(new Date(),'HH:mm');



  $scope.detalle = function(e) {
    MyService.setItem(e);
    }

   $scope.bounce = function(id) { 
        var item=$scope.data.marcadores[id];
       
          //Verifica si esta entre el horario y cambia el icono
            if (today>item.start && today<item.end){
              return true;}
            else{
              return false;}
      }
})



.controller('ListaFarma',function($scope, MyService,$filter) {
  $scope.data=MyService.getArrayFarma();
  var today = $filter('date')(new Date(),'HH:mm');


  console.log($scope.data);
  $scope.detalle = function(e) {
  MyService.setItem(e);
    }

   $scope.bounce = function(id) { 
        var item=$scope.data.marcadores[id];
       
          //Verifica si esta entre el horario y cambia el icono
            if (MyService.estaAbierto(id)){
              return true;}
            else if (MyService.estaDeTurno(id))
              return true;
              else return false;
      }
})




.controller('Detalles',function($scope, MyService,$ionicHistory) {
$scope.data=MyService.getArray();
$scope.id=MyService.getItem();
$scope.item=$scope.data.marcadores[$scope.id];

      //creo un mini mapa con el marcador en el item.
      var myCenter = new google.maps.LatLng($scope.item.lat,$scope.item.lng);
      
      var mapProp = {
          center: myCenter,
          zoom: 15,
          draggable: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
      };
      $scope.mapa = new google.maps.Map(document.getElementById("mapa"),mapProp);
      marker = new google.maps.Marker({
          position: myCenter,
      });
      marker.setMap($scope.mapa);
      var html;
        angular.forEach($scope.item.image, function(value, key){
         html +=' <div class="mySlides fade set"><img src='+
         value.imagen+' ></div>';
        });
      document.getElementById('contenido').innerHTML=html;
      var slideIndex = 0;
      showSlides();
      //Controlador de la galeria de imagenes.
      function showSlides() {
          var i;
          var slides = document.getElementsByClassName("mySlides");
          for (i = 0; i < slides.length; i++) {
             slides[i].style.display = "none";
          }
          slideIndex++;
          if (slideIndex> slides.length) {slideIndex = 1}
          slides[slideIndex-1].style.display = "block";
          setTimeout(showSlides, 3000); // Change image every 2 seconds
      }
})


.controller('DetallesFarma',function($scope, MyService,$ionicHistory) {
$scope.data=MyService.getArrayFarma();
$scope.id=MyService.getItem();
$scope.item=$scope.data.marcadores[$scope.id];

      //creo un mini mapa con el marcador en el item.
      var myCenter = new google.maps.LatLng($scope.item.lat,$scope.item.lng);
      
      var mapProp = {
          center: myCenter,
          zoom: 15,
          draggable: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
      };
      $scope.mapa = new google.maps.Map(document.getElementById("mapa"),mapProp);
      marker = new google.maps.Marker({
          position: myCenter,
      });
      marker.setMap($scope.mapa);
});



