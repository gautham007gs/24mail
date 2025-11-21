// Chaotic, funny messages to make the site memorable

export const funMessages = {
  welcome: [
    "Broooo your temp mail is ready 😭🔥",
    "Temp mail go brrrrr 🚀✨",
    "Your email is hot and fresh 🔥🍕",
    "Mail machine activated 🤖💌",
  ],
  
  emptyInbox: [
    "Nobody emailed you bro 😭💀",
  ],
  
  loading: [
    "One sec bro, your email is shy rn 😭",
    "Loading... pls be patient, I'm speed running 🏃💨",
    "Fetching ur stuff... brb 🚀",
    "Email is having a glow up ✨💅",
    "Just vibing while data loads 🎵😎",
    "Your mail said 'wait a sec' 🤐",
    "Summoning emails from the void 🌌",
    "Email loading... or is it? 👀",
  ],
  
  copied: [
    "Copied! Now go change the world 💪✨",
    "Boom! Email on your clipboard 📋🔥",
    "Yoinked! 📌",
    "That email ain't going nowhere now 🫡",
    "Clipboard has entered the chat 💬",
  ],
  
  emailArrived: [
    "YOOO MAIL DROPPED 📬🔥",
    "You got mail homie! 💌✨",
    "New email alert: You're finally famous 🌟",
    "Somebody loves you... or at least your email 😭💕",
    "MAIL INCOMING 📨🚀",
  ],
};

export function getRandomMessage(category: keyof typeof funMessages): string {
  const messages = funMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
}
