/**
 * Weapon Class
 * creates a Weapon
 *
 */

'use strict';

function Weapon( modelname, parameters ) {

    this.modelname = modelname || "generic weapon";
	
	if ( parameters === undefined ) parameters = {};
	this.maxCapacity = parameters.hasOwnProperty("maxCapacity") ? 
		parameters.maxCapacity : 0;	
	this.currentCapacity = parameters.hasOwnProperty("currentCapacity") ? 
		parameters.currentCapacity : this.maxCapacity;	
	this.magazines = parameters.hasOwnProperty("magazines") ? 
		parameters.magazines : 0;	
	this.reloadTime = parameters.hasOwnProperty("reloadTime") ? 
		parameters.reloadTime : 0;	
	this.shootDelay = parameters.hasOwnProperty("shootDelay") ? 
		parameters.shootDelay : 0.1;	
	this.shootSound = parameters.hasOwnProperty("shootSound") ? 
		parameters.shootSound : undefined;	
	this.reloadSound = parameters.hasOwnProperty("reloadSound") ? 
		parameters.reloadSound : undefined;	
	this.emptySound = parameters.hasOwnProperty("emptySound") ? 
		parameters.emptySound : undefined;
	this.altSound = parameters.hasOwnProperty("altSound") ? 
		parameters.altSound : undefined;
	this.emitterPool = parameters.hasOwnProperty("emitterPool") ? 
		parameters.emitterPool : undefined;	
	this.mesh = parameters.hasOwnProperty("mesh") ? 
		parameters.mesh : undefined;
		
	
	// this.ammunition = new Ammunition( this.currentCapacity, this.maxCapacity );

    this.power;
	
	this.reloading = false;
	this.lastShotFired = 0;

}

// var initposz = -0.5; //-1

Weapon.prototype.toString = function() {

    return this.modelname + ": " + this.currentCapacity + "/" + this.maxCapacity * this.magazines + " Ammo";

};

Weapon.prototype.RMB = function() {

	var rayCallback = Ammo.Utils.btPickPos( 200 );

	// var test2 = test.get_m_triangleIndex();
	// console.log("test2", test2);
	// rayResult.m_localShapeInfo->m_triangleIndex


	// raycaster.set( camera.getWorldPosition(), camera.getWorldDirection(), 0, 20 );
	// raycaster.ray.set( camera.getWorldPosition(), camera.getWorldDirection() );

	// intersects = raycaster.intersectObjects( portalMeshes );
	
	// if ( intersects.length > 0 ) {

		// console.log(intersects);
		// console.log(intersects.face.normal);
		// var target = intersects[ 0 ].object;
		// console.log( "portalNormal before", portalNormal );
		// portalNormal = intersects[0].face.normal;

		// console.log( "portalNormal after", portalNormal );
		// portalNormal = intersects[0].face.normal.negate(); //gives -0 which crashes
		// portalNormal = new THREE.Vector3( ammoNormal.getX(), ammoNormal.getY(), ammoNormal.getZ() );
		// portalNormal = new THREE.Vector3( normal.x(), normal.y(), normal.z() );
		
	// }

	if( rayCallback ) {

		var pickPos = rayCallback.get_m_hitPointWorld();

		// var far = 10,
		// 	intersects = [],
		// 	target,
		// 	distance;

		// var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3());

		// raycaster.set( camera.getWorldPosition(), camera.getWorldDirection() );
		// intersects = raycaster.intersectObjects( portalMeshes );

		// if ( intersects.length > 0 ) {

		// 	target = intersects[ 0 ];

		// 	// var position = new THREE.Vector3( pickPos.x(), pickPos.y(), pickPos.z() );
		// 	var position = target.point;

		// 	position.add( target.face.normal.clone().multiplyScalar( env.portalOut.geometry.parameters.depth/2 ) );
		// 	env.portalOut.position.copy( position );
		// 	env.portalOut.lookAt( position.clone().add( target.face.normal ) );

		// 	env.portalOut.updateMatrix(); //OH GOOOOOOOOOD

		// 	// env.trigger1.mesh.position.set( pickPos.x(), pickPos.y(), pickPos.z() );

		// }



		var body = rayCallback.get_m_collisionObject();
		if ( body ) {

			var far = 10,
				intersects = [],
				target,
				distance;

			var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3());

			raycaster.set( camera.getWorldPosition(), camera.getWorldDirection() );
			intersects = raycaster.intersectObjects( portalMeshes );

			if ( intersects.length > 0 ) {

				target = intersects[ 0 ];

				// var position = new THREE.Vector3( pickPos.x(), pickPos.y(), pickPos.z() );
				var position = target.point;

				position.add( target.face.normal.clone().multiplyScalar( env.portalOut.geometry.parameters.depth/2 ) );
				// position.add( target.face.normal.clone().multiplyScalar( env.trigger1.mesh.geometry.parameters.depth/2 ) );

				env.portalOut.position.copy( position );
				env.portalOut.lookAt( position.clone().add( target.face.normal ) );

				// env.portalOut.updateMatrix(); //OH GOOOOOOOOOD

				// env.trigger1.mesh.position.set( pickPos.x(), pickPos.y(), pickPos.z() );

			}

		}


		this.altSound.play();

		portalVector = pickPos;
		
		// env.portalOut.position.set( pickPos.x(), pickPos.y(), pickPos.z() );
	}

};


