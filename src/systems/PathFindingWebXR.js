import { Vector3, MeshBasicMaterial, Mesh, Group, BoxGeometry, BufferGeometry, Line, LineBasicMaterial } from "three";

import { Pathfinding } from "three-pathfinding";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import NavMeshUrl from "/NavMeshSimple.gltf";

const zeroVector = new Vector3(0, 0, 0);

let pathfinding = new Pathfinding();
let zoneName = "level1";
let groupID;
let zoneData;
let startPosition = new Vector3();
let targetPosition = new Vector3();

let tempTargetPosition = new Vector3(0, 0.5, -2);

let line;

let camera;
let navigationArea;

let isStartCubeCreated = false;
let isEndCubeCreated = false;

const navCubes = [];

class PathFindingWebXR {
    constructor(cameraParam, navigationAreaParam) {
        this.camera = cameraParam; // 修正: this を使用してインスタンスのプロパティに設定する
        this.navigationArea = navigationAreaParam; // 修正: this を使用してインスタンスのプロパティに設定する
        // setup navmesh and navigation targets
        const loader = new GLTFLoader();
        loader.load(
            NavMeshUrl,
            (gltf) => {
                let navMesh = gltf.scene;
                this.navigationArea.add(navMesh); // 修正: this を使用して navigationArea に追加する

                let navMeshGeometry = new BufferGeometry();
                navMesh.children.forEach((child) => {
                    if (child.type === "Mesh") {
                        console.log("Mesh", child);
                        navMeshGeometry = child;
                    }
                });
                navMeshGeometry.visible = false;

                zoneData = Pathfinding.createZone(navMeshGeometry.geometry);
                pathfinding.setZoneData(zoneName, zoneData);
                console.log("Zone", zoneData);
            },
            undefined,
            (e) => {
                console.error(e);
            }
        );

        // navigation line
        const lineGeometry = new BufferGeometry();
        const lineMaterial = new LineBasicMaterial({ color: 0xff0000, linewidth: 12 });
        line = new Line(lineGeometry, lineMaterial);
        line.renderOrder = 3;
        this.navigationArea.add(line); // 修正: this を使用して navigationArea に追加する

        // highlight line vertices with small cubes
        const geometry = new BoxGeometry(0.1, 0.1, 0.1);
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        for (let index = 0; index < 20; index++) {
            const cube = new Mesh(geometry, material);
            cube.visible = false;
            cube.renderOrder = 3;
            navCubes.push(cube);
            this.navigationArea.add(cube); // 修正: this を使用して navigationArea に追加する
        }

        document.getElementById("kitchenTarget").addEventListener("click", () => {
            console.log("kitchen selected");
            tempTargetPosition.set(0, 0.5, -2);
        });
        document.getElementById("livingRoomTarget").addEventListener("click", () => {
            console.log("livingRoom selected");
            tempTargetPosition.set(3, 0.5, -2);
        });
    }

    setStartPosition(start) {
        startPosition.set(start.x, start.y, start.z);

        groupID = pathfinding.getGroup(zoneName, start);

        // visual for better debugging
        if (!isStartCubeCreated) {
            const startGeometry = new BoxGeometry(0.2, 0.2, 0.2);
            const startMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
            const startCube = new Mesh(startGeometry, startMaterial);
            startCube.position.set(3, 0.5, -2);
            startCube.renderOrder = 3;

            this.navigationArea.add(startCube); // 修正: this を使用して navigationArea に追加する

            isStartCubeCreated = true;
        }
    }

    setTargetPosition(target) {
        targetPosition.set(target.x, target.y, target.z);

        // visual for better debugging
        if (!isEndCubeCreated) {
            const targetGeometry = new BoxGeometry(0.2, 0.2, 0.2);
            const targetMaterial = new MeshBasicMaterial({ color: 0x0000ff });
            const targetCube = new Mesh(targetGeometry, targetMaterial);
            targetCube.position.set(0, 0.5, -2);
            targetCube.renderOrder = 3;

            this.navigationArea.add(targetCube); // 修正: this を使用して navigationArea に追加する
            isEndCubeCreated = true;
        }
    }

    calculatePath(timestamp, frame, imageTracking) {
        if (frame) {
            const markerWorldPosition = imageTracking.getMarkerWorldPosition();

            if (markerWorldPosition !== zeroVector) {
                // calculate "offseted" positions, as navigation mesh can't be moved/rotated
                const cameraPosition = this.navigationArea.worldToLocal(this.camera.position);
                const navStart = new Vector3(cameraPosition.x, 0.5, cameraPosition.z);
                // set endposition to current target
                const navEnd = new Vector3(tempTargetPosition.x, tempTargetPosition.y, tempTargetPosition.z);

                this.setStartPosition(navStart);
                this.setTargetPosition(navEnd);

                const path = pathfinding.findPath(startPosition, targetPosition, zoneName, groupID);

                if (path !== null) {
                    const points = [];
                    points.push(navStart);
                    for (let index = 0; index < path.length; index++) {
                        points.push(path[index]);
                        navCubes[index].position.set(path[index].x, 0.2, path[index].z);
                        navCubes[index].visible = true;
                    }
                    for (let unsetIndex = path.length; unsetIndex < navCubes.length; unsetIndex++) {
                        navCubes[unsetIndex].position.set(0, 0, 0);
                        navCubes[unsetIndex].visible = false;
                    }
                    line.geometry.setFromPoints(points);
                }
            }
        }
    }
}

export { PathFindingWebXR };
