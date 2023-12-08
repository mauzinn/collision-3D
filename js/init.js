import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'
import * as CANNON from 'https://cdn.skypack.dev/cannon-es'

const init = () => {


    //Physics
        const world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.81, 0)
        })

        const distorcion = 3 / 1.36
    
    

    //Configuration
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
        let loader = new GLTFLoader()

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize( window.innerWidth, window.innerHeight )
        document.body.appendChild( renderer.domElement )

        camera.position.z = 8
        camera.position.y = 8
        

        camera.lookAt(scene.position)



    //Lights
        //ambient
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
            scene.add(ambientLight)

        //Directional
            const Light = new THREE.DirectionalLight(0xffffff, 1.3)
            Light.position.set(2, 5, 8)

            scene.add(Light)




    //Map
        //Box
            const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
            const boxMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/box.jpeg') })
            const box = new THREE.Mesh(boxGeometry, boxMaterial)

            const boxBody = new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
                mass: 1,
                position: new CANNON.Vec3(0, 10, 0)
            })


        //Ground
            const groundGeometry = new THREE.BoxGeometry(10, 1, 10)
            const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xFF000, wireframe: true })
            const ground = new THREE.Mesh(groundGeometry, groundMaterial)

            const groundBody = new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(10 / distorcion, 1 / distorcion, 10 / distorcion)),
                type: CANNON.Body.STATIC,
                position: new CANNON.Vec3(0, -3, 0)
            })

        //Player
            let player
            let animation = 2
            let newAnim = false
            let inAnim = false
            let stopped = false

            loader.load('models/Xbot.glb', (gltf) => {
                player = gltf.scene

                let Clock = new THREE.Clock()
                const mixer = new THREE.AnimationMixer(gltf.scene)
                let action = mixer.clipAction(gltf.animations[animation])
                action.play()

                document.addEventListener('keydown', () => {
                    if (!inAnim) {
                        stopped = false
                        inAnim = true
                        animation = 3
                        newAnim = true
                    }
                })

                document.addEventListener('keyup', () => {
                    if (!stopped) {
                        stopped = true
                        inAnim = false
                        animation = 2
                        newAnim = true
                    }
                })

                function load() {
                    requestAnimationFrame(load)
    
                    if (newAnim) {
                        newAnim = false
                        action.stop()
                        action = mixer.clipAction(gltf.animations[animation])
                        action.play()
                    }

                    mixer.update(Clock.getDelta())
                }
    
                load()
    

                player.scale.set(1.2, 1.2, 1.2)

                scene.add(player)
            })

            const playerBody = new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(1 / distorcion, 3 / distorcion, 1 / distorcion)),
                mass: 87,
                position: new CANNON.Vec3(3, 6, 4)
            })





    //Render Map
        scene.add(box, ground)
        world.addBody(boxBody)
        world.addBody(playerBody)
        world.addBody(groundBody)





    //Load
        function Load() {
            requestAnimationFrame( Load )

            world.step(1 / 60)

            box.position.copy(boxBody.position)
            box.quaternion.copy(boxBody.quaternion)

            ground.position.copy(groundBody.position)
            ground.quaternion.copy(groundBody.quaternion)

            player.position.copy(playerBody.position)
            player.quaternion.copy(playerBody.quaternion)

            if (playerPosition.d) {
                playerBody.position.x += 0.05
                player.rotation.y += 1.6
            } else if (playerPosition.a) {
                playerBody.position.x += -0.05
                player.rotation.y += -1.6
            } else if (playerPosition.w) {
                playerBody.position.z += -0.05
                player.rotation.y += -3.2
            } else if (playerPosition.s) {
                playerBody.position.z += 0.05
            }

            renderer.render( scene, camera )
        }

        Load()



}


window.addEventListener('load', init())