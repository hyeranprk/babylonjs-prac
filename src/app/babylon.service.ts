import { Injectable, NgZone } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Color4 } from 'babylonjs';
import 'babylonjs-loaders';

@Injectable({
  providedIn: 'root',
})
export class BabylonService {
  public canvas!: HTMLCanvasElement;
  public engine!: BABYLON.Engine;
  public camera!: BABYLON.ArcRotateCamera;
  public scene!: BABYLON.Scene;
  public light!: BABYLON.Light;
  private libPath = 'assets/libs/files/';

  constructor(private ngZone: NgZone) {}

  //return engine here (reference: )
  public construct(canvasId: string): BABYLON.Engine {
    this.deconstruct();
    //get the reference of the canvas element from our HTML document
    const canvas = (this.canvas = document.getElementById(
      canvasId
    ) as HTMLCanvasElement);
    //load the babylonjs 3D engine
    const engine = (this.engine = new BABYLON.Engine(canvas, true));
    //create a basic BJS Scene object
    const scene = (this.scene = new BABYLON.Scene(engine));
    //change background color
    scene.clearColor = new Color4(0.1, 0.2, 1, 0.5);

    //create a camera
    this.initCamera(canvas, scene);
    //create a light
    this.initLight(scene);
    //register a render loop to repeately render the scene
    this.runRenderLoop();

    //create a mesh?/import file
    var newMaterial = new BABYLON.StandardMaterial('newMaterial', scene);
    newMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
    // var sphere = BABYLON.MeshBuilder.CreateSphere(
    //  'sphere',
    //  { diameter: 100, segments: 32 },
    //   scene
    //);
    // sphere.material = newMaterial;

    //specifying which mesh to importtt

    BABYLON.SceneLoader.ImportMesh(
      '',
      this.libPath,
      'shinwoo_level2.glb',
      scene,
      function (newMeshes, particleSystem, skeletons) {}
    );

    return this.engine;
  }

  private initCamera(canvas: HTMLCanvasElement, scene: BABYLON.Scene) {
    //creates an positions a free camera(non-mesh)
    var camera = new BABYLON.ArcRotateCamera(
      'Camera',
      (3 * Math.PI) / 2,
      (3 * Math.PI) / 8,
      30,
      BABYLON.Vector3.Zero(),
      scene
    );
    //attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera.setTarget(new BABYLON.Vector3(Math.PI / 4, 0, 0));
    camera.upperRadiusLimit = 15;
    camera.lowerRadiusLimit = 10;
  }

  private initLight(scene: BABYLON.Scene) {
    var light = new BABYLON.HemisphericLight(
      'hemi',
      new BABYLON.Vector3(0, 50, 0),
      scene
    );
    //default intensity is 1
    light.intensity = 0.7;
  }

  private runRenderLoop(): void {
    //we have to run this outside angular zones so we use ngZone
    //because it could trigger heavy changeDetection cycles
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };

      if (document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }
      //watch for browser/canvas resize event
      window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
    this.engine.resize();
  }

  public deconstruct(): void {
    if (this.engine) {
      this.engine.dispose();
    }
  }
}
