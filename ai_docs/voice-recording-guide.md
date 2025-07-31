# Comprehensive Voice Recording and Processing Guide for Next.js Applications

## Table of Contents
1. [Browser MediaRecorder API Patterns](#browser-mediarecorder-api-patterns)
2. [Audio File Formats](#audio-file-formats)
3. [Real-time Audio Visualization](#real-time-audio-visualization)
4. [Audio File Compression and Optimization](#audio-file-compression-and-optimization)
5. [Browser Compatibility](#browser-compatibility)
6. [Storage Patterns](#storage-patterns)
7. [React Hooks for Audio Recording](#react-hooks-for-audio-recording)
8. [Whisper API Integration](#whisper-api-integration)

## 1. Browser MediaRecorder API Patterns

### Basic MediaRecorder Setup

```typescript
// Check for MediaRecorder support
if (!navigator.mediaDevices || !window.MediaRecorder) {
  throw new Error('MediaRecorder API not supported in this browser');
}

// Request microphone permission
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
    channelCount: 1,
  } 
});

// Create MediaRecorder instance
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus', // Most widely supported
  audioBitsPerSecond: 128000, // 128 kbps
});
```

### MediaRecorder Event Handling

```typescript
const audioChunks: Blob[] = [];

mediaRecorder.ondataavailable = (event: BlobEvent) => {
  if (event.data.size > 0) {
    audioChunks.push(event.data);
  }
};

mediaRecorder.onstop = () => {
  const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
  const audioUrl = URL.createObjectURL(audioBlob);
  // Process the audio blob
};

mediaRecorder.onerror = (error: Event) => {
  console.error('MediaRecorder error:', error);
};

// Start recording with timeslice (e.g., every second)
mediaRecorder.start(1000);
```

## 2. Audio File Formats

### Format Comparison

| Format | Browser Support | File Size | Quality | Use Case |
|--------|----------------|-----------|---------|----------|
| WebM/Opus | Chrome, Firefox, Edge | Small | Good | Default for web recording |
| WAV | Universal | Large | Excellent | Professional audio |
| MP3 | Universal | Medium | Good | Compatibility & sharing |
| M4A/AAC | Safari, Chrome | Small | Good | Apple ecosystem |

### MIME Type Detection

```typescript
const getSupportedMimeType = (): string => {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav',
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  
  throw new Error('No supported audio MIME type found');
};
```

### Format Conversion (Client-Side)

```typescript
// Convert WebM to WAV using AudioContext
async function webmToWav(webmBlob: Blob): Promise<Blob> {
  const audioContext = new AudioContext();
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Create WAV from AudioBuffer
  const wavBuffer = audioBufferToWav(audioBuffer);
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length * buffer.numberOfChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  const channels: Float32Array[] = [];
  let offset = 0;
  let pos = 0;

  // Write WAV header
  const setUint16 = (data: number) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };

  const setUint32 = (data: number) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  // RIFF identifier
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  // fmt sub-chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // subchunk1 size
  setUint16(1); // audio format (1 = PCM)
  setUint16(buffer.numberOfChannels);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // byte rate
  setUint16(buffer.numberOfChannels * 2); // block align
  setUint16(16); // bits per sample

  // data sub-chunk
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4); // subchunk2 size

  // Write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][offset]));
      view.setInt16(pos, sample * 0x7FFF, true);
      pos += 2;
    }
    offset++;
  }

  return arrayBuffer;
}
```

## 3. Real-time Audio Visualization

### Waveform Visualization Component

```typescript
import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ 
  analyser, 
  isRecording 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!analyser || !canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgb(17, 24, 39)'; // Dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(34, 197, 94)'; // Green waveform
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={200}
      className="w-full h-full rounded-lg border border-gray-700"
    />
  );
};
```

### Frequency Visualization

```typescript
export const FrequencyVisualizer: React.FC<WaveformVisualizerProps> = ({ 
  analyser, 
  isRecording 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!analyser || !canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={200}
      className="w-full h-full rounded-lg"
    />
  );
};
```

## 4. Audio File Compression and Optimization

### Client-Side Compression

```typescript
interface CompressionOptions {
  targetBitrate?: number;
  targetSampleRate?: number;
  mono?: boolean;
}

async function compressAudio(
  audioBlob: Blob, 
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    targetBitrate = 64000, // 64 kbps
    targetSampleRate = 22050, // 22.05 kHz
    mono = true,
  } = options;

  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Resample and convert to mono if needed
  const offlineContext = new OfflineAudioContext(
    mono ? 1 : audioBuffer.numberOfChannels,
    audioBuffer.duration * targetSampleRate,
    targetSampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start();

  const renderedBuffer = await offlineContext.startRendering();
  
  // Convert to WAV with lower quality
  const wavBlob = new Blob(
    [audioBufferToWav(renderedBuffer)], 
    { type: 'audio/wav' }
  );

  return wavBlob;
}
```

### Server-Side Compression with FFmpeg

```typescript
// Next.js API Route: /app/api/compress-audio/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    const inputPath = path.join(tempDir, `${uuidv4()}_input.webm`);
    const outputPath = path.join(tempDir, `${uuidv4()}_output.mp3`);

    // Save uploaded file
    const arrayBuffer = await audioFile.arrayBuffer();
    await fs.writeFile(inputPath, Buffer.from(arrayBuffer));

    // Compress with FFmpeg
    const command = `ffmpeg -i "${inputPath}" -codec:a libmp3lame -b:a 64k -ar 22050 -ac 1 "${outputPath}"`;
    await execAsync(command);

    // Read compressed file
    const compressedBuffer = await fs.readFile(outputPath);

    // Cleanup
    await Promise.all([
      fs.unlink(inputPath),
      fs.unlink(outputPath),
    ]);

    return new NextResponse(compressedBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="compressed.mp3"',
      },
    });
  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json({ error: 'Compression failed' }, { status: 500 });
  }
}
```

## 5. Handling Browser Compatibility Issues

### Browser Detection and Fallbacks

```typescript
export const getBrowserCapabilities = () => {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
  const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
  const isEdge = /Edg/.test(navigator.userAgent);

  return {
    supportsMediaRecorder: typeof MediaRecorder !== 'undefined',
    supportsWebM: MediaRecorder.isTypeSupported?.('audio/webm;codecs=opus') || false,
    supportsMP4: MediaRecorder.isTypeSupported?.('audio/mp4') || false,
    supportsWAV: true, // Always true as we can convert to WAV
    preferredFormat: getPreferredFormat(),
    browser: { isChrome, isFirefox, isSafari, isEdge },
  };
};

function getPreferredFormat(): string {
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    return 'audio/webm;codecs=opus';
  }
  if (MediaRecorder.isTypeSupported('audio/mp4')) {
    return 'audio/mp4';
  }
  if (MediaRecorder.isTypeSupported('audio/webm')) {
    return 'audio/webm';
  }
  return 'audio/wav'; // Fallback
}
```

### Polyfills and Workarounds

```typescript
// Safari workaround for MediaRecorder
import { MediaRecorder as MediaRecorderPolyfill } from 'audio-recorder-polyfill';

const getMediaRecorder = () => {
  if (typeof MediaRecorder === 'undefined') {
    window.MediaRecorder = MediaRecorderPolyfill;
  }
  return window.MediaRecorder;
};

// Enhanced getUserMedia with fallbacks
async function getAudioStream(constraints?: MediaStreamConstraints) {
  const defaultConstraints: MediaStreamConstraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      ...constraints?.audio,
    },
  };

  try {
    // Modern approach
    if (navigator.mediaDevices?.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia(defaultConstraints);
    }
    
    // Legacy approach
    const getUserMedia = 
      navigator.getUserMedia || 
      navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia;
      
    if (getUserMedia) {
      return new Promise<MediaStream>((resolve, reject) => {
        getUserMedia.call(navigator, defaultConstraints, resolve, reject);
      });
    }
    
    throw new Error('getUserMedia not supported');
  } catch (error) {
    console.error('Failed to get audio stream:', error);
    throw error;
  }
}
```

## 6. Storage Patterns (Local vs Cloud)

### Local Storage with IndexedDB

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AudioDB extends DBSchema {
  recordings: {
    key: string;
    value: {
      id: string;
      blob: Blob;
      metadata: {
        duration: number;
        size: number;
        mimeType: string;
        createdAt: Date;
        name?: string;
        transcript?: string;
      };
    };
  };
}

class LocalAudioStorage {
  private db: IDBPDatabase<AudioDB> | null = null;

  async init() {
    this.db = await openDB<AudioDB>('audio-recordings', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('recordings')) {
          db.createObjectStore('recordings', { keyPath: 'id' });
        }
      },
    });
  }

  async saveRecording(blob: Blob, metadata: Partial<AudioDB['recordings']['value']['metadata']>) {
    if (!this.db) await this.init();
    
    const id = `recording_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const recording = {
      id,
      blob,
      metadata: {
        duration: 0,
        size: blob.size,
        mimeType: blob.type,
        createdAt: new Date(),
        ...metadata,
      },
    };

    await this.db!.put('recordings', recording);
    return id;
  }

  async getRecording(id: string) {
    if (!this.db) await this.init();
    return await this.db!.get('recordings', id);
  }

  async getAllRecordings() {
    if (!this.db) await this.init();
    return await this.db!.getAll('recordings');
  }

  async deleteRecording(id: string) {
    if (!this.db) await this.init();
    await this.db!.delete('recordings', id);
  }

  async getStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
      };
    }
    return null;
  }
}

export const audioStorage = new LocalAudioStorage();
```

### Cloud Storage with Presigned URLs

```typescript
// Next.js API Route: /app/api/upload-audio/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, fileSize } = await request.json();

    // Validate file
    if (fileSize > 25 * 1024 * 1024) { // 25MB limit
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const key = `recordings/${Date.now()}_${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600, // 1 hour
    });

    return NextResponse.json({ uploadUrl, key });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// Client-side upload
async function uploadToCloud(audioBlob: Blob, fileName: string) {
  // Get presigned URL
  const response = await fetch('/api/upload-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName,
      fileType: audioBlob.type,
      fileSize: audioBlob.size,
    }),
  });

  const { uploadUrl, key } = await response.json();

  // Upload directly to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: audioBlob,
    headers: {
      'Content-Type': audioBlob.type,
    },
  });

  return key;
}
```

## 7. React Hooks for Audio Recording

### Complete Audio Recording Hook

```typescript
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  onDataAvailable?: (blob: Blob) => void;
  timeslice?: number;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: Error | null;
  isSupported: boolean;
  analyser: AnalyserNode | null;
}

