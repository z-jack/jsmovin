import * as JSMovin from './jsmovin'

Object.entries(JSMovin).forEach(([entry, body]) => {
    if (entry === 'default') {
        Object.defineProperty(window, 'JSMovin', { get: () => body, enumerable: true })
    } else {
        Object.defineProperty(window, entry, { get: () => body, enumerable: true })
    }
})