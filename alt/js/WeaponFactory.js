'use strict';

function WeaponFactory() {

}

WeaponFactory.prototype.preload = function( manager ) {

	// console.log("weaponFactory preloading");

	var camera = { aspect : 1.5 };

    // textures
	var textureLoader = new THREE.TextureLoader( manager );
	// var textureLoader = new THREE.ImageLoader( manager );

	var T_portalgun_d = textureLoader.load( 'assets/models/portalgun/portalgun_col.jpg' );
	var T_portalgun_n = textureLoader.load( 'assets/models/portalgun/portalgun_nor.jpg' );
	var T_shotgun_d = textureLoader.load( 'assets/models/shotgun_l4d/twd_shotgun.png' );
	var T_sniper_d = textureLoader.load( 'assets/models/scoped_rifle/twd_riflescoped.png' );	
	var T_flashlight_d = textureLoader.load( 'assets/models/Flashlight/flashlight_d.png' );	
	// var T_jukebox_d = textureLoader.load( 'assets/models/jukebox/jukebox_body_d.png' );

    // this contains the loaded meshes
    var weaponModels = {};
    this.weaponModels = weaponModels;

	// console.time( 'OBJLoader' );
	var onProgress = function ( xhr ) {
		/*		
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
		*/
	};

	var onError = function ( xhr ) {
		console.error( "Error while loading: ", xhr )
	};

	// models
	var loader = new THREE.OBJLoader( manager );

	// PORTALGUN
	loader.load( 'assets/models/portalgun/portalgun.obj', function ( object ) {
		var normalMaterial = new THREE.MeshPhongMaterial( { 
			map: T_portalgun_d,
			normalMap: T_portalgun_n,
			// color: 0xFFAA00, 
			color: 0xFFFFFF,
			specular: 0xAAAAAA, 
			shininess: 40,
			// shading: THREE.FlatShading,
			shading: THREE.SmoothShading,
		} );
		normalMaterial.map.anisotropy = 8; //front barrel of the weapon gets blurry

		var object = object.children[0];
		object.geometry.center();
		
		object.material = normalMaterial;
		// object.scale.set( 0.3, 0.3, 0.3 );
		// object.scale.set( 0.5, 0.5, 0.5 );
		object.receiveShadow = true;
		object.castShadow = true;
		
		// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs
		// object.renderOrder = 0;

		// no normals in the obj fix: 
		// http://stackoverflow.com/questions/11032145/three-js-custom-objloader-geometry-lighting
		// http://mathieujouhet.com/tsf/webgl/objLoader.html

		object.geometry.computeFaceNormals();
		object.geometry.computeVertexNormals();

		// object.position.set( 40,-15,-10 );
		// object.rotation.y = -35 * Math.PI / 180;
		var rotation = new THREE.Matrix4().makeRotationY( -35 * Math.PI / 180 );
		object.geometry.applyMatrix(rotation);

		// object.rotation.x = -2 * Math.PI / 180;
		// object.rotation.x = Math.PI / 0.496; // + positiv = weiter nach unten
		
		var pyramidPercentX = 56;
		var pyramidPercentY = 40;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		// object.position.x = pyramidPositionX * camera.aspect;
		// object.position.y = pyramidPositionY;
		// object.position.z = -0.8;
				
		var pyramidPercentX = 58;
		var pyramidPercentY = 35;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		// tempVec = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.35 );
		
		object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.35 );
		
		weaponModels.portalgun = object;

	}, onProgress, onError );
	
	// SHOTGUN
	loader.load( 'assets/models/shotgun_l4d/shotgun.obj', function ( object ) {

		object = object.children[0];
		// console.log( object );

		var newMaterial = new THREE.MeshPhongMaterial( { 
			map: T_shotgun_d,
			color: 0xFFFFFF
		} );
		object.geometry.center();
		object.material = newMaterial;
		// object.material.map = texture;
		// object.material.map.anisotropy = 8; //front barrel of the weapon gets blurry

		// object.scale.set( 0.55,0.55,0.55 ); 
		object.receiveShadow = true;
		object.castShadow = true;

		var rotation = new THREE.Matrix4().makeRotationY( -90 * Math.PI / 180 );
		object.geometry.applyMatrix(rotation);

		var rotation = new THREE.Matrix4().makeRotationX( -2 * Math.PI / 180 );
		// object.geometry.applyMatrix(rotation);

		// object.rotation.y = -90 * Math.PI / 180;
		// object.rotation.x = -2 * Math.PI / 180;
		
		var pyramidPercentX = 56;
		var pyramidPercentY = 40;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		// object.position.x = pyramidPositionX * camera.aspect;
		// object.position.y = pyramidPositionY;
		// object.position.z = -0.5;
				
		var pyramidPercentX = 58;
		var pyramidPercentY = 35;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
			
		object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.35 );

		weaponModels.shotgun = object;

	}, onProgress, onError );


	loader.load( 'assets/models/scoped_rifle/scoped_rifle.obj', function ( object ) {

		var object = object.children[0];

		object.material.map = T_sniper_d;

		object.geometry.center();
		
		// object.scale.set( 0.8,0.8,0.8 ); 
		object.material.color.setHSL( 0, 0, 1 );
		object.material.map.anisotropy = 8; //front barrel of the weapon gets blurry
		object.receiveShadow = true;
		object.castShadow = true;

		// object.position.set( 40,-15,-10 );
		// object.rotation.y = -90 * Math.PI / 180;

		var rotation = new THREE.Matrix4().makeRotationY( -90 * Math.PI / 180 );
		object.geometry.applyMatrix(rotation);

		// object.rotation.x = -2 * Math.PI / 180; // + positiv = weiter nach unten
		// scene.add( object );
		
		// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs

		// camera.add(object);
		var pyramidPercentX = 55;
		var pyramidPercentY = 40;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		// object.position.x = pyramidPositionX * camera.aspect;
		// object.position.y = pyramidPositionY;
		// object.position.z = -0.5;

		var pyramidPercentX = 55;
		var pyramidPercentY = 38;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
			
		object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.6 );

		weaponModels.sniper = object;

	}, onProgress, onError );

	loader.load( 'assets/models/Flashlight/flashlight.obj', function ( object ) {

		var object = object.children[0];

		object.geometry.center();
		
		object.material.map = T_flashlight_d;

		// object.scale.set( 0.9,0.9,0.9 );
		object.receiveShadow = true;
		object.castShadow = true;
		object.material.color.setHSL( 0, 0, 1 );

		// object.rotation.z = 180 * Math.PI / 180;
		object.rotation.x = 180 * Math.PI / 180; // + positiv = weiter nach unten

		var rotation = new THREE.Matrix4().makeRotationZ( 180 * Math.PI / 180 );
		object.geometry.applyMatrix(rotation);
		
		// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs
		
		// camera.add(object);
		var pyramidPercentX = 57;
		var pyramidPercentY = 40;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		// object.position.x = pyramidPositionX * camera.aspect;
		// object.position.y = pyramidPositionY;
		// object.position.y = 1;
		// object.position.z = -0.3;

		object.emitterVector = new THREE.Vector3( 0, 0, 0 );

		weaponModels.flashlight = object;

	}, onProgress, onError );
