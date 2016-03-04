function pointerLock() {

// var blocker = document.getElementById( 'blocker' );
// var instructions = document.getElementById( 'instructions' );

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

	var element = document.body;

	var pointerlockchange = function ( event ) {

		var prevCamera = camera;

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.copy( prevCamera.getWorldPosition() );
		camera.rotation.copy( prevCamera.getWorldRotation() );

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			console.log("switching to PLC");
			camera.position.set( 0, 0, 0 );
			controls = new THREE.PointerLockControls( camera );
			controls.getObject().position.set( 0, 2, -5 );
			controls.getObject().rotation.y = - 180 * Math.PI / 180;
			// controls.getObject().position.copy( prevCamera.getWorldPosition() );
			scene.add( controls.getObject() );

			controlsEnabled = true;
			controls.enabled = true;

			// blocker.style.display = 'none';


		} else {

			console.log("switching to OCC");
			// controls.enabled = false;
			controlsEnabled = false;
			// camera.position.z -= 5;
			// camera.position.y += 2;
			// camera.position.x = 0;
			// camera.position.z = 5;
			// camera.position.y = 2;
			controls = new THREE.OrbitControls( camera );

			// blocker.style.display = '-webkit-box';
			// blocker.style.display = '-moz-box';
			// blocker.style.display = 'box';

			// instructions.style.display = '';

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

	}
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