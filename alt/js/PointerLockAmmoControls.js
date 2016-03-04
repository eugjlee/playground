/**
 * 
 */
 
THREE.PointerLockAmmoControls = function ( camera, player ) {

	var scope = this;

	var player = player;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	// Y-Rotation is set to the player mesh which the pitchObject is added to
	// var yawObject = new THREE.Object3D();
	// yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	this.enabled = false;
	var yRotation = pitchObject.rotation.y;

	this.forward = false;
	this.back = false;
	this.left = false;
	this.right = false;
	this.spacebar = false;
	this.shift = false;
	
	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		// yawObject.rotation.y -= movementX * 0.002;
		yRotation -= movementX * 0.002;

		pitchObject.rotation.x -= movementY * 0.002;
		// limit movement
		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onMouseDown = function ( event ) {
		event.preventDefault();
		if ( scope.enabled === false ) return;
		
			switch ( event.button ) {

				case 0:
					// env.player.LMB();
					player.LMB();
					break;
				case 1:
				case 2:
					// env.player.RMB();
					player.RMB();
					break;
			}
			
	}
	
	function MouseWheelHandler(e) {

		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max( -1, Math.min( 1, ( e.wheelDelta || -e.detail ) ) );
		
		// env.player.selectWeapon( delta );
		player.selectWeapon( delta );

		return false;
	}

	var onKeyDown = function ( event ) {
	// console.log(event.keyCode);
		switch ( event.keyCode ) {

			case 70: //f
				slowmo = !slowmo;
				break;

			case 9: //tabulator
				event.preventDefault();
				// var x = document.getElementById("centerDiv");
				centerDiv.style.cssText="visibility:visible;"
				break;

			case 38: // up
			case 87: // w
				scope.forward = true;
				// moveForward = true;
				break;

			case 37: // left
			case 65: // a
				scope.left = true;
				// moveLeft = true; 
				break;

			case 40: // down
			case 83: // s
				scope.back = true;
				break;

			case 39: // right
			case 68: // d
				scope.right = true;
				// moveRight = true;
				break;

			case 32: // space
				scope.spacebar = true;
				break;
				
			case 16: // shift
				scope.shift = true;
				break;				
				
			case 70: // f
				// fullscreen();
				break;			
				
			case 69: // e
				// env.player.action();
				player.action();
				// action.call( this );
				break;
				
			case 81: // q
				moonPhysics(); //various.js
				break;
				
			case 82: // r
				// env.player.currentWeapon.reload();
				player.currentWeapon.reload();
				break;
				
			case 49: //1
				selectWeapon( 0 );
				break;

			case 50: //2
				selectWeapon( 1 );
				break;

			case 51: //3
				selectWeapon( 2 );
				break;		

			case 52: //4
				selectWeapon( 3 );
				break;
		}

	};

	var onKeyUp = function ( event ) {
	
		switch( event.keyCode ) {

			case 9: // tab
				centerDiv.style.cssText="visibility:hidden;"
				break;

			case 38: // up
			case 87: // w
				scope.forward = false;
				// moveForward = false;
				break;

			case 37: // left
			case 65: // a
				scope.left = false;
				// moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				scope.back = false;
				// moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				scope.right = false;
				// moveRight = false;
				break;
				
			case 16: // shift
				scope.shift = false;
				// scope.shift = false;
				break;
				
			case 32: // space
				break;
				
			case 69: //e
				// env.player.toggle = false;
				player.toggle = false;
				break;

		}

	};


	if ( document.addEventListener ) {
	// IE9, Chrome, Safari, Opera
		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mousedown', onMouseDown, false );
		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );

		document.addEventListener("mousewheel", MouseWheelHandler, false);
	// Firefox
		document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	// IE 6/7/8
	else document.attachEvent("onmousewheel", MouseWheelHandler);

	this.getObject = function () {

		return pitchObject;
		// return yawObject;

	};

	this.getYRotation = function () {
		return yRotation;
	}

};
