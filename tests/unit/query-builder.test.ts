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
})
