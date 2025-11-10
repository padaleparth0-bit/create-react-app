import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, X } from 'lucide-react';
import { toast } from 'sonner';

export const VoiceAssistant = ({ onCommand, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-IN'; // Indian English

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          processVoiceCommand(transcriptText);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          toast.error('No speech detected. Please try again.');
        } else {
          toast.error('Voice recognition error. Please try again.');
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast.error('Voice recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setIsListening(true);
      recognition.start();
      speak('I am listening. Tell me about your expense or bill.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    // Extract expense/income information
    let type = 'expense';
    let amount = null;
    let category = 'Other';
    let description = command;

    // Detect type
    if (lowerCommand.includes('income') || lowerCommand.includes('salary') || lowerCommand.includes('earned')) {
      type = 'income';
    } else if (lowerCommand.includes('bill') || lowerCommand.includes('pay')) {
      type = 'bill';
    }

    // Extract amount
    const amountMatch = lowerCommand.match(/(?:rupees?|rs\.?|₹)?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/i);
    if (amountMatch) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Extract category
    const categories = {
      food: ['food', 'restaurant', 'lunch', 'dinner', 'breakfast', 'snack', 'meal'],
      transport: ['transport', 'taxi', 'uber', 'ola', 'bus', 'train', 'petrol', 'fuel'],
      shopping: ['shopping', 'clothes', 'amazon', 'flipkart', 'online'],
      entertainment: ['movie', 'entertainment', 'game', 'fun'],
      utilities: ['electricity', 'water', 'gas', 'internet', 'phone', 'mobile'],
      healthcare: ['doctor', 'medicine', 'hospital', 'health'],
      education: ['education', 'course', 'book', 'school', 'college']
    };

    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerCommand.includes(keyword))) {
        category = cat.charAt(0).toUpperCase() + cat.slice(1);
        break;
      }
    }

    const extractedData = {
      type,
      amount,
      category,
      description,
      date: new Date().toISOString().split('T')[0]
    };

    if (amount) {
      speak(`Got it! ${type} of ${amount} rupees for ${category}. Should I save this?`);
      onCommand(extractedData);
    } else {
      speak('Sorry, I could not detect the amount. Please say the amount clearly.');
      toast.error('Could not detect amount. Please try again.');
    }
  };

  const exampleCommands = [
    'I spent 500 rupees on food',
    'Paid electricity bill 2000 rupees',
    'Earned 50000 rupees salary',
    'Transport expense 200 rupees'
  ];

  return (
    <div className="voice-overlay">
      <Card className="voice-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Voice Assistant</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="voice-container">
            <div className={`voice-visualizer ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}>
              {isListening ? (
                <div className="pulse-animation">
                  <Mic className="h-16 w-16 text-red-500" />
                </div>
              ) : (
                <MicOff className="h-16 w-16 text-gray-400" />
              )}
            </div>

            <div className="voice-status">
              {isListening && <p className="status-text listening">Listening...</p>}
              {isSpeaking && <p className="status-text speaking">Speaking...</p>}
              {!isListening && !isSpeaking && <p className="status-text idle">Tap to speak</p>}
            </div>

            {transcript && (
              <div className="transcript-box" data-testid="transcript">
                <p><strong>You said:</strong> {transcript}</p>
              </div>
            )}

            <div className="voice-controls">
              {!isListening ? (
                <Button 
                  onClick={startListening} 
                  size="lg" 
                  className="voice-btn"
                  data-testid="start-voice-btn"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Start Speaking
                </Button>
              ) : (
                <Button 
                  onClick={stopListening} 
                  size="lg" 
                  variant="destructive"
                  data-testid="stop-voice-btn"
                >
                  <MicOff className="h-5 w-5 mr-2" />
                  Stop
                </Button>
              )}
            </div>

            <div className="voice-examples">
              <h4 className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Example commands:
              </h4>
              <ul>
                {exampleCommands.map((cmd, idx) => (
                  <li key={idx}>"{cmd}"</li>
                ))}
              </ul>
            </div>

            <div className="voice-tips">
              <p>💡 Speak clearly and mention the amount and category</p>
              <p>🎤 Works best in quiet environment</p>
              <p>🌐 Supports English and Hindi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};