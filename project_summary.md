# Project Title
Subway Stories

## Authors
- Jeff Ong, [GitHub](http://www.github.com/jffng "GitHub")
- Alon Chitayat, [GitHub](http://www.github.com/animishmish "GitHub")

## Description
Living in New York City, many of us spend hours a day below ground; millions of people commute via the subway — an apparently “interactive” experience if you stop to consider the potential collisions. But if you’ve spent significant time on subways, you begin to realize it’s often an isolating experience. Subways are one the last frontiers where cell phone service and networks are still absent, leaving its inhabitants to their own conversations, music, and inner-thoughts. 

“Subway Stories” invites users to reconsider the ordinary experience of commuting. Our role as artists and technologists is to blend traditional media (sound, moving image) with new technology, pushing the boundaries of storytelling. Our hope is to create an intimate experience between the user and the subway, but more importantly between passengers — bridging the gap between the isolating experience of public spaces with the power of stories.

## Link to Prototype
[Subway Stories](http://www.jffng.com/subway-stories/ "Subway Stories Home")

## Example Code using THREE.js
```
function init() {
	// camera 
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000); 
    // camera.position.y = -250; 
    camera.position.z = 1500; 

    // scene 
    scene = new THREE.Scene();

    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map:THREE.ImageUtils.loadTexture('img/subway_car.png')
    });
    img.map.needsUpdate = true; //ADDED
    img.transparent = true;

    // plane
    var subwayMesh = new THREE.Mesh(new THREE.PlaneGeometry(2700, 397),img);
    // plane.overdraw = true;
    scene.add(subwayMesh);

    for (var i = 1; i < 25; i++){
        passengers(i);
    }

    var geometry = new THREE.PlaneGeometry(5000, 800);
    var material = new THREE.MeshBasicMaterial( {color: 0x222222} );
    var background = new THREE.Mesh( geometry, material );
    scene.add(background);
    background.position.z = -100;
	background.position.y = 100;

     // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    // add directional light source
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // create wrapper object that contains three.js objects
    var three = {
        renderer: renderer,
        camera: camera,
        scene: scene,
        subway_car: subwayMesh
    };

    window.addEventListener( 'resize', onWindowResize, false );
}
```

## Links to External Libraries
[CNMAT](http://archive.cnmat.berkeley.edu/OpenSoundControl/ "OSC / CNMAT")
[Processing](http://processing.org/ "Processing")

## Images & Videos
http://www.youtube.com/watch?v=sxP2EPP9d3g