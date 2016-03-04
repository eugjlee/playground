'use strict';

function World( scene, camera ) {

	this._scene = scene;

	this.steps = 1;
	this.slowmo = false;
	this.maxSecPerFrame = 1.0 / 60; // allowed timespan to update physics

	this._physicFactory = new PhysicFactory();

	// this.weaponFactory = new WeaponFactory();

	var geometry = new THREE.SphereBufferGeometry( 0.3, 16, 16 );
	// var geometry = new THREE.CylinderGeometry( 1, 1, 2, 32 );
	
	// var geometry = new THREE.PlaneBufferGeometry( 5, 5 );
	// var rotation = new THREE.Matrix4().makeRotationX( -Math.PI/2 );
	// geometry.applyMatrix(rotation);
	
	var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side:THREE.DoubleSide } ) );
	mesh.castShadow = true;
	mesh.position.set( 0, 2, -1 );
	// scene.add( mesh );
	
	// var body = this._physicFactory.mesh2ammo( mesh, 0 );

	// multicontrol PointerLockControls accesses this array
	// to check for grounded
	this.fpsMeshes = [];

	this.sceneObjects;

	// var level = Testbed;
	// var level = DesertCamp;
	// this.level = this.loadLevel( level, scene, manager );
	
}

World.prototype.update = function( dt ) {

	this._physicFactory.update( dt );
	this.level.update( dt );

};

World.prototype.loadLevel = function( level, manager ) {

	console.log("loading Level", level);

	var level = new level( this._scene );
	level.physicFactory = this._physicFactory;
	level.fpsMeshes = this.fpsMeshes;
	level.preload( manager );
	// this.level.init();
	this.level = level;
	return level;

};


World.prototype.init = function() {

	console.log("Initialising the World");

	var scene = this._scene;
	this.sceneObjects = new THREE.Object3D();
	scene.add( this.sceneObjects );
/*
	var weapons = this.weaponFactory.init( scene, this._physicFactory );
	// console.log("weapons", weapons );
	for( var i = 0; i < weapons.length; i++ ) {

		// this.boxes.push( weapons[ i ] );
		scene.add( weapons[ i ].mesh );
		
	}
*/	

	this.level.init();

};

World.prototype.disposeLevel = function() {

	this._scene.remove( this.sceneObjects );
	this._physicFactory.dispose();
	this.level.dispose();

};


World.prototype.preload = function ( manager ) {

	// var level = Testbed;
	// var level = DesertCamp;
	var level = NightCamp;
	this.loadLevel( level, manager );

	// this.level.preload();

	// var loader = new THREE.TextureLoader( manager );

	// var url = 'assets/images/webtreats-grunge-3.jpg';
	// this.T_dirt_d = loader.load( url );

	// var pattern = "pattern_216";

	// var url = 'assets/images/'+pattern+'/diffuse.jpg';
	// this.T_pattern_224_d = loader.load( url );
	// var url = 'assets/images/'+pattern+'/normal.jpg';
	// this.T_pattern_224_n = loader.load( url );
	// var url = 'assets/images/'+pattern+'/specular.jpg';
	// this.T_pattern_224_s = loader.load( url );

	// this.weaponFactory.preload( manager );

};

World.prototype.readyMade = function( count, mesh ) {
	
	// var objects = [];

	// var mesh = this.legoMan;

	var helper = new THREE.BoundingBoxHelper( mesh, 0xff0000 );	
	helper.update();
	var boundingBoxSize = helper.box.max.sub( helper.box.min );

	for( var i = 0; i < count; i++ ) {

		var clone = mesh.clone();
		clone.position.set( 0, ( i*boundingBoxSize.y ) + 1, 0 );
		// this._scene.add( clone );
		
		// var body = this._physicFactory.mesh2ammo( clone, "Cylinder" );
		var body = this._physicFactory.mesh2ammo( clone );
		this.sceneObjects.add( body.mesh );
		
		// objects.push( body );
		
	}
	
	// return objects;

};


World.prototype.setCallback = function ( scope, callbackFunction )
{

	this.scope = scope;
	this.callbackFunction = callbackFunction;

};

World.prototype.onReady = function () 
{

	if( this.scope != null )
	{
		console.log("on ready called");
		this.setCallback.call( this.scope );
	}

};