/*
	loader.load( 'assets/models/jukebox/Jukebox.obj', function ( object ) {

		var object = object.children[0];
		object.scale.set( 0.35,0.35,0.35 );
		object.material.map = T_jukebox;
		object.material.side = THREE.DoubleSide;
		object.material.color.setHSL( 0, 0, 1 );
		// object.receiveShadow = true;
		object.castShadow = true;

		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( object, 0xff0000 );
		helper.update();
		// scene.add(helper);
		var boundingBoxSize = helper.box.max.sub( helper.box.min );

		// sofa.geometry.computeBoundingBox();
		// var geometryBoundingSize = sofa.geometry.boundingBox.max.sub( sofa.geometry.boundingBox.min );
		
		object.geometry.center();
		object.position.set( 2, boundingBoxSize.y/2, -4.5 );
		
		var width = boundingBoxSize.x;
		var height = boundingBoxSize.y;
		var depth = boundingBoxSize.z;

		var shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2 ) );

		var transform = new Ammo.btTransform();
		
		// var dB = makeDynamicBox( object, shape, transform );
		// dB.type = "metall"; // type for particle effect
		// boxes.push( dB ); // Keep track of this box

		jukebox = object;
		jukebox.name = "jukebox";

		// objects.push ( jukebox );

		// jukebox.add( env.sounds.badboys3js );
		// jukebox.add( env.sounds.radio );
		// jukebox.add( env.sounds.duo_singing );
		// jukebox.add( env.sounds.obama3js );

		// scene.add ( object );

	}, onProgress, onError );
*/

	/*
	var loader = new THREE.OBJMTLLoader( manager );

	//SHOTGUN
    loader.load( 'assets/models/shotgun_l4d/shotgun.obj', 'assets/models/shotgun_l4d/shotgun.mtl', function( object ) {

    	console.log("shotgun objmtl", object );

		var object = object.children[2];

		object.material = new THREE.MeshPhongMaterial({ color: 0xFFAA00 } );
		
		object.scale.set( 0.55,0.55,0.55 ); 
		object.material.map.anisotropy = 8; //front barrel of the weapon gets blurry
		object.receiveShadow = true;
		object.material.color.setHSL( 0, 0, 5 );

		// object.position.set( 40,-15,-10 );
		object.rotation.y = -90 * Math.PI / 180;
		object.rotation.x = -2 * Math.PI / 180;
		// object.rotation.x = Math.PI / 0.496; // + positiv = weiter nach unten
		
		// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs
		
		var pyramidPercentX = 56;
		var pyramidPercentY = -28;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		object.position.x = pyramidPositionX * camera.aspect;
		object.position.y = pyramidPositionY;
		object.position.z = -0.5;
				
		var pyramidPercentX = 58;
		var pyramidPercentY = 35;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		// tempVec = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.35 );
			
		object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.35 );
		

		// console.log( object );
		// scene.add( object );
		
		weaponModels.shotgun = object;

    });
// */

	// return weaponModels;
};

