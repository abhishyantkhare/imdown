import { Event } from './events/EventDetails';

// Constants for event details page
export const DOWN_EMOJI_HEIGHT = 82;
export const DOWN_EMOJI_WIDTH = 85;
export const EVENT_PIC_HEIGHT = 130;
export const EVENT_PIC_WIDTH = 130;
export const ROW_BUTTON_HEIGHT = 40;
export const ROW_BUTTON_WIDTH = 40;
export const IMG_URL_BASE_64_PREFIX = 'data:image/jpeg;base64,';

export const DEFAULT_EVENT = {
  id: 0,
  name: '',
  emoji: '',
  description: '',
  imageUrl: '',
  startMs: 0,
  endMs: 0,
  rsvpUsers: [],
  declinedUsers: [],
  url: '',
  downThreshold: 0,
  creatorUserId: 0,
} as Event;

export const DEFAULT_EMOJI = '😎';
