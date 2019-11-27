import JSMovin from './jsmovin'
import { EasingFactory, MaskType, LayerFactory } from './jsmovin'

Object.defineProperty(window, 'JSMovin', { get: () => JSMovin, enumerable: true })
Object.defineProperty(window, 'LayerFactory', { get: () => LayerFactory, enumerable: true })
Object.defineProperty(window, 'EasingFactory', { get: () => EasingFactory, enumerable: true })
Object.defineProperty(window, 'MaskType', { get: () => MaskType, enumerable: true })