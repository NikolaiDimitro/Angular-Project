import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  ngAfterViewInit() {
    const tiltElements = document.querySelectorAll('.tilt-effect');
    tiltElements.forEach((element) => {
      element.addEventListener('mouseover', () => {
        const randomAngle = (Math.random() * 20 - 10).toFixed(1); // Генерира произволен наклон (-10 до 10 градуса)
        (element as HTMLElement).style.setProperty('--tilt-angle', `${randomAngle}deg`);
      });
    });
  }
}
