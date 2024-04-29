import { Component, Input, HostListener, ElementRef } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
    @Input() content: string = '';
    isVisible: boolean = false;
    positionStyle = {};

    constructor(private el: ElementRef) {}

    @HostListener('mouseenter') onMouseEnter() {
        this.isVisible = true;
        const hostPos = this.el.nativeElement.getBoundingClientRect();
        this.positionStyle = {
            top: `${hostPos.bottom + window.scrollY}px`,
            left: `${hostPos.left + window.scrollX}px`,
        };
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.isVisible = false;
    }
}

/* 
use component in html:
<app-tooltip [content]="'Votre tooltip ici!'">
    <div>
        Survolez-moi pour voir le tooltip !
    </div>
</app-tooltip>
*/
