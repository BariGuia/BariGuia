
angular.module('starter.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller:'HomeCtrl'
  })
    
  .state('app', {
    cache: false,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'MenuCtrl'
    })

  .state('app.menu', {
    cache: false,
    url: '/menu',
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'
    })
    .state('app.info', {
    cache: false,
    url: '/info',
    templateUrl: 'templates/info.html',
    })
  .state('app.listaCerve', {
    cache: false,
    url: '/listaCerve',
    templateUrl: 'templates/listaCerve.html',
    controller: 'Lista'
    })
  .state('app.listaBar', {
    cache: false,
    url: '/listaBar',    
    templateUrl: 'templates/listaBar.html',
    controller: 'Lista'     
    })
  .state('app.listaPubs', {
    cache: false,
    url: '/listaPubs',
    templateUrl: 'templates/listaPubs.html',
    controller: 'Lista'     
    })
  .state('app.detalles', {
    cache: false,
    url: '/detalles',
    templateUrl: 'templates/detalles.html',
    controller: 'Detalles'
    })
  .state('app.mapa', {
    cache:false,
    url: '/mapa',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
    })
  .state('app.listaFarma', {
    cache: false,
    url: '/listaFarma',    
    templateUrl: 'templates/listaFarma.html',
    controller: 'ListaFarma'     
    })
  .state('app.grandmenu', {
    cache: false,
    url: '/grandmenu',    
    templateUrl: 'templates/grandmenu.html'    
    })
   .state('app.farma', {
    cache: false,
    url: '/menufarma',
    templateUrl: 'templates/menufarma.html',
    controller: 'MenuCtrl'
    })
   .state('app.detallesFarma', {
    cache: false,
    url: '/detallesFarma',
    templateUrl: 'templates/detallesFarma.html',
    controller: 'DetallesFarma'
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
});