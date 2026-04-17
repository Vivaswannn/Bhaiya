import '@testing-library/jest-dom'

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    rpc: jest.fn(),
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}))

// Mock SpeechSynthesisUtterance for jsdom
global.SpeechSynthesisUtterance = class {
  text: string; lang: string; rate: number; pitch: number
  constructor(text: string) { this.text = text; this.lang = ''; this.rate = 1; this.pitch = 1 }
} as any
