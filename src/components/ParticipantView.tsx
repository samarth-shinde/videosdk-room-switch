import React, { useEffect, useMemo, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

interface ParticipantViewProps {
  participantId: string;
  isLocal?: boolean;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({
  participantId,
  isLocal = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal: isLocalParticipant, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (videoRef.current) {
      if (videoStream) {
        videoRef.current.srcObject = videoStream;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [videoStream]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch(() => {});
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="participant-view">
      <div className="video-container">
        {webcamOn && videoStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="video-placeholder">
            <div className="avatar">{displayName?.charAt(0).toUpperCase() || "?"}</div>
          </div>
        )}
        <div className="participant-info">
          <span className="participant-name">
            {displayName || "Participant"} {isLocalParticipant && "(You)"}
          </span>
          <div className="status-indicators">
            <span className={`indicator ${micOn ? "on" : "off"}`}>
              {micOn ? "🎤" : "🔇"}
            </span>
            <span className={`indicator ${webcamOn ? "on" : "off"}`}>
              {webcamOn ? "📹" : "📷"}
            </span>
          </div>
        </div>
      </div>
      <audio ref={micRef} autoPlay muted={isLocalParticipant} />
    </div>
  );
};

export default ParticipantView;
