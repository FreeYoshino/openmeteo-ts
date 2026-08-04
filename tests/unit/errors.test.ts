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

describe('WeatherAPIError', () => {
  it('should extend WeatherError and maintain its own prototype', () => {
    const error = new WeatherAPIError(400, 'Bad Request')
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(WeatherError)
    expect(error).toBeInstanceOf(WeatherAPIError)
  })
  it('should have the correct name', () => {
    const error = new WeatherAPIError(400, 'Bad Request')
    expect(error.name).toBe('WeatherAPIError')
  })
  it('should have the correct statusCode and reason', () => {
    const error = new WeatherAPIError(400, 'Bad Request')
    expect(error.statusCode).toBe(400)
    expect(error.reason).toBe('Bad Request')
  })
  it('should format the message correctly', () => {
    const error = new WeatherAPIError(400, 'Bad Request')
    expect(error.message).toBe('API Error 400: Bad Request')
  })
  it('should support the cause option', () => {
    const cause = new Error('Cause error')
    const error = new WeatherAPIError(400, 'Bad Request', { cause })
    expect(error.cause).toBe(cause)
  })
})

describe('WeatherNetworkError', () => {
  it('should extend WeatherError and maintain its own prototype', () => {
    const error = new WeatherNetworkError('Network error')
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(WeatherError)
    expect(error).toBeInstanceOf(WeatherNetworkError)
  })
  it('should have the correct name', () => {
    const error = new WeatherNetworkError('Network error')
    expect(error.name).toBe('WeatherNetworkError')
  })
  it('should have the correct message', () => {
    const error = new WeatherNetworkError('Network error')
    expect(error.message).toBe('Network error')
  })
  it('should support the cause option', () => {
    const cause = new Error('Cause error')
    const error = new WeatherNetworkError('Network error', { cause })
    expect(error.cause).toBe(cause)
  })
})

describe('WeatherValidationError', () => {
  it('should extend WeatherError and maintain its own prototype', () => {
    const error = new WeatherValidationError('Validation error')
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(WeatherError)
    expect(error).toBeInstanceOf(WeatherValidationError)
  })
  it('should have the correct name', () => {
    const error = new WeatherValidationError('Validation error')
    expect(error.name).toBe('WeatherValidationError')
  })
  it('should have the correct message', () => {
    const error = new WeatherValidationError('Validation error')
    expect(error.message).toBe('Validation error')
  })
  it('should support the cause option', () => {
    const cause = new Error('Cause error')
    const error = new WeatherValidationError('Validation error', { cause })
    expect(error.cause).toBe(cause)
  })
})

describe('WeatherMappingError', () => {
  it('should extend WeatherError and maintain its own prototype', () => {
    const error = new WeatherMappingError('Mapping error')
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(WeatherError)
    expect(error).toBeInstanceOf(WeatherMappingError)
  })
  it('should have the correct name', () => {
    const error = new WeatherMappingError('Mapping error')
    expect(error.name).toBe('WeatherMappingError')
  })
  it('should have the correct message', () => {
    const error = new WeatherMappingError('Mapping error')
    expect(error.message).toBe('Mapping error')
  })
  it('should support the cause option', () => {
    const cause = new Error('Cause error')
    const error = new WeatherMappingError('Mapping error', { cause })
    expect(error.cause).toBe(cause)
  })
})

describe('Error type discrimination', () => {
  it('should correctly distinguish between different error types', () => {
    const apiError = new WeatherAPIError(400, 'Bad Request')
    const networkError = new WeatherNetworkError('Network error')
    const validationError = new WeatherValidationError('Validation error')
    const mappingError = new WeatherMappingError('Mapping error')

    // API Error should not be an instance of other error types
    expect(apiError).not.toBeInstanceOf(WeatherNetworkError)
    expect(apiError).not.toBeInstanceOf(WeatherValidationError)
    expect(apiError).not.toBeInstanceOf(WeatherMappingError)

    // Network Error should not be an instance of other error types
    expect(networkError).not.toBeInstanceOf(WeatherAPIError)
    expect(networkError).not.toBeInstanceOf(WeatherValidationError)
    expect(networkError).not.toBeInstanceOf(WeatherMappingError)

    // Validation Error should not be an instance of other error types
    expect(validationError).not.toBeInstanceOf(WeatherAPIError)
    expect(validationError).not.toBeInstanceOf(WeatherNetworkError)
    expect(validationError).not.toBeInstanceOf(WeatherMappingError)

    // Mapping Error should not be an instance of other error types
    expect(mappingError).not.toBeInstanceOf(WeatherAPIError)
    expect(mappingError).not.toBeInstanceOf(WeatherNetworkError)
    expect(mappingError).not.toBeInstanceOf(WeatherValidationError)
  })
})
