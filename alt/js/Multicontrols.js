// replaced by clock.dt
// var prevTime = performance.now();

// TODO
// clean up these global vars
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

function Multicontrols( scene, controls, camera, domElement ) {

	var multiControls = this;

	this._controls = controls;
	this._camera = camera;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	this.objects = [];
	
	this._pointerLockControlsEnabled = false;
	this._fpsControlsEnabled = false;

	this._velocity = new THREE.Vector3();
	this._raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 2 );

	var onKeyDown = function ( event ) {
		// console.log( event.keyCode );
		switch ( event.keyCode ) {

			case 77: //m
				this.lockPointer();
				break;
			case 69: //e
				this._fpsControlsEnabled = true;
				this.ammoControls();
				this.lockPointer();
				break;
		}
	}

	document.addEventListener( 'keydown', onKeyDown.bind( this ), false );

	this.ammoControls = function() {

		multiControls._camera.position.set( 0, 0, 0 );
		var player = {};
		var controls = new THREE.PointerLockAmmoControls( multiControls._camera, player );
		//look at stuff that happens in the scene, not at the wall you #!@*%
		// controls.getObject().rotation.set(0, Math.PI/2, 0);

		//controls nach init wieder disablen, dass man nicht ohne pointerlock steuern kann
		controls.enabled = true;

		// FPS Controls requires an ammo world
		var radius = 0.4;
		var height = 1.8;
		var eyeheight = 1.6;
		var visualizePlayer = true;

		this.fps = new FPSMover( scene, controls, physicWorld, { radius: radius, height: height, eyeheight: eyeheight, visualizePlayer: visualizePlayer } );

	};


	this.transformControls = function() {

		multiControls._controls = new THREE.TransformControls( camera, this.domElement );
		var control = multiControls._controls;

		var mesh = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1) );
		scene.add( mesh );
		control.attach( mesh );
		scene.add( control );

		document.addEventListener( 'keydown', function ( event ) {

			switch ( event.keyCode ) {

				case 81: // Q
					control.setSpace( control.space === "local" ? "world" : "local" );
					break;

				case 17: // Ctrl
					control.setTranslationSnap( 100 );
					control.setRotationSnap( THREE.Math.degToRad( 15 ) );
					break;

				case 87: // W
					control.setMode( "translate" );
					break;

				case 69: // E
					control.setMode( "rotate" );
					break;

				case 82: // R
					control.setMode( "scale" );
					break;

				case 187:
				case 107: // +, =, num+
					control.setSize( control.size + 0.1 );
					break;

				case 189:
				case 109: // -, _, num-
					control.setSize( Math.max( control.size - 0.1, 0.1 ) );
					break;

			}

		});

		document.addEventListener( 'keyup', function ( event ) {

			switch ( event.keyCode ) {

				case 17: // Ctrl
					control.setTranslationSnap( null );
					control.setRotationSnap( null );
					break;

			}

		});


	};

	// var blocker = document.getElementById( 'blocker' );
	// var instructions = document.getElementById( 'instructions' );

	// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	if ( havePointerLock ) {

		var element = document.body;

		var pointerlockchange = function ( event ) {


			
			if ( multiControls._fpsControlsEnabled ) {

			} else {

			console.log("pointerLockChange");

			var prevCamera = multiControls._camera;

			// var aspect = prevCamera.aspect;
			// var view_angle = prevCamera.fov;
			// var near = prevCamera.near;
			// var far = prevCamera.far;

			// multiControls._camera = new THREE.PerspectiveCamera( view_angle, aspect, near, far );

			var screen_width = window.innerWidth;
			var screen_height = window.innerHeight;
			var aspect = screen_width / screen_height;
			var view_angle = 60;
			var near = 0.1;
			var far = 1000;
			
			multiControls._camera = new THREE.PerspectiveCamera( view_angle, aspect, near, far );

			multiControls._camera.position.copy( prevCamera.getWorldPosition() );
			multiControls._camera.rotation.copy( prevCamera.getWorldRotation() );

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

				multiControls._camera.position.set( 0, 0, 0 );
				multiControls._controls = new THREE.PointerLockControls( multiControls._camera );
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

			} else {

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
				multiControls._controls = new THREE.OrbitControls( multiControls._camera, multiControls.domElement );

				// blocker.style.display = '-webkit-box';
				// blocker.style.display = '-moz-box';
				// blocker.style.display = 'box';

				// instructions.style.display = '';

			}

			multiControls.onChanged();

		}
		

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

Multicontrols.prototype.update = function( delta ) {

	if ( this._fpsControlsEnabled ) {
		this.fps.prerender();
	}

	else if ( this._pointerLockControlsEnabled ) {

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

Multicontrols.prototype.setCallback = function ( scope, callbackFunction )
{

	this.scope = scope;
	this.callbackFunction = callbackFunction;

};


Multicontrols.prototype.onChanged = function () 
{

	if( this.scope != null )
	{
		this.callbackFunction.call( this.scope );
	}

};