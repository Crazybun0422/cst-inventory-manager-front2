import Vue from 'vue'
// A tiny global event bus for cross-component notifications
const bus = new Vue()
export default bus
export const EVENTS = {
  SOURCING_NOTIFICATION: 'sourcing_notification',
  EXPORT_NOTIFICATION: 'export_notification',
}
