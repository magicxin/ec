<template>
	<section id="sg_goods_panorama">
	  <icar-header bgColor="#fff" mainText="商品全景图" textColor="#474747">
	    <img :src="iconPath" @click="$router.replace({name:'sg_goods_car'})">
	  </icar-header>
	  <mu-tabs :value="selectedTab" @change="tabChange">
	    <mu-tab value="panorama" title="内景"/>
	    <mu-tab value="picture" title="外景"/>
	    <mu-tab value="trydrive" title="试驾"/>
	  </mu-tabs>
      <div ref="outside"></div>
	</section>
</template>

<script>
    import IcarHeader from 'components/my-header'
    import iconPath from 'assets/left-gray.svg'
    import sides from 'services/car-inside-pictures.js'

    import front from 'assets/img/img/front.jpg'
    import right from 'assets/img/img/right.jpg'
    import top from 'assets/img/img/top.jpg'
    import bottom from 'assets/img/img/bottom.jpg'
    import end from 'assets/img/img/end.jpg'
    import left from 'assets/img/img/left.jpg'

    import * as THREE from 'services/three/three.js'
    import css3dRenderer from 'services/three/CSS3DRenderer.js'
    import PhotoSphereViewer from 'services/three/photo-sphere-viewer.js'
//    console.log(left)
    export default {
        components: {
            IcarHeader
        },
        data() {
            return {
                iconPath: iconPath,
                selectedTab: 'panorama',
                sides : [{
                        url: front,
                        position: [-512, 0, 0],
                        rotation: [0, Math.PI / 2, 0]
                    },
                    {
                        url: right,
                        position: [512, 0, 0],
                        rotation: [0, -Math.PI / 2, 0]
                    },
                    {
                        url: top,
                        position: [0, 512, 0],
                        rotation: [Math.PI / 2, 0, Math.PI]
                    },
                    {
                        url: bottom,
                        position: [0, -512, 0],
                        rotation: [-Math.PI / 2, 0, Math.PI]
                    },
                    {
                        url: end,
                        position: [0, 0, 512],
                        rotation: [0, Math.PI, 0]
                    },
                    {
                        url: left,
                        position: [0, 0, -512],
                        rotation: [0, 0, 0]
                    }
                ],
//                sides: sides.map((side) => {
//                    side.url = require(side.url)
//                    return side
//                }),
                renderer: ''
            }
        },
        methods: {
            tabChange(selectedTab) {
                this.selectedTab = selectedTab
                switch (selectedTab) {
                    case 'panorama':
                        this.renderer.domElement.className = "";
                        this.$refs.outside.style.display = "none";
                        break;

                    case 'picture':
                        this.renderer.domElement.className = "hide";
                        this.$refs.outside.style.display = "block";
                        // Load the predefined panorama
                        // evt.preventDefault();
                        console.log(PhotoSphereViewer)
                        var div = this.$refs.outside;

                        var PSV = new PhotoSphereViewer({
                            // Path to the panorama
                            panorama: '../../static/img/city.jpg',

                            // Container
                            container: div,

                            // Deactivate the animation
                            time_anim: false,

                            // Display the navigation bar
                            navbar: true,

                            // Resize the panorama
                            size: {
                                width: '100%',
                                height: window.innerHeight - 100
                            }
                        });
                        break;

                    case 'trydrive':
                        this.renderer.domElement.className = "hide";
                        this.$refs.outside.style.display = "none";
                        break;

                    default:
                        this.renderer.domElement.className = "";
                        this.$refs.outside.style.display = "none";
                        break;
                }
            }
        },
        created() {
            var that = this;
            var camera, scene;
            var geometry, material, mesh;
            var target = new THREE.Vector3();

            var lon = 90,
                lat = 0;
            var phi = 0,
                theta = 0;

            var touchX, touchY;

            console.log(this.sides)
            init();
            animate();

            function init() {

                camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 100), 1, 1000);

                scene = new THREE.Scene();



                for (var i = 0; i < that.sides.length; i++) {

                    var side = that.sides[i];

                    var element = document.createElement('img');
                    element.width = 1026; // 2 pixels extra to close the gap.
                    element.src = side.url;

                    var object = new THREE.CSS3DObject(element);
                    object.position.fromArray(side.position);
                    object.rotation.fromArray(side.rotation);
                    scene.add(object);

                }

                that.renderer = new THREE.CSS3DRenderer();
                that.renderer.setSize(window.innerWidth, window.innerHeight - 100);
                document.body.appendChild(that.renderer.domElement);
                //

                document.addEventListener('mousedown', onDocumentMouseDown, false);
                document.addEventListener('wheel', onDocumentMouseWheel, false);

                document.addEventListener('touchstart', onDocumentTouchStart, false);
                document.addEventListener('touchmove', onDocumentTouchMove, false);

                window.addEventListener('resize', onWindowResize, false);

            }

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                that.renderer.setSize(window.innerWidth, window.innerHeight);

            }

            function onDocumentMouseDown(event) {

                event.preventDefault();

                document.addEventListener('mousemove', onDocumentMouseMove, false);
                document.addEventListener('mouseup', onDocumentMouseUp, false);

            }

            function onDocumentMouseMove(event) {

                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                lon -= movementX * 0.1;
                lat += movementY * 0.1;

            }

            function onDocumentMouseUp(event) {

                document.removeEventListener('mousemove', onDocumentMouseMove);
                document.removeEventListener('mouseup', onDocumentMouseUp);

            }

            function onDocumentMouseWheel(event) {

                if (camera.fov > 65 && camera.fov < 120) {
                    camera.fov += event.deltaY * 0.05;
                }
                if (camera.fov === 65 && camera.fov < 120 && event.deltaY > 0) {
                    camera.fov += event.deltaY * 0.05;
                }
                if (camera.fov === 120 && camera.fov > 65 && event.deltaY < 0) {
                    camera.fov += event.deltaY * 0.05;
                }
                camera.updateProjectionMatrix();

            }

            function onDocumentTouchStart(event) {
                event.preventDefault();

                var touch = event.touches[0];

                touchX = touch.screenX;
                touchY = touch.screenY;

            }

            function onDocumentTouchMove(event) {

                event.preventDefault();

                var touch = event.touches[0];

                lon -= (touch.screenX - touchX) * 0.1;
                lat += (touch.screenY - touchY) * 0.1;

                touchX = touch.screenX;
                touchY = touch.screenY;

            }

            function animate() {

                requestAnimationFrame(animate);

                lon += 0.1;
                lat = Math.max(-85, Math.min(85, lat));
                phi = THREE.Math.degToRad(90 - lat);
                theta = THREE.Math.degToRad(lon);

                target.x = Math.sin(phi) * Math.cos(theta);
                target.y = Math.cos(phi);
                target.z = Math.sin(phi) * Math.sin(theta);

                camera.lookAt(target);
                that.renderer.render(scene, camera);

            }
        }
    }

</script>

<style lang="scss">
    @import "../../scss/theme.scss";
    #sg_goods_panorama {
        .mu-tabs {
            background: $gray-bg;
        }
    }
    
    .hide {
        display: none;
    }

</style>
