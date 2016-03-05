/**
 * Setup the control method
 */
define([ "three", "camera", "container", "scene" ], function ( THREE, camera, container, scene ) {

    // 'use strict';

	// CONTROLS

	var controls = new THREE.OrbitControls( camera, container );
	controls.rotateSpeed = 0.10;
	controls.enableDamping = true;
	controls.dampingFactor = 0.15;

	// controls.minPolarAngle = -Math.PI*.85; 
	// controls.maxPolarAngle = Math.PI*.55;
	controls.minDistance = 0.50;
	controls.maxDistance = 10;

	controls.target.copy( new THREE.Vector3( 0, 0.1, 0 ) );

	// set Reset Values
	controls.target0 = controls.target.clone();
	controls.position0 = camera.position.clone();
	controls.zoom0 = camera.zoom;

	// http://www.w3schools.com/cssref/playit.asp?filename=playcss_cursor&preval=alias
	container.style.cursor = "grab";
	// chrome
	container.style.cursor = "-webkit-grab";

	// controls.constraint.dollyIn( 1.3 );
	// controls.enablePan = false;
	// controls.enableKeys = false;
	// controls.zoomSpeed	= 0.3;

	// smooth Zoom
	// controls.constraint.smoothZoom = true;
	// controls.constraint.zoomDampingFactor = 0.2;
	// controls.constraint.smoothZoomSpeed = 2.0;

	// controls.target.set( 0, 10, 0 );

	mcontrols = new MultiControls( scene, controls, camera, container );

	// TODO
	// clean up these global vars
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var canJump = false;

	function MultiControls( scene, controls, camera1, domElement ) {

		var multiControls = this;

		this._controls = controls;
		this._camera = camera1;

		this.domElement = ( domElement !== undefined ) ? domElement : document;
		this.objects = [[]];
		
		this._pointerLockControlsEnabled = false;

		this._velocity = new THREE.Vector3();
		this._raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 2 );

		// var blocker = document.getElementById( 'blocker' );
		// var instructions = document.getElementById( 'instructions' );

		var onKeyDown = function ( event ) {
			// console.log( event.keyCode );
			switch ( event.keyCode ) {

				case 77: //m
					this.lockPointer();
					break;
			}
		}

		document.addEventListener( 'keydown', onKeyDown.bind( this ), false );

		function activateFPSControls( camera ) {

			camera.position.set( 0, 0, 0 );
			multiControls._controls = new THREE.PointerLockControls( camera );
			multiControls._controls.getObject().position.set( 0, 2, -5 );
			multiControls._controls.getObject().rotation.y = - 180 * Math.PI / 180;
			// controls.getObject().position.copy( prevCamera.getWorldPosition() );
			scene.add( multiControls._controls.getObject() );

			multiControls._pointerLockControlsEnabled = true;
			multiControls._controls.enabled = true;

			// blocker.style.display = 'none';

			var onKeyDown = function ( event ) {

				switch ( event.keyCode ) {

					case 38: // up
					case 87: // w
						moveForward = true;
						break;

					case 37: // left
					case 65: // a
						moveLeft = true; break;

					case 40: // down
					case 83: // s
						moveBackward = true;
						break;

					case 39: // right
					case 68: // d
						moveRight = true;
						break;

					case 32: // space
						if ( canJump === true ) multiControls._velocity.y += 30;
						canJump = false;
						break;

					case 77: //m
						// multiControls.lockPointer();
						break;

				}

			};

			var onKeyUp = function ( event ) {

				switch( event.keyCode ) {

					case 38: // up
					case 87: // w
						moveForward = false;
						break;

					case 37: // left
					case 65: // a
						moveLeft = false;
						break;

					case 40: // down
					case 83: // s
						moveBackward = false;
						break;

					case 39: // right
					case 68: // d
						moveRight = false;
						break;

				}

			};

			document.addEventListener( 'keydown', onKeyDown.bind( this ), false );
			document.addEventListener( 'keyup', onKeyUp, false );

		}

		function activateOrbitControls( camera ) {

			// dont pollute the scene
			// clean up the last controls object
			scene.remove( multiControls._controls.getObject() );

			// controls.enabled = false;
			multiControls._pointerLockControlsEnabled = false;
			// camera.position.z -= 5;
			// camera.position.y += 2;
			// camera.position.x = 0;
			// camera.position.z = 5;
			// camera.position.y = 2;
			// console.log( multiControls._controls.getObject().getWorldPosition() );
			var position = multiControls._controls.getObject().getWorldPosition();
			position.y -= 2;
			camera.position.y = 5;
			multiControls._controls = new THREE.OrbitControls( camera, multiControls.domElement );
			multiControls._controls.target.copy( position );
			// blocker.style.display = '-webkit-box';
			// blocker.style.display = '-moz-box';
			// blocker.style.display = 'box';

			// instructions.style.display = '';
		}

		// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

		if ( havePointerLock ) {

			var element = document.body;

			var pointerlockchange = function ( event ) {

				console.log("pointerLockChange");

				var prevCamera = multiControls._camera;
				var aspect = prevCamera.aspect;
				var view_angle = prevCamera.fov;
				var near = prevCamera.near;
				var far = prevCamera.far;

				// var screen_width = window.innerWidth;
				// var screen_height = window.innerHeight;
				// var aspect = screen_width / screen_height;
				// var view_angle = 60;
				// var near = 0.1;
				// var far = 1000;

				multiControls._camera = new THREE.PerspectiveCamera( view_angle, aspect, near, far );

				multiControls._camera.position.copy( prevCamera.getWorldPosition() );
				multiControls._camera.rotation.copy( prevCamera.getWorldRotation() );

				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
					// pointerlock enabled and fullscreen
					activateFPSControls( multiControls._camera );
				} else {
					// pointerlock released
					activateOrbitControls( multiControls._camera );
				}
				// multiControls.onChanged();			

			};

			var pointerlockerror = function ( event ) {

				// instructions.style.display = '';

			};

			// Hook pointer lock state change events
			document.addEventListener( 'pointerlockchange', pointerlockchange, false );
			document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
			document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

			document.addEventListener( 'pointerlockerror', pointerlockerror, false );
			document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
			document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

			this.lockPointer = function() {
				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

				if ( /Firefox/i.test( navigator.userAgent ) ) {

					var fullscreenchange = function ( event ) {

						if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

							document.removeEventListener( 'fullscreenchange', fullscreenchange );
							document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

							element.requestPointerLock();
						}

					};

					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

					element.requestFullscreen();

				} else {

					element.requestPointerLock();

				}

			};

		/*
			instructions.addEventListener( 'click', function ( event ) {

				instructions.style.display = 'none';

				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

				if ( /Firefox/i.test( navigator.userAgent ) ) {

					var fullscreenchange = function ( event ) {

						if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

							document.removeEventListener( 'fullscreenchange', fullscreenchange );
							document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

							element.requestPointerLock();
						}

					};

					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

					element.requestFullscreen();

				} else {

					element.requestPointerLock();

				}

			}, false );
		*/

		} else {

			instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

		}

	}

	MultiControls.prototype.update = function( delta ) {

		if ( this._pointerLockControlsEnabled ) {

			var controls = this._controls;
			var velocity = this._velocity;
			var raycaster = this._raycaster;

			raycaster.ray.origin.copy( controls.getObject().position );
			raycaster.ray.origin.y -= 1;

			var intersections = raycaster.intersectObjects( this.objects[0] );

			var isOnObject = intersections.length > 0;

			// var isOnObject = true;

			// var time = performance.now();
			// var delta = ( time - prevTime ) / 1000;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;

			// velocity.y -= 1.1 * 800.0 * delta; // 100.0 = mass
			velocity.y -= 1.0 * 100.0 * delta; // 100.0 = mass

			var speed = 100.0;

			if ( moveForward ) velocity.z -= speed * delta;
			if ( moveBackward ) velocity.z += speed * delta;

			if ( moveLeft ) velocity.x -= speed * delta;
			if ( moveRight ) velocity.x += speed * delta;

			if ( isOnObject === true ) {
				velocity.y = Math.max( 0, velocity.y );

				canJump = true;
			}

			controls.getObject().translateX( velocity.x * delta );
			controls.getObject().translateY( velocity.y * delta );
			controls.getObject().translateZ( velocity.z * delta );

			if ( controls.getObject().position.y < 2 ) {

				velocity.y = 0;
				controls.getObject().position.y = 2;

				canJump = true;

			}

			// prevTime = time;

		}
		else {
			this._controls.update();
		}

	};

    return mcontrols;
});