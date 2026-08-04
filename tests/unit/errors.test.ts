import { describe, expect, it } from 'vitest'
import {
  WeatherError,
  WeatherAPIError,
  WeatherNetworkError,
  WeatherValidationError,
  WeatherMappingError,
} from '../../src/http/errors.js'

describe('WeatherError', () => {
  it('should extend Error and maintain its own prototype', () => {
    const error = new WeatherError('Test error')
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(WeatherError)
  })
  it('should have the correct name', () => {
    const error = new WeatherError('Test error')
    expect(error.name).toBe('WeatherError')
  })
  it('should have the correct message', () => {
    const error = new WeatherError('Test error')
    expect(error.message).toBe('Test error')
  })
  it('should support the cause option', () => {
    const cause = new Error('Cause error')
    const error = new WeatherError('Test error', { cause })
    expect(error.cause).toBe(cause)
  })
})
