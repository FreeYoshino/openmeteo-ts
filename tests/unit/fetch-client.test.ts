import { describe, it, expect, afterEach, vi } from 'vitest'
import { HttpClient } from '../../src/http/fetch-client.js'

describe('HttpClient', () => {
  it('should return parsed JSON on successful request', async () => {
    const mockData = { latitude: 40.7128, longitude: -74.006 }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    )

    const client = new HttpClient()
    const result = await client.get<typeof mockData>('/forecast')

    expect(result).toEqual(mockData)
  })
})
