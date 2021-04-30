<template>
<div id="container">
    <div id="info"></div>
</div>
</template>

<script>
    import * as THREE from 'three'
    // import WEBGL from 'webgl'
    export default {
        name: "threeYellow",
        mounted(){
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight,false);
            document.body.appendChild( renderer.domElement );

            //-.-.-.-.-.-
            // const geometry = new THREE.BoxGeometry(1, 1, 1);
            // const material = new THREE.MeshBasicMaterial({color: 0X00ff00});
            // const cube = new THREE.Mesh(geometry, material);
            // scene.add( cube );

            //create a blue LineBasicMaterial
            var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

            var geometry = new THREE.BoxGeometry();
            // geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
            // geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
            // geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );

            var line = new THREE.Line( geometry, material );

            scene.add( line );
            renderer.render( scene, camera );

            new THREE.TextGeometry('',)

            //-.-.-.-.-.-
            // function animate() {
            //     requestAnimationFrame( animate );
            //     // cube.rotation.x += 0.01;
            //     // cube.rotation.y += 0.01;
            //     renderer.render( scene, camera );
            // }

            // if (WEBGL.isWebGLAvailable()) {
                // Initiate function or other initializations here
                // animate();
            // } else {
            //     const warning = WEBGL.getWebGLErrorMessage();
            //     document.getElementById('container').appendChild(warning);
            // }
        }
    }
</script>

<style scoped>

    body { margin: 0; }
    canvas { width: 100%; height: 100% }

    #info {
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
        z-index: 100;
        display:block;
    }
</style>