export const useAudioRecorder = (
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout>();

  const isSupported = typeof MediaRecorder !== 'undefined' && 
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia;

  const {
    mimeType = 'audio/webm;codecs=opus',
    audioBitsPerSecond = 128000,
    onDataAvailable,
    timeslice = 1000,
  } = options;

  // Cleanup function
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    setAnalyser(null);
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      streamRef.current = stream;

      // Setup audio analysis
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      source.connect(analyserNode);
      setAnalyser(analyserNode);

      // Create MediaRecorder
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        audioBitsPerSecond,
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          onDataAvailable?.(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        cleanup();
      };

      recorder.onerror = (event) => {
        setError(new Error(`MediaRecorder error: ${event}`));
        cleanup();
      };

      mediaRecorderRef.current = recorder;
      recorder.start(timeslice);
      
      setIsRecording(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();

      // Update duration
      durationIntervalRef.current = setInterval(() => {
        setDuration(Date.now() - startTimeRef.current);
      }, 100);

    } catch (err) {
      setError(err as Error);
      cleanup();
    }
  }, [mimeType, audioBitsPerSecond, onDataAvailable, timeslice, cleanup]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  }, [isRecording]);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  }, [isRecording, isPaused]);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now() - duration;
      durationIntervalRef.current = setInterval(() => {
        setDuration(Date.now() - startTimeRef.current);
      }, 100);
    }
  }, [isRecording, isPaused, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      cleanup();
    };
  }, [audioUrl, cleanup]);

  return {
    isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    audioBlob,
    audioUrl,
    error,
    isSupported,
    analyser,
  };
};
```

### Simple Voice Recorder Component

```typescript
import React from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { WaveformVisualizer } from './WaveformVisualizer';

