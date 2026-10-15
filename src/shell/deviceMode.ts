/** iPadOS can advertise a desktop Mac user agent. */
export function detectDeviceMode(device: Pick<Navigator, 'userAgent' | 'maxTouchPoints'>): 'ios' | 'default' {
  return /iPad|iPhone|iPod/.test(device.userAgent)
    || (/Macintosh/.test(device.userAgent) && device.maxTouchPoints > 1)
    ? 'ios' : 'default';
}
