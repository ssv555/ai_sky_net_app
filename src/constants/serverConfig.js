const BOT_USERNAME =
  new URLSearchParams(window.location.search).get("bot_username") ||
  "unknown_bot_username";

const SERVER_PORT =
  new URLSearchParams(window.location.search).get("port") || 5000;

export const isDevMode = () => {
  return BOT_USERNAME.toLowerCase().trim() !== "ai_sky_net_bot";
};

export const getServerUrl = () => {
  return isDevMode()
    ? `http://localhost:${SERVER_PORT}/api/data`
    : `http://195.2.75.212:${SERVER_PORT}/api/data`;
};
