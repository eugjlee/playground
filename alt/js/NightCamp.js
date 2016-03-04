function NightCamp( scene ) {
	
	// tent
	// rock
	// cement blocks
	// barrels
	// plants

	this.sceneObjects = new THREE.Object3D();

	this._scene = scene;

	this.physicFactory;
	
	this.fpsMeshes;

}

NightCamp.prototype.update = function( dt ) {

	this.crashSmoke.tick( dt );

};

NightCamp.prototype.dispose = function() {

	console.log("disposing");

	this._scene.remove( this.sceneObjects );

}

NightCamp.prototype.init = function() {

	this._scene.add( this.sceneObjects );

	this.crashSmoke = SPESmoke();
	// this.crashSmoke.mesh.rotation.y = 90 * Math.PI / 180;
	// object.add( this.crashSmoke.mesh );
	this.sceneObjects.add( this.crashSmoke.mesh );
	this.crashSmoke.mesh.position.set( -3.5, 0, 1.5 );

	// LIGHTS
	/*
	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
	hemiLight.color.setHSL( 0.6, 0.3, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	this.sceneObjects.add( hemiLight );

	//

	dirLight = new THREE.DirectionalLight( 0xFFFFDD, 1 );
	dirLight.color.setHSL( 0.13, 1, 0.9 );
	dirLight.position.set( 0.3, 1.75, 0.3 );
	dirLight.position.multiplyScalar( 20 );
	this.sceneObjects.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadowMapWidth = dirLight.shadowMapHeight = 2048;

	var d = 20;
	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadow.camera.near = 10;
	dirLight.shadow.camera.far = dirLight.position.y + 25;
	// dirLight.shadowBias = -0.0001;
	*/
	// var helper = new THREE.CameraHelper( dirLight.shadow.camera );
	// this.sceneObjects.add( helper );

	//
	var aL = new THREE.AmbientLight( 0x050505 );
	this.sceneObjects.add( aL );

	// var dirLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
	// dirLight.color.setHSL( 0.1, 1, 0.95 );
	// dirLight.position.set( -1, 1.75, 1 );
	// dirLight.position.multiplyScalar( 50 );
	// scene.add( dirLight );

	// SUNLIGHT
	// var sun = new THREE.SpotLight( 0xFFFFDD, 0.8 ); //0xFFFFDD //0x44ffaa mystic green
	// sun.angle = 40 * Math.PI / 180;
	// sun.exponent = 2; // inner circle light falloff softness (penumbra), 1 = hard, 10 = soft
	// sun.position.set( -10, 50, 0 );
	// sun.castShadow = true;
	// // sun.shadowBias = 50;
	// sun.shadowCameraFov = 60;
	// sun.shadowCameraNear = 10;
	// sun.shadowCameraFar = sun.position.y + 10;
	// sun.shadowMapWidth = sun.shadowMapHeight = 2048;
	// sun.shadowDarkness = 0.5;

	// scene.add( sun );

	// NIGHT LIGHT
	
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.2 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	this.sceneObjects.add( hemiLight );

	//

	var dirLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
	dirLight.color.setHSL( 0.1, 1, 0.3 );
	dirLight.position.set( 3, 0.3, 0.3 );
	dirLight.position.multiplyScalar( 20 );
	this.sceneObjects.add( dirLight );

	dirLight.castShadow = true;
	
	var d = 20;
	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadowMapWidth = dirLight.shadowMapHeight = 2048;

	dirLight.shadow.camera.near = 20;
	dirLight.shadow.camera.far = 100;

	dirLight.shadowDarkness = 0.3;

	// var helper = new THREE.CameraHelper( dirLight.shadow.camera );
	// this.sceneObjects.add( helper );


	var skyBox = this._getSkyBox();
	this.sceneObjects.add( skyBox );

	var floor = this._getFloor( 50, 50 );
	this.sceneObjects.add( floor );

	var wallGeometry = new THREE.BoxGeometry( 1, 2, 50 );
	var wallMesh = new THREE.Mesh( wallGeometry, this.washedConcreteMaterial );

	var distance = 25;
	var height = wallGeometry.parameters.height / 2;

	var wallLeft = wallMesh.clone();
	wallLeft.position.set( distance, height, 0 );
	var wallRight = wallMesh.clone();
	wallRight.position.set( -distance, height, 0 );
	var wallTop = wallMesh.clone();
	wallTop.rotation.y = 90 * Math.PI / 180;
	wallTop.position.set( 0, height, -distance );
	var wallBottom = wallMesh.clone();
	wallBottom.rotation.y = 90 * Math.PI / 180;
	wallBottom.position.set( 0, height, distance );

	this.sceneObjects.add( wallLeft );
	this.sceneObjects.add( wallRight );
	this.sceneObjects.add( wallTop );
	this.sceneObjects.add( wallBottom );

	if ( this.physicFactory !== undefined ) {

		this.physicFactory.mesh2ammo( wallLeft, 0 );
		this.physicFactory.mesh2ammo( wallRight, 0 );
		this.physicFactory.mesh2ammo( wallTop, 0 );
		this.physicFactory.mesh2ammo( wallBottom, 0 );
	}

	var nightcamp = this;
	function lightPoleCreator( model ) {

		var lightPost = new THREE.Object3D();

		lightPost.add( model );

		var helper = new THREE.BoundingBoxHelper( model, 0xff0000 );	
		helper.update();
		var boundingBoxSize = helper.box.max.sub( helper.box.min );

		// Light Pole
		var light = new THREE.SpotLight( 0xfff48c, 0.8 ); //0xFFFFDD //0x44ffaa mystic green
		light.angle = 80 * Math.PI / 180;
		light.exponent = 8; // inner circle light falloff softness (penumbra), 1 = hard, 10 = soft
		light.position.set( 0, boundingBoxSize.y - 0.5, 0.7 );

		light.target.position.set( 0, 0, 0 );
		lightPost.add( light.target );

		light.castShadow = true;
		// light.shadowBias = 50;
		light.shadowCameraFov = 80;
		light.shadowCameraNear = 0.5;
		light.shadowCameraFar = light.position.y + 1;
		light.shadowMapWidth = light.shadowMapHeight = 1024;
		light.shadowDarkness = 0.5;

		// var helper = new THREE.CameraHelper( light.shadow.camera );
		// nightcamp.sceneObjects.add( helper );

		lightPost.add( light );

		return lightPost;

	};

	var x = lightPoleCreator( this.lightPole.clone() );
	x.position.set( 0, 0, 3 );
	this.sceneObjects.add( x );	

	var x = lightPoleCreator( this.lightPole.clone() );
	x.position.set( -9, 0, 3 );
	this.sceneObjects.add( x );

	var x = lightPoleCreator( this.lightPole.clone() );
	x.position.set( 9, 0, 3 );
	this.sceneObjects.add( x );

};

