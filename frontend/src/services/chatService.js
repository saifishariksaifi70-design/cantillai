
import api from "./api";

export const sendChatMessage = (message, token) =>
  api.post(
    "/chat/message",
    { message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
