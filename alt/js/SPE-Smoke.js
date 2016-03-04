// Create particle group and emitter
function SPESmoke() {

	// var texture = THREE.ImageUtils.loadTexture('shared/images/particles/cloudSml.png');
	// texture.magFilter = THREE.LinearMipMapLinearFilter;
	// texture.minFilter = THREE.LinearMipMapLinearFilter;

	var loader = new THREE.TextureLoader();
	var url = 'assets/images/particles/cloudSml.png';
	var texture = loader.load( url );
	
	// CRASHSITE
	
	var particleGroup = new SPE.Group({
		texture: {
			value: texture
		},
		// blending: THREE.AdditiveBlending,
		blending: THREE.NormalBlending, // THATS IT MOTHERFUCKERS
	});

	var emitter = new SPE.Emitter({
	
		// type: SPE.distributions.BOX,
		maxAge: { value: 15 },
		position: { 
			value: new THREE.Vector3( 0, 0, 0 ),
			spread: new THREE.Vector3( 0.8, 0.4, 1.5 ),
		},
		size: {
			value: [ 2, 8 ],
			spread: [ 0, 1, 2 ]
		},
		
		acceleration: {
			value: new THREE.Vector3( 0, 0.01, 0 ),
		},
		rotation: {
			axis: new THREE.Vector3( 0, -1, 0 ),
			// axis: new THREE.Vector3( 0, 1, 0 ),
			spread: new THREE.Vector3( 0, 20, 0 ),
			angle: 100 * Math.PI / 180,
			// static: true
		},
		velocity: {
			value: new THREE.Vector3( 0, 0.5, -0.5 ),
			spread: new THREE.Vector3( 0.25, 0.1, 0.25 )
		},

		opacity: {
			value: [ 0.0, 0.5, 0 ]
		},

		color: {
			value: [ new THREE.Color( 0x333333 ), new THREE.Color( 0x111111 ) ],
			spread: [ new THREE.Vector3( 0.2, 0.1, 0.1 ), new THREE.Vector3( 0, 0, 0 ) ]
		},

		particleCount: 600,
		// duration: .025
	});

	particleGroup.addEmitter( emitter );

	// Workaround for frustum culling
	// https://github.com/squarefeet/ShaderParticleEngine/issues/51#issuecomment-61577200
	var radius = 15; //the joy of treakable parameter!
	particleGroup.mesh.geometry.computeBoundingSphere();
	particleGroup.mesh.geometry.boundingSphere.radius = radius;
	// var helper = new THREE.Mesh( new THREE.SphereBufferGeometry( radius ), new THREE.MeshBasicMaterial ( { wireframe: true } ) );
	// scene.add( helper );
	return particleGroup;
	
}