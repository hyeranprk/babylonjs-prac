import { Injectable, NgZone } from '@angular/core';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

@Injectable({
  providedIn: 'root',
})
export class BaylonjsService {
  constructor(private ngZone: NgZone) {}

  createScene = function () {};
}
