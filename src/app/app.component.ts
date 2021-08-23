import { Component } from '@angular/core';
import { BabylonService } from './babylon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'babylonjs-prac';

  constructor(private babylonService: BabylonService) {}

  ngOnInit(): void {
    this.babylonService.construct('viewerCanvas');
  }
}
