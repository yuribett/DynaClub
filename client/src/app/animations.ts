import { trigger, state, style, transition, animate } from '@angular/core';

export const slideLeft = trigger('slideIn', [
    state('visible', style({
        transform: 'translate3d(0, 0, 0)'
    })),
    state('hidden', style({
        transform: 'translate3d(200%, 0, 0)', display: 'none'
    })),
    transition('hidden => visible', animate('400ms ease')),
    transition('visible => hidden', animate('00ms ease'))
]);

export const slideRight = trigger('slideOut', [
    state('visible', style({
        transform: 'translate3d(0, 0, 0)'
    })),
    state('hidden', style({
        transform: 'translate3d(-200%, 0, 0)', display: 'none'
    })),
    transition('hidden => visible', animate('400ms ease')),
    transition('visible => hidden', animate('00ms ease'))
]);