NightCamp.prototype._getFloor = function( width, height ) {

	// FLOOR 
	var width = width || 25,
		height = height || 25,
		widthsegments = 10,
		heightsegments = 10;

	var floorGeometry = new THREE.PlaneBufferGeometry( width, height, widthsegments, heightsegments );
	var floorMaterial = new THREE.MeshLambertMaterial( { color : 0x999999, side : THREE.DoubleSide } );

	var floor = new THREE.Mesh( floorGeometry, floorMaterial );
	floor.rotation.x = - Math.PI / 2;
	floor.position.y = 0.0;
	floor.receiveShadow = true;

	// var floorTexture = this.T_dirt_d;
	var floorTexture = this.floorTexture;
	// var floorTexture_n = this.T_wellpappe_n;
	// var floorTexture_s = this.T_pattern_224_s;

	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	// floorTexture_n.wrapS = floorTexture_n.wrapT = THREE.RepeatWrapping;
	// floorTexture_s.wrapS = floorTexture_s.wrapT = THREE.RepeatWrapping;

	floorTexture.repeat.set( 4, 4 );
	// floorTexture_n.repeat.set( 4, 4 );
	// floorTexture_s.repeat.set( 8, 8 );

	floorTexture.anisotropy = 8;
	// floorTexture_n.anisotropy = 8;
	// floorTexture_s.anisotropy = 8;

	var floorMaterial = new THREE.MeshPhongMaterial( { 
		color : 0xAAAAAA, 
		side : THREE.DoubleSide, 
		map : floorTexture,
		// normalMap: floorTexture_n,
		// specularMap: floorTexture_s,
		shininess: 10,
		specular: 0x101010	
		} );
	floor.material = floorMaterial;
	
	return floor;

};