WeaponFactory.prototype.init = function( hud, physicFactory ) {

	console.log("WeaponFactory init");

	var that = this;
	var hud = hud;
    var weapons = {};

    var name = "portalgun";
	weapons.portalgun = new Weapon( name, {
		mesh: that.weaponModels[name],
		maxCapacity: 0, 
		magazines: 0, 
		reloadTime: 0, 
		shootDelay: 0.5,
		// shootSound: that.sounds.swosh1,
		// altSound: that.sounds.swosh5,
		// reloadSound: that.sounds.sniperreload,
		// emitterPool: this.muzzleFlash,
	} );


	name = "shotgun";
    weapons.shotgun = new Weapon( name, {
    	mesh: that.weaponModels[name],
		maxCapacity: 8, 
		magazines: 1, 
		// reloadTime: 0.3, 
		shootDelay: 0.1,
		// shootSound: that.sounds.sound1,
		// reloadSound: that.sounds.sound2,
		// emitterPool: this.muzzleFlash,
		} );

    name = "sniper";
    weapons.sniper = new Weapon( name, { 
    	mesh: that.weaponModels[name],
		maxCapacity: 6, 
		magazines: 2, 
		reloadTime: 4, 
		shootDelay: 1,
		// shootSound: that.sounds.sniperrifle,
		// reloadSound: that.sounds.sniperreload,
		// emitterPool: this.muzzleFlash,
		} );
/*
	for ( var key in weapons ) {
		// weapons[key].emitterPool = this.muzzleFlash;
		// weapons[key].emptySound = this.sounds.soundClick;
		// weapons[key].restockSound = this.sounds.sound3;
	}	

	if ( hud !== undefined ) 
	{

		// register update hud on ammo change and reload
		for ( var key in weapons ) {
			weapons[key].setCallback( hud, hud.update );
		}	

	}
*/
	// TODO Flashlight Volumetric light
	name = "flashlight";
	weapons.flashlight = new Weapon( name, {
		mesh: that.weaponModels[name]

	} );


	var i = 0;
	var bodys = [];

	for ( var key in weapons ) {
		if ( weapons.hasOwnProperty( key ) ) {
			var obj = weapons[ key ];

			if ( obj.mesh instanceof THREE.Mesh ) {

				i ++;
		
				var body = physicFactory.mesh2ammo( obj.mesh );
				physicFactory.addBody( body );
				bodys.push( body );

				// set position of physical object
				// dont just move the mesh!
				var x = body.mesh.getWorldPosition().x+=i;
				var y = body.mesh.getWorldPosition().y+=1;
				var z = body.mesh.getWorldPosition().z;

				var position = new Ammo.btVector3( x, y, z );

				var transform = body.getCenterOfMassTransform();
				transform.setOrigin( position );

			}

		}
	}

    return bodys;

};