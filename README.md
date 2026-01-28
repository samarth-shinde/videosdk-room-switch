# VideoSDK Room Switch

React app demonstrating room switching and media relay using VideoSDK.

## Setup

```bash
npm install
npm start
```

Get your token from [app.videosdk.live](https://app.videosdk.live/) and enter it when the app starts.

## Features

### Room Switching
Switch between Room A and Room B using the `leave()` method followed by joining the new room. The MeetingProvider remounts with new meetingId.

```tsx
const handleSwitch = () => {
  leave();
  setTimeout(() => {
    setMeetingId(newRoomId);
  }, 100);
};
```

### Media Relay
Relay your audio/video to another room while staying in current room using `requestMediaRelay()`:

```tsx
meeting.requestMediaRelay({
  destinationMeetingId: otherRoomId,
  token: token,
  kinds: ["audio", "video"],
});
```

## Differences

| | Room Switch | Media Relay |
|---|---|---|
| Your location | Moves to new room | Stays in current room |
| Communication | Two-way | One-way broadcast |
| Use case | Changing rooms | Broadcasting to multiple rooms |

## Notes

- Room switch has a brief transition moment
- Media relay is one-way only, you can't frpm the destination room
- Use `key={meetingId}` on MeetingProvider for clean remounts