NightCamp.prototype._getSkyBox = function() {

	var dimension_w = 100;
	var dimension_h = 100;

	var cubesize = 400 + 2 * Math.max( dimension_w, dimension_h );

	var skyGeometry = new THREE.BoxGeometry( cubesize, cubesize, cubesize );
	var bufferSkyGeometry = new THREE.BufferGeometry().fromGeometry( skyGeometry );
	skyGeometry.dispose(); //cleanup memory

	var skyMaterial = new THREE.MeshFaceMaterial( this.skyBoxMaterialArray );
	var skyBox = new THREE.Mesh( bufferSkyGeometry, skyMaterial );
	skyBox.rotation.y = 90 * Math.PI / 180;

	skyBox.matrixAutoUpdate = false;
	skyBox.updateMatrix();

	// SkyBox from environment Map with new CubeTexture Loader
	var skyMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.T_cubemapSky, side:THREE.BackSide } );
	// console.log( this.T_cubemapSky );
	var bufferSkyGeometry = new THREE.SphereBufferGeometry( 150, 32, 32 );
	var skyBox = new THREE.Mesh( bufferSkyGeometry, skyMaterial );
	// skyBox.position.y = 10;
	// skyBox.rotation.y = 90 * Math.PI / 180;

	return skyBox;

};

