import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  ngAfterViewInit() {
    const tiltElements = document.querySelectorAll('.tilt-effect');
    tiltElements.forEach((element) => {
      element.addEventListener('mouseover', () => {
        const randomAngle = (Math.random() * 20 - 10).toFixed(1); // Наклон от -10 до 10 градуса
        (element as HTMLElement).style.setProperty('--tilt-angle', `${randomAngle}deg`);
      });
    });
  }

}
