// Strip prefixes
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const speechSynthesis = window.speechSynthesis

let ssVoice = null // Currently-selected voice
const sr = new SpeechRecognition()
sr.lang = 'en-US'
sr.continuous = true // Don't stop recognising speech until the user tells you to

// Speech recognition
sr.addEventListener('result', event => {
  const lastResult = event.results[event.resultIndex][0].transcript // Get recognised text
  const text = document.getElementById('text')
  if (text.innerText.length > 5000) text.innerText = ''
  text.innerText += ' ' + lastResult // Populate textbox
  const phrase = new window.SpeechSynthesisUtterance()
  if (ssVoice) phrase.voice = ssVoice
  phrase.text = lastResult
  speechSynthesis.speak(phrase) // Say text
})

// Populate voice selector
speechSynthesis.addEventListener('voiceschanged', event => {
  const select = document.getElementById('ttsvoice')
  select.innerHTML = ''
  const originalOption = document.createElement('option')
  originalOption.innerText = 'Select text-to-speech voice...'
  originalOption.disabled = true
  originalOption.selected = true
  select.appendChild(originalOption)
  const voices = speechSynthesis.getVoices()
  for (const voice of voices) {
    if (!voice.lang.startsWith('en-')) continue
    const option = document.createElement('option')
    option.value = voice.voiceURI
    option.innerText = voice.name
    select.appendChild(option)
  }
})

// Change voice when selected
document.getElementById('ttsvoice').addEventListener('change', event => {
  const value = event.target.value
  ssVoice = speechSynthesis.getVoices().find(x => x.voiceURI === value)
  console.log(value)
})

// Start/pause button
document.getElementById('listen').addEventListener('click', event => {
  if (event.target.dataset.paused === 'true') {
    sr.start()
    event.target.innerText = 'Stop'
    event.target.dataset.paused = 'false'
  } else {
    sr.stop()
    event.target.innerText = 'Listen'
    event.target.dataset.paused = 'true'
  }
  document.getElementById('text').innerText = ''
})
