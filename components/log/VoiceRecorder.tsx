'use client'

import { useState, useRef, useEffect } from 'react'
import { formatTime } from '@/lib/utils/helpers'

interface VoiceRecorderProps {
  isRecording: boolean
  onRecordingStart: () => void
  onRecordingComplete: (audioBlob: Blob) => void
  onRecordingCancel: () => void
}

export function VoiceRecorder({
  isRecording,
  onRecordingStart,
  onRecordingComplete,
  onRecordingCancel,
}: VoiceRecorderProps) {
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onRecordingComplete(blob)
        stream.getTracks().forEach((track) => track.stop())
        setRecordingTime(0)
      }

      mediaRecorder.start()
      onRecordingStart()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      const stream = mediaRecorderRef.current.stream
      mediaRecorderRef.current.stop()
      stream.getTracks().forEach((track) => track.stop())
      mediaRecorderRef.current = null
      chunksRef.current = []
      setRecordingTime(0)
      setIsPaused(false)
      onRecordingCancel()
    }
  }

  const prompts = [
    "What were today's key achievements?",
    "What challenges did you face?",
    "What did you learn today?",
    "What's your focus for tomorrow?",
  ]

  return (
    <div className="card">
      <div className="text-center">
        {!isRecording ? (
          <>
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-6xl">🎙️</span>
              </div>
              <h3 className="heading-3 mb-2">Ready to Reflect?</h3>
              <p className="text-muted">
                Take 2-5 minutes to capture your daily voyage
              </p>
            </div>

            <button
              onClick={startRecording}
              className="btn-primary px-8 py-3 text-lg mb-6"
            >
              🔴 Start Recording
            </button>

            <div className="text-left bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Reflection Prompts:</h4>
              <ul className="space-y-1 text-sm text-muted">
                {prompts.map((prompt, index) => (
                  <li key={index}>• {prompt}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <span className="text-6xl">🎙️</span>
              </div>
              <h3 className="heading-3 mb-2">Recording...</h3>
              <p className="font-mono text-2xl text-primary">
                {formatTime(recordingTime)}
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="btn-ghost px-4 py-2"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="btn-ghost px-4 py-2"
                >
                  ▶️ Resume
                </button>
              )}
              <button
                onClick={stopRecording}
                className="btn-primary px-4 py-2"
              >
                ⏹️ Finish
              </button>
              <button
                onClick={cancelRecording}
                className="btn-ghost px-4 py-2"
              >
                ❌ Cancel
              </button>
            </div>

            <div className="text-sm text-muted space-y-1">
              <p>Speak naturally and take your time</p>
              <p>Your reflection will be transcribed automatically</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}