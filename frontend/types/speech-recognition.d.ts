// Define the necessary types for Web Speech API
declare global {
    interface Window {
      webkitSpeechRecognition: new () => SpeechRecognition;
    }
  
    interface SpeechRecognitionEvent {
      results: SpeechRecognitionResultList;
      resultIndex: number;
      readonly timeStamp: DOMHighResTimeStamp;
    }
  
    interface SpeechRecognitionResultList {
      readonly length: number;
      item(index: number): SpeechRecognitionResult;
      [index: number]: SpeechRecognitionResult;
    }
  
    interface SpeechRecognitionResult {
      readonly isFinal: boolean;
      readonly length: number;
      item(index: number): SpeechRecognitionAlternative;
      [index: number]: SpeechRecognitionAlternative;
    }
  
    interface SpeechRecognitionAlternative {
      readonly transcript: string;
      readonly confidence: number;
    }
  
    interface SpeechRecognition extends EventTarget {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      maxAlternatives: number;
      onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
      onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
      onend: ((this: SpeechRecognition, ev: Event) => any) | null;
      onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
      onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
      onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
      onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
      onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
      onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
      onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
      onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
      start(): void;
      stop(): void;
      abort(): void;
    }
  }
  
  export {};