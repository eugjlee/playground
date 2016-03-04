function Testbed( scene ) {

	this.sceneObjects = new THREE.Object3D();

	this._scene = scene;

	this.physicFactory;

	this.fpsMeshes;

}

Testbed.prototype.dispose = function() {

	console.log("disposing");

	this._scene.remove( this.sceneObjects );

}

Testbed.prototype.init = function() {

	this._scene.add( this.sceneObjects );

	// SKYBOX
	var skyBox = this._getSkyBox();
	this.sceneObjects.add( skyBox );

	// FLOOR
	var floor = this._getFloor();
	this.sceneObjects.add( floor );
	// this.fpsMeshes.push( floor );

	// LIGHTS

	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
	hemiLight.color.setHSL( 0.6, 0.3, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	this.sceneObjects.add( hemiLight );

	//

	dirLight = new THREE.DirectionalLight( 0xFFFFDD, 1 );
	dirLight.color.setHSL( 0.13, 1, 0.9 );
	dirLight.position.set( 0.3, 2, 0.3 );
	dirLight.position.multiplyScalar( 20 );
	this.sceneObjects.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadowMapWidth = dirLight.shadowMapHeight = 2048;

	var d = 20;
	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadow.camera.near = 1;
	dirLight.shadow.camera.far = dirLight.position.y + 20;
	// dirLight.shadowBias = -0.0001;

	// var helper = new THREE.CameraHelper( dirLight.shadow.camera );
	// this.sceneObjects.add( helper );

	//
	var aL = new THREE.AmbientLight( 0x111111 );
	// scene.add( aL );

};

Testbed.prototype.update = function( dt ) {
	// this.crashSmoke.tick( dt );
};

Testbed.prototype.preload = function( manager ) {

	console.log("loading", this.constructor.name );

	// Hide loading screen
	$('.loading-container').fadeIn();

	var textureLoader = new THREE.TextureLoader( manager );

	// FLOOR MATERIAL
	var url = "assets/images/seamlesstexture25_1024.jpg";
	this.T_wellpappe_d = textureLoader.load( url );
	var url = "assets/images/seamlesstexture25_1024n.jpg";
	this.T_wellpappe_n = textureLoader.load( url );

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

	var OBJMTLLoader = new THREE.OBJMTLLoader( manager );
	var directoryPath = "assets/models/";

	// lego man
	OBJMTLLoader.load( directoryPath + 'legoman/LEGO_Man.obj', directoryPath+'legoman/LEGO_Man.mtl', function ( object ) {

		object.scale.set( 0.2, 0.2, 0.2 );

		// 196,40,27 //bright red
		// 13,105,171 //bright blue
		// 245,205,47 //bright yellow
		// 35,71,139 //dark royal blue
		var newMaterial = new THREE.MeshPhongMaterial( {} );
		object.children[0].children[1].material = newMaterial.clone();
		object.children[0].children[2].material = newMaterial.clone();
		object.children[0].children[3].material = newMaterial.clone();
		object.children[0].children[4].material = newMaterial.clone();
		object.children[0].children[5].material = newMaterial.clone();
		object.children[0].children[6].material = newMaterial.clone();

		object.children[0].children[1].material.color = new THREE.Color("rgb(245,205,47)"); // head
		object.children[0].children[2].material.color = new THREE.Color("rgb(35,71,139)"); // waist
		object.children[0].children[3].material.color = new THREE.Color("rgb(245,205,47)"); // hands
		object.children[0].children[4].material.color = new THREE.Color("rgb(196,40,27)"); // arms		
		object.children[0].children[5].material.color = new THREE.Color("rgb(196,40,27)"); // chest
		object.children[0].children[6].material.color = new THREE.Color("rgb(35,71,139)"); // legs

		object.children[0].children[1].castShadow = true;
		object.children[0].children[2].castShadow = true;
		object.children[0].children[3].castShadow = true;
		object.children[0].children[4].castShadow = true;
		object.children[0].children[5].castShadow = true;
		object.children[0].children[6].castShadow = true;

		object.rotation.y = -180 * Math.PI / 180;

		var mesh = getProxyMesh( object );
		mesh.position.set( 0, 0.6, 0 );
		if ( this.physicFactory !== undefined ) {
			var body = this.physicFactory.mesh2ammo( mesh );
			
		}
		this.sceneObjects.add( mesh );
		this.legoMan = mesh;
		this.spawnObject = mesh;

	}.bind( this ));


	/*
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
		var body = this.physicFactory.mesh2ammo( mesh );
		this.sceneObjects.add( mesh );
		this.barrel_02 = mesh;

	}.bind( this ));
	// */

	/*
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

		this.crashSmoke = SPESmoke();
		// this.crashSmoke.mesh.rotation.y = 90 * Math.PI / 180;
		// object.add( this.crashSmoke.mesh );
		this.sceneObjects.add( this.crashSmoke.mesh );
		this.crashSmoke.mesh.position.set( -3.5, 0, 1.5 );

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

		var body = this.physicFactory.mesh2ammo( mesh, 0 );
		this.sceneObjects.add( mesh );
		this.supplies = mesh;

	}.bind( this ));

	*/

};

Testbed.prototype._getFloor = function( width, height ) {

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
	var floorTexture = this.T_wellpappe_d;
	var floorTexture_n = this.T_wellpappe_n;
	// var floorTexture_s = this.T_pattern_224_s;

	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture_n.wrapS = floorTexture_n.wrapT = THREE.RepeatWrapping;
	// floorTexture_s.wrapS = floorTexture_s.wrapT = THREE.RepeatWrapping;

	floorTexture.repeat.set( 4, 4 );
	floorTexture_n.repeat.set( 4, 4 );
	// floorTexture_s.repeat.set( 8, 8 );

	floorTexture.anisotropy = 8;
	floorTexture_n.anisotropy = 8;
	// floorTexture_s.anisotropy = 8;

	var floorMaterial = new THREE.MeshPhongMaterial( { 
		color : 0xAAAAAA, 
		side : THREE.DoubleSide, 
		map : floorTexture,
		normalMap: floorTexture_n,
		// specularMap: floorTexture_s,
		shininess: 10,
		specular: 0x101010	
		} );
	floor.material = floorMaterial;
	
	return floor;

};

Testbed.prototype._getSkyBox = function() {

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
	// var skyMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: this.T_cubemapSky, side:THREE.BackSide } );
	// console.log( this.T_cubemapSky );
	// var skyBox = new THREE.Mesh( bufferSkyGeometry, skyMaterial );
	// skyBox.rotation.y = 90 * Math.PI / 180;

	return skyBox;

};