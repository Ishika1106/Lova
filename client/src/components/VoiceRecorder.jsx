// src/components/VoiceRecorder.jsx
import { useState, useRef } from "react";
import axios from "axios";
import API_URL from "../api";

export default function VoiceRecorder({ setVoicePrompt }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Convert audio to text via Sarvam/WhisperFlow API
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "voice.webm");

          // Replace with your server endpoint that calls Sarvam API
          const res = await axios.post(`${API_URL}/api/voice-to-text`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          setVoicePrompt(res.data.transcription);
        } catch (err) {
          console.error("Voice transcription error:", err);
          alert("Failed to convert voice to text");
        } finally {
          setLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Please allow microphone access");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded font-medium ${
            recording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        {loading && <span className="text-yellow-300">Transcribing...</span>}
      </div>

      {audioURL && (
        <audio controls className="mt-2 w-full rounded bg-[#2a1a4d]">
          <source src={audioURL} type="audio/webm" />
          Your browser does not support audio playback.
        </audio>
      )}
    </div>
  );
}