NightCamp.prototype.preload = function( manager ) {

	// Hide loading screen
	$('.loading-container').fadeIn();

	var textureLoader = new THREE.TextureLoader( manager );

	var url = 'assets/images/webtreats-grunge-3.jpg'
	this.floorTexture = textureLoader.load( url );
	this.floorTexture.wrapS = this.floorTexture.wrapT = THREE.RepeatWrapping;
	this.floorTexture.repeat.set( 4, 4 );
	this.floorTexture.anisotropy = 8;

	var imagePrefix = "assets/images/sunnysky/";
	var directions  = [ "px", "nx", "py", "ny", "pz", "nz" ];
	var imageSuffix = ".jpg";
	
	/*	
	var cubeArray = [];
	for ( var i = 0; i < 6; i++ ){
		cubeArray.push( imagePrefix + directions[i] + imageSuffix );
	 }

	var loader = new THREE.CubeTextureLoader( manager );
	this.T_cubemapSky = loader.load( cubeArray, function ( texture ) {
			// texture.format = THREE.RGBFormat; ????
		} );
	*/

	// var url = "assets/images/skyspheres/56788ee93cb046e0b265dc8c2a7f10f8-night-sky-panorama_preview.jpg"; //night
	var url = "assets/images/skyspheres/vue_sky_002.jpg"; //night
	var url = "assets/images/skyspheres/fWRqByQ_2048.jpg"; //night
	// var url = "assets/images/skyspheres/sky01_hdri_3d_model_3ds_c51df0de-d928-4fb4-ae30-df1001794eaa.jpg"; //evening
	this.T_cubemapSky = textureLoader.load( url );
	this.T_cubemapSky.mapping = THREE.SphericalReflectionMapping;
	// T_night_equirect.mapping = ;
	
	// SKYBOX
	this.skyBoxMaterialArray = [];

	var length = directions.length;
	for ( var i = 0; i < length; i++ ) {

		var texture = textureLoader.load( imagePrefix + directions[i] + imageSuffix, function ( texture ) {
				// var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
				// materialArray.push( material );
			}
		);

		var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
		this.skyBoxMaterialArray.push( material );

	}

	// Wall Material
	var pattern = "pattern_205/";
	var url = 'assets/images/' + pattern + 'diffuse.jpg';
	var diffuseMap = textureLoader.load( url );
	var url = 'assets/images/' + pattern + 'normal.jpg';
	var normalMap = textureLoader.load( url );
	var url = 'assets/images/' + pattern + 'specular.jpg';
	var specularMap = textureLoader.load( url );

	diffuseMap.wrapS = diffuseMap.wrapT = normalMap.wrapS = normalMap.wrapT = specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
	diffuseMap.repeat = normalMap.repeat = specularMap.repeat.set(10, 0.5);
	diffuseMap.anisotropy = 16;
	
	this.washedConcreteMaterial = new THREE.MeshPhongMaterial ( 
		{ 
			map: diffuseMap, 
			normalMap: normalMap, 
			specularMap: specularMap, 
			color: 0xFFFFFF, 
			// emissive: 0x555555,
			shininess: 1,
			specular: 0x999999,
			normalScale: { x: 0.5, y: 0.5 }
		} );


	var OBJMTLLoader = new THREE.OBJMTLLoader( manager );
	var directoryPath = "assets/models/";

	// light pole
	OBJMTLLoader.load( directoryPath + 'LightPole/LightPole4.obj', directoryPath+'LightPole/LightPole4.mtl', function ( object ) {

		var lamp = object.children[0].children[1];
		var pole = object.children[1].children[1];

		var object = pole;
		object.add ( lamp );

		lamp.material.emissive.setHex( 0xfff48c );
		object.scale.set( 0.2, 0.2, 0.2 );

		var helper = new THREE.BoundingBoxHelper( object, 0xff0000 );
		helper.update();
		var boundingBoxSize = helper.box.max.sub( helper.box.min );
		
		var translationMatrix = new THREE.Matrix4().makeTranslation( 0, boundingBoxSize.y * 2, 9 )
		object.geometry.applyMatrix( translationMatrix );
		lamp.geometry.applyMatrix( translationMatrix );

		// this.sceneObjects.add( object );

		this.lightPole = object;

	}.bind( this ));


	// barrel_02
	this.barrel_02;
	var name = "Barrel_02";
	OBJMTLLoader.load( directoryPath + name + "/" + name + '.obj', directoryPath + name + "/" + name + '.mtl', function ( object ) {
		// callback loses name
		var name = "Barrel_02";

		var object = object.children[ 1 ];
		var material = object.material;
		// object.scale.set( 0.5,0.5,0.5 ); 
		// console.log( "barrel", object );

		// object.material.map.anisotropy = 8;
		object.castShadow = true;

		var url = directoryPath + name + "/" + name + "_N.jpg";
		var normalMap = textureLoader.load( url );
		material.normalMap = normalMap;
		// material.normalScale.set ( 1, 1 );
		// material.metal = true;
		material.color.setHex( 0xFFFFFF );
		material.shininess = 50;
		material.specular.setHex( 0x333333 );

		var mesh = getProxyMesh( object, "Cylinder" );
		mesh.position.set( 0, 1, 0 );
		if ( this.physicFactory !== undefined ) {
			var body = this.physicFactory.mesh2ammo( mesh );
		}
		this.sceneObjects.add( mesh );
		this.barrel_02 = mesh;
		this.spawnObject = mesh;

	}.bind( this ));


	// crashed helicopter
	this.heli_crashed;
	var name = "Helicopter_crashed";
	OBJMTLLoader.load( directoryPath + name + "/" + name + '.obj', directoryPath + name + "/" + name + '.mtl', function ( object ) {
		var name = "Helicopter_crashed";

		var object = object.children[ 0 ].children[ 1 ];
		var material = object.material;
		material.normalScale.set ( -1, -1 );
		// material.metal = true;
		material.color.setHex( 0xFFFFFF );
		material.shininess = 30;
		material.specular.setHex( 0xCCCCCC );


		object.castShadow = true;
		object.scale.set( 0.35,0.35,0.35 );
		// material.map.anisotropy = 8;
		// console.log( "heli", object );

		var url = directoryPath + name + "/" + "Helicopter_Crash_N.jpg";
		var normalMap = textureLoader.load( url );
		material.normalMap = normalMap;

		var url = directoryPath + name + "/" + "Helicopter_Crash_S.jpg";
		var specularMap = textureLoader.load( url );
		material.specularMap = specularMap;

		// var mesh = getProxyMesh( object, "Cylinder" );
		// var body = this.physicFactory.mesh2ammo( mesh );

		object.position.set( -3, 0, 0 );
		object.rotation.y = 180 * Math.PI / 180;

		this.sceneObjects.add( object );
		this.heli_crashed = object;

	}.bind( this ));

	// supplies
	this.supplies;
	var name = "Supplies";
	OBJMTLLoader.load( directoryPath + name + "/" + name + '.obj', directoryPath + name + "/" + name + '.mtl', function ( object ) {

		// fix position
		object.scale.set( 0.045,0.045,0.045 ); 
		var helper = new THREE.BoundingBoxHelper( object, 0xff0000 );	
		helper.update();
		var boundingBoxSize = helper.box.max.sub( helper.box.min );
		object.position.y = boundingBoxSize.y / 2;
		//

		// fix materials
		var length = object.children.length;
		for ( var i = 0; i < length; i ++ ) {

			var mesh = object.children[ i ];
			var material = mesh.material;

			if ( material instanceof THREE.MeshPhongMaterial ) {
				material.specular.setHex( 0x555555 );
				material.shininess = 10;
			}
			material.color.setHex( 0xFFFFFF );
			// material.map.anisotropy = 8;
			// console.log ( object.material );

			mesh.castShadow = true;
			mesh.geometry.center();

		}
		//

		var mesh = getProxyMesh( object );

		mesh.position.set( 3, boundingBoxSize.y / 2, 0 );
		mesh.rotation.y = 180 * Math.PI / 180;
		if ( this.physicFactory !== undefined ) {
			var body = this.physicFactory.mesh2ammo( mesh, 0 );
		}
		this.sceneObjects.add( mesh );
		this.supplies = mesh;

	}.bind( this ));

};

// loadModels
// createPhysical objects
// add to scene