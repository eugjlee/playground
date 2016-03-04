/**
 * FPS Mover Class
 * Creates a Character Controller
 * that is controlled by PointerLockAmmoControls
 *
 */

function FPSMover ( scene, controls, physicWorld, parameters ) 
{
  
	//basically its a THREE.Object3D with the camera as children
	var controlsObj = controls.getObject();
	var keyboard = controls;

	if ( parameters === undefined ) parameters = {};
	radius = parameters.hasOwnProperty("radius") ? 
		parameters.radius : 0.5;
	height = parameters.hasOwnProperty("height") ? 
		parameters.height : 1.8;
	eyeheight = parameters.hasOwnProperty("eyeheight") ? 
		parameters.eyeheight : 1.7;
	visualizePlayer = parameters.hasOwnProperty("visualizePlayer") ? 
		parameters.visualizePlayer : true;
	this.movementSpeed = parameters.hasOwnProperty("movementSpeed") ? 
		parameters.movementSpeed : 4;
	this.sprintSpeedMultiplier = parameters.hasOwnProperty("sprintSpeedMultiplier") ? 
		parameters.sprintSpeedMultiplier : 2;
	this.jumpImpulse = parameters.hasOwnProperty("jumpImpulse") ? 
		parameters.jumpImpulse : 100;

	this.isGrounded = false;
	
	var currentGroundHeight = 0;
	var meshForward = new THREE.Vector3();
	var ammoUpVector = new Ammo.btVector3( 0, 1, 0 );
	var velV = new Ammo.btVector3( 0, 0, 0 );
	var ammoMeshForward = new Ammo.btVector3( 0, 0, 0 );
	var ammoMeshRight = new Ammo.btVector3( 0, 0, 0 );
	var ammoZeroVector = new Ammo.btVector3( 0, 0, 0 );

	// HUD SPRITES
	// crosshairSprite setup
	// https://github.com/mrdoob/three.js/issues/4795
	// var crosshairTexture = THREE.ImageUtils.loadTexture('shared/images/crosshairs01.png');
	// var crosshairMaterial = new THREE.SpriteMaterial( { map: crosshairTexture, depthTest: false } );
	// crosshairSprite = new THREE.Sprite( crosshairMaterial );
	// //scale the crosshairSprite down in size
	// crosshairSprite.scale.set( 0.15, 0.15, 0.15 );
	// //add crosshairSprite as a child of our camera object, so it will stay centered in camera's view
	// camera.add( crosshairSprite );
	// //position sprites by percent X:(100 is all the way to the right, 0 is left, 50 is centered)
	// //                            Y:(100 is all the way to the top, 0 is bottom, 50 is centered)
	// var crosshairPercentX = 50;
	// var crosshairPercentY = 50;
	// var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
	// var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;
	// crosshairSprite.position.x = crosshairPositionX * camera.aspect;
	// crosshairSprite.position.y = crosshairPositionY;
	// crosshairSprite.position.z = -1.5;

	
	function createCapsuleGeometry ( radius, height ) 
	{

		var cylinderHeight = height - radius * 2;
		var cylinder = new THREE.CylinderGeometry( radius, radius, cylinderHeight, 20, 10, true );
		var cap = new THREE.SphereGeometry( radius, 10, 10, 0, Math.PI * 2, 0, Math.PI );

		cylinder.merge( cap, new THREE.Matrix4().makeTranslation( 0, -cylinderHeight / 2, 0 ) );
		cylinder.merge( cap, new THREE.Matrix4().compose(
			new THREE.Vector3(0, cylinderHeight / 2, 0 ),
			new THREE.Quaternion().setFromEuler( new THREE.Euler( Math.PI, 0, 0 ) ),
			new THREE.Vector3( 1, 1, 1 )
		) );

		return cylinder;

	}

	function createCharacterTestCapsule ( radius, height ) 
	{

		var character = new THREE.Mesh(
			createCapsuleGeometry( radius, height ),
			new THREE.MeshLambertMaterial( { 
				color: 0x00FF00, 
				transparent: true, 
				opacity: 0.2,
				side: THREE.DoubleSide
				} )
		);

		
		// helps indicate which direction is forward
		var directionMesh = new THREE.Mesh(
			new THREE.BoxGeometry( 0.2, 0.2, 1, 1, 1, 1 ),
			new THREE.MeshLambertMaterial( { color: 0x0000FF, ambient: 0x0000FF, transparent: true, opacity: 0.25 } )
		);
		character.castShadow = directionMesh.castShadow = true;

		character.add( directionMesh );
		directionMesh.position.set( 0, 0, -1.5 );
		

		return character;

	}

	// add visualization of mover
	/*
	this.mesh = new THREE.Mesh(
		new THREE.CylinderGeometry( radius,radius,height ),
		new THREE.MeshLambertMaterial( { color: 0x00FF00, ambient: 0x00FF00, wireframe:true, visible: visualizeB } )
	);
	*/

	this.mesh = createCharacterTestCapsule( radius, height );
	this.mesh.material.visible = visualizePlayer;

	scene.add( this.mesh );
	this.mesh.matrixAutoUpdate = false;
	scene.matrixAutoUpdate = false; // NOTWENDIG NACH UPDATE AUF R69
	// Changelog: Scene: Removed matrixAutoUpdate overwrite.

    // SET PLAYER POSITION & ROTATION
	this.mesh.position.set( 0, height/2, 2 );
	this.mesh.rotation.y = 180 * Math.PI / 180;

	this.mesh.add( controlsObj );
	controlsObj.position.set( 0, eyeheight-height / 2, 0 );
	
	// The total height is height + 2 * radius so we subtract out the extra
    var shape = new Ammo.btCapsuleShape( radius, height - 2 * radius );
    // slightly off the ground
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    
    transform.setOrigin( Ammo.Utils.createAmmoVector3FromThree( this.mesh.position ) );
    transform.setRotation( new Ammo.btQuaternion( this.mesh.rotation.y, this.mesh.rotation.x, this.mesh.rotation.z ) );
	
	// Cylinder Shape
	/*
	// z value supposedly not used, but setting to radius just in case
	var shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius,height/2,radius));
	var transform = new Ammo.btTransform();
	transform.setIdentity();
	// slightly off the ground
	// transform.setOrigin(new Ammo.btVector3(0,eyeheight,2));
	transform.setOrigin( Ammo.Utils.createAmmoVector3FromThree( this.mesh.position ) );
	*/

	localInertia = new Ammo.btVector3( 0, 0, 0 );
	var motionState = new Ammo.btDefaultMotionState( transform );
	var mass = 25;
	shape.calculateLocalInertia( mass,localInertia );
	
	var cInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
	cInfo.set_m_friction( 1 );
	this.body = new Ammo.btRigidBody( cInfo );
	this.body.setWorldTransform( transform );
	// http://bulletphysics.org/Bullet/phpBB3/viewtopic.php?t=8100
	// this.body.setDamping( 0.5, 1 ); // linear damping, rotational damping
	
	// turns off all rotation
	this.body.setAngularFactor( 0, 0, 0 ); // PREVIOUS
	// this.body.setAngularFactor( 0, 1, 0 ); // REALITYMELTDOWN
	
	// keeps physics from going to sleep (from bullet documentation)
	var DISABLE_DEACTIVATION = 4; 
	this.body.setActivationState(DISABLE_DEACTIVATION);
	// scene.world.addRigidBody( this.body );
	physicWorld.addRigidBody( this.body );
	
	// var ptr = this.body.a != undefined ? this.body.a : this.body.ptr;
	// _objects_ammo[ptr] = this.body;
	
	// ---------------------------------------------------------------------------
	// check if the player mesh is touching the ground
	var updateGrounding = ( function() {

		// this part will be exectued once
		var fromPoint = new Ammo.btVector3();
		var toPoint = new Ammo.btVector3();
		var rayPadding = height * 0.05 + 0; //extra padding because of clamping
		// var rayPadding = height * 0.05 + 0.074; //extra padding because of clamping

		return function() {
			
			// if ( this.body.getLinearVelocity().getY() < 0 ) { // > 0 when on stairs or in the air

			fromPoint.setValue(			
				this.mesh.matrixWorld.elements[ 12 ],
				this.mesh.matrixWorld.elements[ 13 ],
				this.mesh.matrixWorld.elements[ 14 ]        
			);

			toPoint.setValue( 
				fromPoint.x(), 
				fromPoint.y() - height / 2 - rayPadding, 
				fromPoint.z() 
			);

			var rayCallback = new Ammo.ClosestRayResultCallback( fromPoint, toPoint );

			physicWorld.rayTest( fromPoint, toPoint, rayCallback );
			// scene.world.rayTest( fromPoint, toPoint, rayCallback );
			this.isGrounded = rayCallback.hasHit();

			if ( this.isGrounded ) {

				var body = rayCallback.get_m_collisionObject();

			// if( body ){
				// console.log( body.getCollisionFlags() );

				// take into account CF_NO_COLLISION
				if( body.getCollisionFlags() !== 5 ){
				// if( !( body.isStaticObject() || body.isKinematicObject() ) ){
					currentGroundHeight = rayCallback.get_m_hitPointWorld().getY();
				}
			// }
			}

			// } else {
			// 	this.isGrounded = false;
	  //     	}
		}

	} )();

	// ---------------------------------------------------------------------------
	var updateRenderMatrix = ( function() {

		// var position = new THREE.Vector3();

		return function() {

			// copy the rigid body transform to the render object transform
			var trans = this.body.getWorldTransform();
			var mat = this.mesh.matrixWorld;
			Ammo.Utils.b2three( trans, mat );

			// position.set( mat.elements[ 12 ], mat.elements[ 13 ], mat.elements[ 14 ] );

			// Wipe out any rotation that comes from the physics
			// mat.identity();
			// mat.setPosition( position );

		}

	} )();

	// var updateRenderMatrix = (function() {

	//     var position = new THREE.Vector3();

	//     return function( dt ) {

	//       // copy the rigid body transform to the render object transform
	//       var trans = this.body.getWorldTransform();
	//       var mat = this.mesh.matrixWorld;
	//       Ammo.Utils.b2three( trans, mat );

	//       position.set( mat.elements[ 12 ], mat.elements[ 13 ], mat.elements[ 14 ] );

	//       // Wipe out any rotation that comes from the physics
	//       mat.identity();
	//       mat.setPosition( position );

	//     }

	//   })();

	this.prerender = function() 
	{

		// TODO: 
		// make character a little bit controlable in the air

		// modify matrices to work with ammo
		// scene.updateMatrix();
		// this.mesh.updateMatrix();
		updateRenderMatrix.call( this ); //why pass dt?
		updateGrounding.call( this );

		// rotate the body in view direction 
		// (mainly doing this for correct audio listener orientation)
		var transform = this.body.getCenterOfMassTransform();
    	transform.setRotation( new Ammo.btQuaternion( controls.getYRotation(), 0, 0 ) );
    	// transform.setRotation( new Ammo.btQuaternion( controls.getYRotation(), 0, 0 ) );
		
		if ( this.isGrounded ) {

			if ( !keyboard.spacebar ) {
			// if ( !this.jump ) {

				// Clamp the character to the terrain to prevent floating off hills
				// var hat = this.mesh.matrixWorld.elements[ 13 ] - height / 2 - currentGroundHeight;
				// extra padding for stairs
				// -0.08 no sliding down but glitching

				// var ypos = new THREE.Vector3();
				// ypos.setFromMatrixPosition( this.mesh.matrixWorld );
				// var ypos2 = this.mesh.getWorldPosition().y;

				var hat = this.mesh.matrixWorld.elements[ 13 ] - height / 2 - currentGroundHeight;

				// this is why we cant have nice things
				// ie walk up stairs easy
				this.body.translate( new Ammo.btVector3( 0, -hat, 0 ) );

				// get camera direction
				controlsObj.getWorldDirection( meshForward );

				// convert to Ammo vector, project to plane
				ammoMeshForward.setValue( -meshForward.x, 0, -meshForward.z );
				ammoMeshForward.normalize();

				// right direction is dir X yUnit
				ammoMeshRight = ammoMeshForward.cross( ammoUpVector );

				// set up physics for next time
				// var velV = new Ammo.btVector3(0,-1,0);
				// velV.setValue( 0, -1, 0 );
				velV.setValue( 0, 0, 0 );
				
				if ( keyboard.forward )
					velV.op_add( ammoMeshForward );
				if ( keyboard.right )
					velV.op_add( ammoMeshRight );
				if ( keyboard.left )
					velV.op_sub( ammoMeshRight );
				if ( keyboard.back )
					velV.op_sub( ammoMeshForward );
					
				// Only apply movement if we have a significant distance to cover
				if ( velV.length2() > 0.001 ) {
				// if ( velV.length2() > 0.001 ) {

					velV.normalize();
					velV.op_mul( this.movementSpeed );

					if( keyboard.shift ) {

						velV.op_mul( this.sprintSpeedMultiplier ); //custom
						
					}

					this.body.setLinearVelocity( velV );

				} else {
					// console.log("nix");
					// ammoZeroVector.setValue( 0, -1, 0 );
					this.body.setLinearVelocity( ammoZeroVector );

				}
				
			} else {

				// Help the character get above the terrain and then apply up force
				this.body.translate( new Ammo.btVector3( 0, height * 0.15, 0 ) );
				this.body.applyCentralImpulse( new Ammo.btVector3( 0, this.jumpImpulse, 0 ) );

			}

		} 

// move a little bit while jumping -- experimental
/*		else {
			// player not grounded
				// get camera direction
				controlsObj.getWorldDirection( meshForward );

				// convert to Ammo vector, project to plane
				ammoMeshForward.setValue( -meshForward.x, 0, -meshForward.z );
				ammoMeshForward.normalize();

				// right direction is dir X yUnit
				ammoMeshRight = ammoMeshForward.cross( ammoUpVector );

				// set up physics for next time
				// var velV = new Ammo.btVector3(0,-1,0);
				velV.setValue( 0, 0, 0 );
				
				if ( keyboard.forward )
					velV.op_add( ammoMeshForward );
				if ( keyboard.right )
					velV.op_add( ammoMeshRight );
				if ( keyboard.left )
					velV.op_sub( ammoMeshRight );
				if ( keyboard.back )
					velV.op_sub( ammoMeshForward );
					
				// Only apply movement if we have a significant distance to cover
				if ( velV.length2() > 0.001 ) {
				// if ( velV.length2() > 0.001 ) {

					velV.normalize();
					velV.op_add( 0, -1, 0 );
					velV.normalize();
					// velV.op_mul( this.movementSpeed );

					this.body.setLinearVelocity( new Ammo.btVector3( velV.x(), -1, velV.z() ) );
					// this.body.setLinearVelocity( velV );
				}
		}*/

		keyboard.spacebar = false;
		// this.jump = false;

	};
}