export const VoiceRecorder: React.FC = () => {
  const {
    isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    audioBlob,
    audioUrl,
    error,
    isSupported,
    analyser,
  } = useAudioRecorder();

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className="text-red-500">
        Your browser doesn't support audio recording.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-900 rounded-lg">
      {error && (
        <div className="text-red-500 text-sm">
          Error: {error.message}
        </div>
      )}

      {isRecording && (
        <>
          <div className="text-white text-center text-2xl font-mono">
            {formatDuration(duration)}
          </div>
          <WaveformVisualizer analyser={analyser} isRecording={isRecording} />
        </>
      )}

      <div className="flex gap-2 justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Start Recording
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={pauseRecording}
                className="px-6 py-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                Resume
              </button>
            )}
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              Stop
            </button>
          </>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full" />
          <a
            href={audioUrl}
            download="recording.webm"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Download Recording
          </a>
        </div>
      )}
    </div>
  );
};
```

## 8. Whisper API Integration

### Next.js API Route for Whisper

```typescript
// /app/api/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import FormData from 'form-data';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const transcribeSchema = z.object({
  audio: z.instanceof(File),
  language: z.string().optional(),
  prompt: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as File;
    const language = formData.get('language') as string | null;
    const prompt = formData.get('prompt') as string | null;
    const temperature = formData.get('temperature') as string | null;

    // Validate input
    const validatedData = transcribeSchema.parse({
      audio,
      language: language || undefined,
      prompt: prompt || undefined,
      temperature: temperature ? parseFloat(temperature) : undefined,
    });

    // Check file size (25MB limit for Whisper API)
    if (validatedData.audio.size > 25 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File size exceeds 25MB limit' 
      }, { status: 400 });
    }

    // Create temp directory
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Save the uploaded file
    const tempInputPath = path.join(tempDir, `${uuidv4()}_input.webm`);
    const tempOutputPath = path.join(tempDir, `${uuidv4()}_output.mp3`);
    
    const arrayBuffer = await validatedData.audio.arrayBuffer();
    await fs.writeFile(tempInputPath, Buffer.from(arrayBuffer));

    // Convert to MP3 if needed (Whisper prefers MP3)
    let audioPath = tempInputPath;
    if (validatedData.audio.type !== 'audio/mpeg') {
      await execAsync(
        `ffmpeg -i "${tempInputPath}" -codec:a libmp3lame -b:a 128k "${tempOutputPath}"`
      );
      audioPath = tempOutputPath;
    }

    // Read the audio file
    const audioBuffer = await fs.readFile(audioPath);

    // Create form data for OpenAI API
    const openAIFormData = new FormData();
    openAIFormData.append('file', audioBuffer, {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg',
    });
    openAIFormData.append('model', 'whisper-1');
    
    if (validatedData.language) {
      openAIFormData.append('language', validatedData.language);
    }
    if (validatedData.prompt) {
      openAIFormData.append('prompt', validatedData.prompt);
    }
    if (validatedData.temperature !== undefined) {
      openAIFormData.append('temperature', validatedData.temperature.toString());
    }

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...openAIFormData.getHeaders(),
      },
      body: openAIFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Transcription failed');
    }

    const result = await response.json();

    // Cleanup temp files
    await Promise.all([
      fs.unlink(tempInputPath).catch(() => {}),
      fs.unlink(tempOutputPath).catch(() => {}),
    ]);

    return NextResponse.json({ 
      text: result.text,
      duration: result.duration,
      language: result.language,
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Transcription failed' 
    }, { status: 500 });
  }
}
```

### Client-Side Whisper Integration

```typescript
import { useState } from 'react';

interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
}

export const useWhisperTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transcribeAudio = async (
    audioBlob: Blob,
    options?: {
      language?: string;
      prompt?: string;
      temperature?: number;
    }
  ) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      if (options?.language) {
        formData.append('language', options.language);
      }
      if (options?.prompt) {
        formData.append('prompt', options.prompt);
      }
      if (options?.temperature !== undefined) {
        formData.append('temperature', options.temperature.toString());
      }

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response.json();
      setTranscription(result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transcription failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    transcribeAudio,
    isTranscribing,
    transcription,
    error,
  };
};
```

### Complete Voice Recording with Transcription Component

```typescript
import React, { useState } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { useWhisperTranscription } from './useWhisperTranscription';
import { WaveformVisualizer } from './WaveformVisualizer';

export const VoiceRecorderWithTranscription: React.FC = () => {
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    audioUrl,
    analyser,
  } = useAudioRecorder();

  const {
    transcribeAudio,
    isTranscribing,
    transcription,
    error: transcriptionError,
  } = useWhisperTranscription();

  const [autoTranscribe, setAutoTranscribe] = useState(true);

  const handleStopRecording = async () => {
    stopRecording();
    
    // Wait for the audio blob to be available
    setTimeout(async () => {
      if (audioBlob && autoTranscribe) {
        try {
          await transcribeAudio(audioBlob);
        } catch (error) {
          console.error('Auto-transcription failed:', error);
        }
      }
    }, 100);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Voice Recorder</h2>
        
        {isRecording && (
          <WaveformVisualizer 
            analyser={analyser} 
            isRecording={isRecording} 
          />
        )}

        <div className="flex gap-4 justify-center mt-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </button>
          )}
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoTranscribe}
              onChange={(e) => setAutoTranscribe(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Automatically transcribe after recording
            </span>
          </label>
        </div>
      </div>

      {audioUrl && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Recording</h3>
          <audio controls src={audioUrl} className="w-full mb-4" />
          
          {!transcription && !isTranscribing && (
            <button
              onClick={() => audioBlob && transcribeAudio(audioBlob)}
              disabled={!audioBlob || isTranscribing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Transcribe Audio
            </button>
          )}
        </div>
      )}

      {isTranscribing && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Transcribing audio...</span>
          </div>
        </div>
      )}

      {transcription && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Transcription</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{transcription.text}</p>
          {transcription.language && (
            <p className="text-sm text-gray-500 mt-2">
              Language: {transcription.language}
            </p>
          )}
        </div>
      )}

      {transcriptionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {transcriptionError}</p>
        </div>
      )}
    </div>
  );
};
```

## Common Pitfalls and Solutions

### 1. **Memory Leaks**
- Always revoke object URLs created with `URL.createObjectURL()`
- Stop all media tracks when done
- Clean up audio contexts and analyser nodes

### 2. **Safari Compatibility**
- Safari requires user interaction to start recording
- Use audio-recorder-polyfill for older Safari versions
- Test MIME type support before using

### 3. **Large File Handling**
- Implement chunked uploads for files > 10MB
- Use compression before uploading
- Consider streaming uploads for real-time processing

### 4. **Permission Handling**
- Always handle permission denials gracefully
- Provide clear instructions for enabling microphone
- Check permissions before attempting to record

### 5. **Audio Quality**
- Balance quality vs file size based on use case
- Use appropriate sample rates (16kHz for speech, 44.1kHz for music)
- Apply noise suppression for voice recordings

### 6. **Error Recovery**
- Implement retry logic for network failures
- Save recordings locally before uploading
- Provide manual upload options if auto-upload fails

## Recommended Libraries

1. **react-media-recorder** - Simple React component for recording
2. **wavesurfer.js** - Advanced waveform visualization
3. **lamejs** - Client-side MP3 encoding
4. **audio-recorder-polyfill** - MediaRecorder polyfill for Safari
5. **idb** - IndexedDB wrapper for local storage
6. **@ffmpeg/ffmpeg** - Client-side audio processing (WebAssembly)

## Performance Optimization Tips

1. **Use Web Workers** for audio processing to avoid blocking the main thread
2. **Implement lazy loading** for visualization components
3. **Throttle or debounce** visualization updates
4. **Use requestAnimationFrame** for smooth animations
5. **Limit recording duration** to prevent memory issues
6. **Compress audio** before uploading to reduce bandwidth

This comprehensive guide covers all aspects of implementing voice recording in Next.js applications, from basic MediaRecorder usage to advanced features like real-time visualization and Whisper API integration.