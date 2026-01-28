export const AUTH_TOKEN = "YOUR_AUTH_TOKEN_HERE";
export const API_BASE_URL = "https://api.videosdk.live/v2";

export const createMeeting = async (token: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create meeting: ${response.statusText}`);
  }

  const data = await response.json();
  return data.roomId;
};

export const validateMeeting = async (
  token: string,
  meetingId: string
): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/rooms/validate/${meetingId}`, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.roomId === meetingId;
};
