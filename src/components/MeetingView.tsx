import React, { useState, useRef } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
import Controls from "./Controls";

interface MeetingViewProps {
  meetingId: string;
  roomLabel: string;
  otherRoomId: string | null;
  token: string;
  onSwitchRoom: (newRoomId: string) => void;
  onLeave: () => void;
  onMediaRelay: (destinationMeetingId: string) => void;
  isMediaRelaying: boolean;
  mediaRelayTarget: string | null;
}

const MeetingView: React.FC<MeetingViewProps> = ({
  meetingId,
  roomLabel,
  otherRoomId,
  token,
  onSwitchRoom,
  onLeave,
  onMediaRelay,
  isMediaRelaying,
  mediaRelayTarget,
}) => {
  const [joined, setJoined] = useState<"JOINING" | "JOINED" | "LEFT">("JOINING");
  const isSwitching = useRef(false);

  const { participants, localParticipant, leave, meeting } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: () => {
      setJoined("LEFT");
      if (!isSwitching.current) {
        onLeave();
      }
    },
    onMediaRelayStarted: ({ meetingId: relayMeetingId }) => {
      console.log("Media relay started:", relayMeetingId);
    },
    onMediaRelayStopped: () => {
      onMediaRelay("");
    },
    onMediaRelayError: ({ error }) => {
      console.error("Media relay error:", error);
    },
    onError: (error) => {
      console.error("Meeting error:", error);
    },
  });

  const handleNormalSwitch = () => {
    if (otherRoomId) {
      isSwitching.current = true;
      leave();
      setTimeout(() => {
        onSwitchRoom(otherRoomId);
      }, 100);
    }
  };

  const handleMediaRelay = () => {
    if (otherRoomId && meeting) {
      if (isMediaRelaying && mediaRelayTarget === otherRoomId) {
        meeting.stopMediaRelay(otherRoomId);
        onMediaRelay("");
      } else {
        meeting.requestMediaRelay({
          destinationMeetingId: otherRoomId,
          token: token,
          kinds: ["audio", "video"],
        });
        onMediaRelay(otherRoomId);
      }
    }
  };

  if (joined === "JOINING") {
    return (
      <div className="meeting-view joining">
        <div className="loader">
          <div className="spinner"></div>
          <p>Joining {roomLabel}...</p>
        </div>
      </div>
    );
  }

  if (joined === "LEFT" && !isSwitching.current) {
    return (
      <div className="meeting-view left">
        <p>You have left the meeting</p>
      </div>
    );
  }

  const participantIds = Array.from(participants.keys());

  return (
    <div className="meeting-view">
      <div className="meeting-header">
        <h2>{roomLabel}</h2>
        <span className="meeting-id">ID: {meetingId}</span>
        {isMediaRelaying && (
          <span className="relay-status">Relaying</span>
        )}
      </div>

      <div className="participants-grid">
        {participantIds.map((participantId) => (
          <ParticipantView
            key={participantId}
            participantId={participantId}
            isLocal={participantId === localParticipant?.id}
          />
        ))}
      </div>

      <Controls />

      <div className="room-actions">
        <div className="action-section">
          <h3>Room Switch</h3>
          <button
            className="action-btn switch-btn"
            onClick={handleNormalSwitch}
            disabled={!otherRoomId}
          >
            Switch to {roomLabel === "Room A" ? "Room B" : "Room A"}
          </button>
        </div>

        <div className="action-section">
          <h3>Media Relay</h3>
          <button
            className={`action-btn relay-btn ${isMediaRelaying ? "active" : ""}`}
            onClick={handleMediaRelay}
            disabled={!otherRoomId}
          >
            {isMediaRelaying && mediaRelayTarget === otherRoomId
              ? "Stop Relay"
              : `Relay to ${roomLabel === "Room A" ? "Room B" : "Room A"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingView;