Weapon.prototype.restock = function( number ) {

	if( this.modelname === "flashlight" || this.modelname === "portalgun" ) { return; }

	env.sounds.sound3.play();
	this.magazines += number;

	// var element = msDiv;
	// element.classList.remove("animate");

	// // https://css-tricks.com/restart-css-animation/
	// // -> triggering reflow /* The actual magic */
	// // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
	// element.offsetWidth = element.offsetWidth;
	// // -> and re-adding the class
	// element.classList.add("animate");
	this.onChanged();

}

Weapon.prototype.shoot = function() {

	if ( this.reloading === true ) return;

	var delay = clock.elapsedTime - this.lastShotFired;
	
	// exit when fireing to fast
	if ( delay < this.shootDelay ) { return; }
	
	this.lastShotFired = clock.elapsedTime;

	// special case for portal gun

	if ( this.modelname === "portalgun" ) {
		
		var rayCallback = Ammo.Utils.btPickPos( 200 );

		if ( rayCallback ) {

			var pickPos = rayCallback.get_m_hitPointWorld();

			var body = rayCallback.get_m_collisionObject();
			if ( body ) {

				var far = 10,
					intersects = [],
					target,
					distance;

				var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3() );

				raycaster.set( camera.getWorldPosition(), camera.getWorldDirection() );
				intersects = raycaster.intersectObjects( portalMeshes );

				if ( intersects.length > 0 ) {

					target = intersects[ 0 ];

					// var position = new THREE.Vector3( pickPos.x(), pickPos.y(), pickPos.z() );
					var position = target.point;

					// position.add( target.face.normal.clone().multiplyScalar( env.portalIn.geometry.parameters.depth/2 ) );
					position.add( target.face.normal.clone().multiplyScalar( env.trigger1.mesh.geometry.parameters.depth/2 ) );

					env.portalIn.position.copy( position );
					env.portalIn.lookAt( position.clone().add( target.face.normal ) );

					// env.portalIn.updateMatrix();
					// env.portalIn.updateMatrixWorld();
					

					// env.trigger1.mesh.position.set( pickPos.x(), pickPos.y(), pickPos.z() );

				}

				// var pickedBody = body = Ammo.btRigidBody.prototype.upcast( body );
				// console.log("body upcast", pickedBody);
				// if ( pickedBody.mesh !== undefined ) {

				// }
			}

			this.shootSound.play();
		
			// Move trigger collision to where the player has shot
			// http://www.bulletphysics.org/Bullet/phpBB3/viewtopic.php?f=9&t=6252#p21881
			// btTransform transform = body -> getCenterOfMassTransform();
			// transform.setOrigin(new_position);
			// body -> setCenterOfMassTransform(transform);
			
			var transform = env.trigger1.getCenterOfMassTransform();
			transform.setOrigin( pickPos );

			// env.trigger1.setCenterOfMassTransform( transform ); //not necessary?!
		}
		return;
	}

	// usual guns

	if( this.currentCapacity > 0 ) {

		if( typeof this.emitterPool !== "undefined" ) {

			this.emitterPool.particleGroup.triggerPoolEmitter( 1 );
		}

		//shoot ray from camera 200 units far
		Ammo.Utils.btRaylgun( 200 );

		var btRayToPoint = camera.getWorldPosition().clone().add( camera.getWorldDirection().clone().multiplyScalar( 200 ) );
		
		var btRayFrom = new Ammo.btVector3( 
								camera.getWorldPosition().x, 
								camera.getWorldPosition().y, 
								camera.getWorldPosition().z 
								);

		var btRayTo = Ammo.Utils.createAmmoVector3FromThree( btRayToPoint );

		var rayCallback = Ammo.Utils.btRaycast( btRayFrom, btRayTo );
		
		if( rayCallback.hasHit() ){

			var collisionObject = rayCallback.get_m_collisionObject();

			if( collisionObject ){

				var pickPos = rayCallback.get_m_hitPointWorld();
				var normal = rayCallback.get_m_hitNormalWorld();

				var body = Ammo.btRigidBody.prototype.upcast( collisionObject );

				this.fireEffect( pickPos, normal, body );

			}
			
		}

		this.shootSound.play();

		// this.currentCapacity -= 1;
		this.alterCapacity( -1 );
		
	} else if( this.currentCapacity < 0 ) {

		// flashlight
		return;

	} else {

		this.reload();
		// this.emptySound.play();
	}

};

