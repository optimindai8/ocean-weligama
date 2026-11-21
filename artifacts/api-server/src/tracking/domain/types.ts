export const EVENT_TYPES = ['pageview', 'engagement', 'custom'] as const;
/**
 * pageview   - a guest opened a page
 * engagement - how long the page was actually visible (sent when the guest leaves/hides the page)
 * custom     - a named action such as booking_click or phone_click
 */
export type EventType = (typeof EVENT_TYPES)[number];

export const DEVICE_TYPES = ['desktop', 'mobile', 'tablet', 'unknown'] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export const TRAFFIC_MEDIUMS = ['direct', 'organic', 'social', 'travel', 'referral', 'campaign'] as const;
export type TrafficMedium = (typeof TRAFFIC_MEDIUMS)[number];
