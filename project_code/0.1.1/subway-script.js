$(document).ready(function() {
  console.log("ready!");
  init();
  animate();
    // initAudio();
    // document.addEventListener( 'onkeypress', updateAudio(), false);
  });

/////////////////
/////GRAPHICS////
/////////////////

var camera, scene, renderer;
var background, poles, polesB;
var controls, time = Date.now();
var mouseX = 0, mouseY = 0,
windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2;

function init () {
	$('body').append('<div id="container"></div>');
	$('#container').append('<div id="info"></div>');
	$('#info').addClass('info');
	$('#info').html("Subway Stories: <br> An Interactive Storytelling Platform");
  passengers_loaded = false;
  poles_loaded = false;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  $('#container').append(renderer.domElement);

  addImagery();
}

function addImagery () {
	  // camera 
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000); 
    // camera.position.y = -250; 
    camera.position.z = 1500; 

    // scene 
    scene = new THREE.Scene();

    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
      map:THREE.ImageUtils.loadTexture('img/full_subway_20_windows.png')
    });
    img.map.needsUpdate = true; //ADDED
    img.transparent = true;

    // plane
    var subwayMesh = new THREE.Mesh(new THREE.PlaneGeometry(2700, 397),img);
    // plane.overdraw = true;
    scene.add(subwayMesh);

    for (var i = 1; i < 25; i++){
      passengers(i);
      if(i%4 === 0){
        img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
          map:THREE.ImageUtils.loadTexture('img/pole.png')
        });
        img.map.needsUpdate = true; //ADDED
        img.transparent = true;
        var pole = new THREE.Mesh(new THREE.PlaneGeometry(12, 200), img);
        scene.add(pole);
        pole.position.set(i*90 - 1400, 0, -40);
      }
    }

    poles = [];
    for (var i = 0; i < 8; i++){
      poles[i] = new Pole(i*750-1000, 160, 150, 700, 0x333333);
    }

    polesB = [];
    for (var i = 0; i < 8; i++){
      polesB[i] = new Pole(i*750-1500, 160, -100, 750, 0x121212);
    }    

    background = [];
    for(var i = 0; i < 8; i++){
      background[i] = new Background(i);
    }

    // LIGHTS
    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // create wrapper object that contains three.js objects
    var three = {
      renderer: renderer,
      camera: camera,
      scene: scene,
      subway_car: subwayMesh
    };

    window.addEventListener( 'resize', onWindowResize, false );
  }

  function passengers(num) {
    var img = new THREE.MeshBasicMaterial({
      map:THREE.ImageUtils.loadTexture('img/subway_'+num+'.png')
    })
    img.map.needsUpdate = true; //ADDED
    img.transparent = true;

    var passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
    passengerMesh.position.z = -50;
    passengerMesh.position.x = num*110 - 1400;
    scene.add(passengerMesh);
  }

  function Background(num){
    var img = new THREE.MeshBasicMaterial({
      map:THREE.ImageUtils.loadTexture('img/subway_tile_wall.jpg')
    })
    img.map.needsUpdate = true;
    var geometry = new THREE.PlaneGeometry(1200, 695);
    this.tile = new THREE.Mesh( geometry, img);
    scene.add(this.tile);
    this.tile.position.set(num*1200, 185, -100); 
  }

  Background.prototype.setPos = function(timer, speed){
    var delta = .8*(Date.now() - timer);
    this.tile.position.x -= delta;
    if(this.tile.position.x <= -14400) this.tile.position.x += 28800;
  }

  function Pole(x,y,z,h,c) {
    var geometry = new THREE.CubeGeometry( 120, h, 50 );
    var material = new THREE.MeshBasicMaterial( {color: c} );
    this.cube = new THREE.Mesh( geometry, material );
    scene.add(this.cube);
    this.cube.position.set(x, y, z);
  }

  Pole.prototype.setPos = function(timer, speed) {
    var delta = (Date.now() - timer);
    this.cube.position.x -= delta*speed;
    if(this.cube.position.x <= -3000) this.cube.position.x = 3000;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function render () {
    controls.update();

    for(var i = 0; i < poles.length; i++){ 
      poles[i].setPos(time, 1.5);
      polesB[i].setPos(time, 1.2);
      // polesC[i].setPos(time);
    }

    for(var i = 0; i < background.length; i++){
      background[i].setPos(time);
    }

    renderer.render(scene,camera);
    time = Date.now();
  }

  function animate () {
   requestAnimationFrame( animate );
   render();
 }

/////////////////
///// AUDIO /////
/////////////////

var context = null;
var gainNode = [];

function initAudio() {
  console.log('init');
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
    'sounds/subway_sound.mp3',
    'sounds/fried_chicken_final.mp3',
    'sounds/david_news.mp3',
    'sounds/sotired.mp3',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading (bufferList) {
  console.log('finishedLoading');
  var sources = [];

  for(var i = 0; i < 4; i++){
    sources[i] = context.createBufferSource();
    sources[i].buffer = bufferList[i];
    sources[i].start(0);
    sources[i].loop = true;
    gainNode[i] = context.createGain();        
    sources[i].connect(gainNode[i]);
    gainNode[i].connect(context.destination);
  };
}

function updateAudio() {
    // var subwayGain = Math.max((200 + camera.position.z) / 2200, .2);
    // gainNode[0].gain.value = subwayGain;
    // gainNode[1].gain.value = 1 - subwayGain; 

    var pos = ( ( camera.position.x + 1000 ) / 2000 ) * 4;
    for(var i = 0; i < 4; i++){
      if(i - pos >= 0 && i - pos < 1){
        var x = i - pos;
        if (i>0){gainNode[i-1].gain.value = (1 - x);}
        gainNode[i].gain.value = x;
        gainNode[i+1].gain.value = (1-x);
      }
    }
  }


// BUFFER LOADER CLASS
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
      );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}