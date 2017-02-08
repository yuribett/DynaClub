import { trigger, state, style, transition, animate } from '@angular/core';

export const slide = trigger('slide', [
    state('center', style({
        transform: 'translate3d(0, 0, 0)'
    })),
    state('right', style({
        transform: 'translate3d(200%, 0, 0)', display: 'none'
    })),
    state('left', style({
        transform: 'translate3d(-200%, 0, 0)', display: 'none'
    })),
    transition('* => center', animate('400ms ease'))
]);