Weapon.prototype.fireEffect = function( ammoPoint, ammoNormal, body ) {

// function fireEffect( ammoPoint, ammoNormal, body ) {

  var normOffset = 0.05;
  var x = ammoPoint.getX() + ammoNormal.getX() * normOffset;
  var y = ammoPoint.getY() + ammoNormal.getY() * normOffset;
  var z = ammoPoint.getZ() + ammoNormal.getZ() * normOffset;

  if ( body.type === 'ball') {

    var effect = impactBall;

  } else if ( body.type === 'metall' ) {

    // Grab the last used particle system
    // currentSparkIndex = ( currentSparkIndex + 1 ) % impactSparks.length;
    // var effect = impactSparks[ currentSparkIndex ];
    var effect = sparks;

  } else if ( body.type === 'barrel' ) {

    barrelMesh.visible = false;
    dynamicsWorld.removeRigidBody( body );

    explosion.explosionEmitter.enable();
    explosion.projectileEmitter.enable();

    explosion.particleGroup.mesh.position.set( x, y, z );

    return;

  } else {

	var effect = puff;
	// Grab the last used particle system
	// currentPuffIndex = ( currentPuffIndex + 1 ) % impactPuffs.length;
	// var effect = impactPuffs[ currentPuffIndex ];
	effect.setNormal( ammoNormal.getX(), ammoNormal.getY(), ammoNormal.getZ() );
	effect.particleGroup.triggerPoolEmitter( 1, new THREE.Vector3(x, y, z) );
  	return;
  }

  // effect.particleGroup.mesh.position.set( x, y, z );
  effect.setNormal( ammoNormal.getX(), ammoNormal.getY(), ammoNormal.getZ() );

  effect.particleGroup.triggerPoolEmitter( 1, new THREE.Vector3(x, y, z) );
  // console.log("puff", puff);

  // Restart the particle effect
  // effect.emitter.reset( true );
  // effect.emitter.enable();

};

Weapon.prototype.reload = function() {

	// dont reload if he is alreay reloading or the magazine is full
	if ( this.reloading === true || this.maxCapacity === this.currentCapacity ) return;

	if ( this.magazines === 0 ) {
		
		this.emptySound.play( 0.1 )
		return;
	}
	
	this.reloading = true;

	// single shells reload
	if( this.modelname === "shotgun" ) {
		
		var toggle = 2;
		var time = 300;
		var missing = this.maxCapacity - this.currentCapacity;
		var that = this;

		// instant mag reduce on reload
		// or do it when finished reloading?
		this.magazines--; 

		var intervalHandle = setIntervalX ( function ( x ) {

			var origin = camera.getWorldPosition();
			origin.x += toggle;
			toggle *= -1;

			that.reloadSound.playAtWorldPosition( origin );
			
			// that.currentCapacity ++;
			that.alterCapacity( 1 );

			if ( that.currentCapacity === that.maxCapacity ) {
				that.reloading = false;
			}
			
			that.onChanged();

		}, time, missing );
	} 
	// magazines reload
	else {

		var that = this;

		this.reloadSound.play( 0.4 );

		setTimeout( function () { 
			
			that.magazines--;
			that.reloading = false;
			// that.currentCapacity = that.maxCapacity;
			that.alterCapacity( that.maxCapacity );
		
		}, that.reloadTime * 1000 );

	}

};

Weapon.prototype.alterCapacity = function ( howMuch )
{

	this.currentCapacity += howMuch;

	// this.capacity -= howMuch;
	if( this.currentCapacity < 0 ) 
	{
		this.currentCapacity = 0;
	}
	this.onChanged();

};

Weapon.prototype.setCallback = function ( scope, callbackFunction )
{

	this.scope = scope;
	this.callbackFunction = callbackFunction;

};


Weapon.prototype.onChanged = function () 
{

	if( this.scope != null )
	{
		this.callbackFunction.call( this.scope );
	}

};