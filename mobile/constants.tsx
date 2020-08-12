import { Event } from  "./events/events"

// Constants for event details page
export const DOWN_EMOJI_HEIGHT = 82
export const DOWN_EMOJI_WIDTH = 85
export const EVENT_PIC_HEIGHT = 130
export const EVENT_PIC_WIDTH = 130
export const ROW_BUTTON_HEIGHT = 40
export const ROW_BUTTON_WIDTH = 40

export const DEFAULT_EVENT = {
  id: 0,
  name: "",
  emoji: "",
  description: "",
  image_url: "",
  start_ms: 0,
  end_ms: 0,
  rsvp_users: [],
  declined_users: [],
  url: "",
  down_threshold: 0,
  creator_email: ""
} as Event