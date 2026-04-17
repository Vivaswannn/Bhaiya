export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function buildUtterance(text: string): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'hi-IN'
  u.rate = 0.9
  u.pitch = 1.0
  return u
}

export function speakGuide(text: string): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(buildUtterance(text))
}

export function stopGuide(): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
}

export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false
  return window.speechSynthesis.speaking
}
