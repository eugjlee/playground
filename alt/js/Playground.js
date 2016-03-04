'use strict';

(function () {

function Playground() {


	this._textures = [];

	this._clock = new THREE.Clock();
	this._delta = 0;
	
	var scene = new THREE.Scene();
	this._scene = scene;


	// CAMERA
	var screen_width = window.innerWidth;
	var screen_height = window.innerHeight;
	var aspect = screen_width / screen_height;
	var view_angle = 60;
	var near = 0.1;
	var far = 1000;
	
	var camera = new THREE.PerspectiveCamera( view_angle, aspect, near, far );
	camera.position.set( 0, 2, -5 );
	this._camera = camera;

	this._world = new World( scene, camera );

	// RENDERER
    var renderer = new THREE.WebGLRenderer( { antialias: true } ); 

    renderer.setSize( screen_width, screen_height );
	// this._camera.updateProjectionMatrix();
	renderer.shadowMap.enabled = true;
	// var type = THREE.BasicShadowMap;
	var type = THREE.PCFShadowMap;
	// var type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.type = type;
	this._renderer = renderer;
	
	var container = document.createElement( 'div' );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );

	// var controls = new THREE.OrbitControls( camera, renderer.domElement );
	var controls = new THREE.OrbitControls( camera, container );
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.rotateSpeed = 0.3;
	// this._controls = controls;

	this._multiControls = new Multicontrols( scene, controls, camera, container );

	// add meshes where the PointerLock Controller can jump on
	this._multiControls.objects.push( this._world.fpsMeshes );
	// EVENTS
	var resize = THREEx.WindowResize( renderer, camera );

	
	var hud = new HUD();
	container.appendChild( hud.domElement );

	var printControlType = hud.print( "lala" );

	function callback() {
		var message = "";
		if( this._pointerLockControlsEnabled ) {
			message = "First Person Controls";
		} else {
			message = "Orbit Controls (press m)";
		}
		printControlType.update( message );

		resize = new THREEx.WindowResize( renderer, this._camera );

	}

	this._multiControls.setCallback( this._multiControls, callback );
	this._multiControls.onChanged();

	// var physicalObjectCount = this._world._physicFactory._bodyContainer;
	// var physicalObjectCount = [];

	// var counter = hud.debugMessage( physicalObjectCount, "length" );
	// counter.update();
	// gui.add( physicalObjectCount, "length").name( "Count" ).step(0).listen();

	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	
	this._stats = stats;

	var manager = new THREE.LoadingManager();

	manager.onLoad = function () {

		this._world.init();

		this.run();

	}.bind( this );

	manager.onProgress = function ( item, loaded, total ) {

		// console.log( item, loaded, total );

	};


	var gui = new dat.GUI();

	var parameters = { number: 100 };
	gui.add(parameters, "number").min(0).max(500); // Mix and match
	var obj = { add : function(){ 
							this._world.readyMade( parameters.number, this._world.level.spawnObject ); 
							// counter.update();
						}.bind(this) 
					};	

	var obj2 = { add : function(){ 
							this._world.disposeLevel(); 
						}.bind(this) 
					};

	var obj3 = { add : function(){ 
							this._world.disposeLevel(); 
							this._world.loadLevel( DesertCamp, manager ); 
						}.bind(this) 
					};	

	var obj4 = { add : function(){ 
							this._world.disposeLevel(); 
							this._world.loadLevel( NightCamp, manager ); 
						}.bind(this) 
					};

	var obj5 = { add : function(){ 
							this._world.disposeLevel(); 
							this._world.loadLevel( Testbed, manager ); 
						}.bind(this) 
					};

	gui.add( obj, 'add').name( "Spawn Objects!" );
	// gui.add( obj2, 'add').name( "Dispose!" );
	gui.add( obj3, 'add').name( "DesertCamp!" );
	gui.add( obj4, 'add').name( "NightCamp!" );
	gui.add( obj5, 'add').name( "Testbed!" );

	this.preload( manager );
	
}

Playground.prototype.update = function() {

	// only do this once!
	this._delta = this._clock.getDelta();

	this._world.update( this._delta );
	this._multiControls.update( this._delta );
	this._stats.update();
	// this._hud.update();

	// you shouldnt access private variables
	this._renderer.render( this._scene, this._multiControls._camera );

};

function update() {

	playground.update();
    requestAnimationFrame( update );
}

Playground.prototype.run = function() {

	console.log("Running Playground");

	// Hide loading screen
	$('.loading-container').fadeOut();

	update();

};

Playground.prototype.init = function() {


};

Playground.prototype.preload = function( manager ) {

	// textures, sounds, object models
	// create Materials?

	console.log("Start Playground Preloading");

	this._world.preload( manager );

	// instantiate a loader
	// this._textures.T_multiControls._camerarectwhite_d = loader.load( 'assets/textures/07.jpg' );

	// this._world.preload();

};

function Player() {
	
}

function ParticleManager() {

}

function AudioManager() {

}


	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var playground = new Playground();
	
})();
