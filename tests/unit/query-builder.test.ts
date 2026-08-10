import { describe, it, expect } from 'vitest'
import { QueryBuilder } from '../../src/builder/query-builder.js'

describe('QueryBuilder', () => {
  describe('Constructor', () => {
    it('should start with no parameters', () => {
      const builder = new QueryBuilder()
      const result = builder.latitude(40.7128).longitude(-74.006).build()
      expect(Object.keys(result)).toEqual(['latitude', 'longitude'])
    })
  })

  describe('setters', () => {
    describe('required parameters', () => {
      it('should set single latitude value', () => {
        const builder = new QueryBuilder()
        const result = builder.latitude(40.7128).longitude(0).build()
        expect(result.latitude).toBe('40.7128')
      })
    })

    it('should join multiple latitude values with a comma', () => {
      const builder = new QueryBuilder()
      const result = builder.latitude([40.7128, 34.0522]).longitude(0).build()
      expect(result.latitude).toBe('40.7128,34.0522')
    })

    it('should set single longitude value', () => {
      const builder = new QueryBuilder()
      const result = builder.latitude(0).longitude(-74.006).build()
      expect(result.longitude).toBe('-74.006')
    })

    it('should join multiple longitude values with a comma', () => {
      const builder = new QueryBuilder()
      const result = builder.latitude(0).longitude([-74.006, -118.2437]).build()
      expect(result.longitude).toBe('-74.006,-118.2437')
    })
  })
})
