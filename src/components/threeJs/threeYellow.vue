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
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );

            var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
            camera.position.set( 0, 0, 100 );
            camera.lookAt( 0, 0, 0 );

            var scene = new THREE.Scene();

            var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

            var geometry = new THREE.TextGeometry();
            geometry.addShape()
            // geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
            // geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
            // geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );

            var line = new THREE.Line( geometry, material );

            scene.add( line );
            renderer.render( scene, camera );
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
