import { isSpeechSupported, buildUtterance } from '@/lib/audio'

describe('isSpeechSupported', () => {
  it('returns false when speechSynthesis is not in window', () => {
    const original = (global as any).speechSynthesis
    delete (global as any).speechSynthesis
    expect(isSpeechSupported()).toBe(false)
    ;(global as any).speechSynthesis = original
  })
  it('returns true when speechSynthesis is present', () => {
    ;(global as any).speechSynthesis = { speak: jest.fn() }
    expect(isSpeechSupported()).toBe(true)
  })
})

describe('buildUtterance', () => {
  it('creates an utterance with the given text', () => {
    const u = buildUtterance('Namaste')
    expect(u.text).toBe('Namaste')
  })
  it('sets lang to hi-IN', () => {
    const u = buildUtterance('Namaste')
    expect(u.lang).toBe('hi-IN')
  })
})
