import { Component, AfterViewInit, ElementRef, Renderer2, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterViewInit {

  @ViewChildren('.tilt-effect') tiltElements!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.tiltElements.forEach((element) => {
      this.renderer.listen(element.nativeElement, 'mouseover', () => {
        const randomAngle = (Math.random() * 20 - 10).toFixed(1);
        this.renderer.setStyle(element.nativeElement, '--tilt-angle', `${randomAngle}deg`);
      });
    });
  }
}
