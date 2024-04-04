import { Group, BoxGeometry, Mesh, MeshStandardMaterial, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import CasualFlapMapImageUrl from "/SimpleFloor.gltf";

function setupNavigationAreaGeometry() {
    const navigationArea = new Group();

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
        "/SimpleRoom.gltf", // GLTF ファイルのパスを指定する
        (gltf) => {
            const roomMap = gltf.scene;
            navigationArea.add(roomMap);

            // Loop through children of roomMap to set occluderMaterial
            /*roomMap.traverse((child) => {
                if (child.isMesh) {
                    child.material = new MeshStandardMaterial({
                        color: 0x00ff00,
                        opacity: 0,
                        transparent: true,
                    });
                }
            });*/
        },
        undefined,
        (error) => {
            console.error("An error occurred while loading GLTF model:", error);
        }
    );

     // Load GLTF model
     /*const floorTexture = loader.load(
         "/SimpleFloor.gltf", // GLTF ファイルのパスを指定する
         (gltf) => {
             
             //navigationArea.add(floorTexture);
             
 
             // Loop through children of roomMap to set occluderMaterial
             /*roomMap.traverse((child) => {
                 if (child.isMesh) {
                     child.material = new MeshStandardMaterial({
                         color: 0x00ff00,
                         opacity: 0,
                         transparent: true,
                     });
                 }
             });
         },
         undefined,
         (error) => {
             console.error("An error occurred while loading GLTF model:", error);
         }
     ); */
    // Load floor texture
    const floorTexture = new TextureLoader().load(CasualFlapMapImageUrl);
    const floorMaterial = new MeshStandardMaterial({ map: floorTexture });
        
    // Create floor
    const floorGeometry = new BoxGeometry(30.2, 0.1, 22.5); // Assuming the floor size
    const floorMesh = new Mesh(floorGeometry, floorMaterial);
    floorMesh.position.set(0, -0.05, 0); // Adjust position if necessary
    navigationArea.add(floorMesh);

    // Set render order and other properties as needed
    console.log(navigationArea)
    return navigationArea;
}

export { setupNavigationAreaGeometry };
