/**
 * Core application handling
 * Initialize Viewer
 */
define([
    "three",
    "TWEEN",
    "scene",
    "camera",
    "renderer",
    "controls",
    "stats",
    "debugGUI",
    "tweenHelper",
    "skycube",
    "clock"
    ,"loadingScreen"
    ,"jquery"
], function ( 
             THREE, 
             TWEEN, 
             scene, 
             camera, 
             renderer, 
             controls, 
             stats, 
             debugGUI, 
             tweenHelper, 
             skycube,
             clock
             ,loadingScreen
             ,$
             ) {
	
	'use strict';

	// Start program
    var initialize = function () {

		// INITIAL CAMERA POSITION AND TARGET
		camera.position.set( 0, 0.2, -2 );

	
		// GRID FOR ORIENTATION
		var gridXZ = new THREE.GridHelper( 1, 0.1 );
		gridXZ.setColors( new THREE.Color( 0xff0000 ), new THREE.Color( 0xffffff ) );
		scene.add(gridXZ);
		gridXZ.position.y = 0;
		gridXZ.visible = true;

		// DEBUG GUI
        var dg = debugGUI;
		dg.add( gridXZ, "visible" ).name("Show Grid");

		/*
		var name = "Environment";
		if ( dg.__folders[ name ] ) {
			var folder = dg.__folders[ name ];
		} else {
			var folder = dg.addFolder( name );
		}
		*/

		var options = {
			reset: function() { 
				tweenHelper.resetCamera( 600 );
			}
		};
		dg.add( options, "reset" ).name("Reset Camera");

		// DEBUG GUI

		$(loadingScreen).fadeOut();
		animate();
	};

	var delta = 0;
	// MAIN LOOP
    var animate = function () {

    	delta = clock.getDelta();

		TWEEN.update();
		controls.update( delta );
		stats.update();

		skycube.update( controls._camera, renderer );
		renderer.render( scene, controls._camera );

		requestAnimationFrame( animate );

    };

    return {
        initialize: initialize,
        // animate: animate
    }
});