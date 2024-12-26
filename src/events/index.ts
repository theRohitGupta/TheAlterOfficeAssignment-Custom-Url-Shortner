import { EventEmitter } from 'events';
import { clickEventHandler } from './handlers/click-event';

// Initialize the event emitter
export const eventEmitter = new EventEmitter();

export enum EventNamesEnum {
    CLICK_SHORT_URL_EVENT = 'click-short-url-event'
}

// Event Handlers
eventEmitter.on(EventNamesEnum.CLICK_SHORT_URL_EVENT, clickEventHandler);