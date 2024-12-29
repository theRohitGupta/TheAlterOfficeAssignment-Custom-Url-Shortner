import { EventEmitter } from 'events';
import { clickEventHandler } from './handlers/click-event';
import { EventNamesEnum } from '../constants/enums/event-names';

// Initialize the event emitter
export const eventEmitter = new EventEmitter();

// Event Handlers
eventEmitter.on(EventNamesEnum.CLICK_SHORT_URL_EVENT, clickEventHandler);