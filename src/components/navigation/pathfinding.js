import { PathFindingWebXR } from "../../systems/PathFindingWebXR";

function createPathFindingWebXR(camera, imageTracking, navigationAreaParent) {
    const pathFindingWebXR = new PathFindingWebXR(camera, navigationAreaParent.children[0]);
    pathFindingWebXR.tick = (timestamp, frame) => pathFindingWebXR.calculatePath(timestamp, frame, imageTracking);

    console.log('log',pathFindingWebXR)
    return pathFindingWebXR;
}

export { createPathFindingWebXR };
