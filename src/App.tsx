import { useState, useEffect, useCallback } from 'react'

interface Language {
  code: string
  name: string
  buttonText: {
    start: string
    stop: string
  }
  placeholderText: string
  clearText: string
  title: string
}

const languages: Record<string, Language> = {
  'en-US': {
    code: 'en-US',
    name: 'English',
    buttonText: {
      start: 'Start Listening',
      stop: 'Stop Listening'
    },
    placeholderText: 'Recognized text will appear here...',
    clearText: 'Clear Text',
    title: 'Speech to Text'
  },
  'fi-FI': {
    code: 'fi-FI',
    name: 'Suomi',
    buttonText: {
      start: 'Aloita Kuuntelu',
      stop: 'Lopeta Kuuntelu'
    },
    placeholderText: 'Tunnistettu teksti näkyy tässä...',
    clearText: 'Tyhjennä',
    title: 'Puheesta Tekstiksi'
  }
}

function App() {
  const [isListening, setIsListening] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [currentLang, setCurrentLang] = useState<string>('en-US')
  
  // Initialize speech recognition
  const recognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Speech recognition is not supported in this browser.')
    }
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = currentLang
    return recognition
  }, [currentLang])

  useEffect(() => {
    let recognitionInstance: any

    if (isListening) {
      try {
        recognitionInstance = recognition()
        
        recognitionInstance.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('')
          setText(transcript)
        }

        recognitionInstance.onerror = (event: any) => {
          setError(`Error: ${event.error}`)
          setIsListening(false)
        }

        recognitionInstance.start()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop()
      }
    }
  }, [isListening, recognition])

  const toggleListening = () => {
    setIsListening(!isListening)
    if (error) setError(null)
  }

  const toggleLanguage = () => {
    // Stop listening when switching languages
    if (isListening) {
      setIsListening(false)
    }
    setCurrentLang(currentLang === 'en-US' ? 'fi-FI' : 'en-US')
  }

  const lang = languages[currentLang]

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {lang.title}
            </h1>
            <button
              onClick={toggleLanguage}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {currentLang === 'en-US' ? 'Suomeksi' : 'In English'}
            </button>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={toggleListening}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isListening ? lang.buttonText.stop : lang.buttonText.start}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
              <p className="text-gray-800 whitespace-pre-wrap">
                {text || lang.placeholderText}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setText('')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {lang.clearText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App