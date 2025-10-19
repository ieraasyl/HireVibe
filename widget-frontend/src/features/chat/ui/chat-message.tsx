import { Avatar, Box, Text } from "@mantine/core";

// Accept flexible message shapes coming from the backend. Some payloads
// nest the text under `message.message` or provide timestamps as strings.
export interface Message {
  id: string;
  // some backends send content directly in `content`, others in `message.message`
  content?: string;
  message?: any;
  role: "user" | "assistant";
  // timestamp can be a Date or an ISO string depending on the sender
  timestamp?: Date | string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Prefer nested `message.message` if present, otherwise use `content`.
  // Support cases where `message.message` is an object with a `content` field
  // or a plain string.
  console.log("ChatMessage rendering message:", message);

  const rawContent = (() => {
    const tryParseJson = (value: string) => {
      try {
        console.log("Trying to parse JSON:", value);
        return JSON.parse(value);
      } catch (e) {
        return null;
      }
    };

    // If the server sent a stringified JSON (e.g. the WebSocket connection
    // ack), try to parse it and extract a friendly message.
    if (typeof message.content === "string") {
      const parsed = tryParseJson(message.content);
      if (parsed) {
        // if parsed has a `message` or `content` field, prefer that
        if (typeof parsed === "object") {
          return (
            (parsed.message && (parsed.message.content || parsed.message.text || parsed.message)) ||
            parsed.content ||
            parsed.text ||
            JSON.stringify(parsed)
          );
        }
        return String(parsed);
      }
    }

    if (message.message) {
      if (typeof message.message === "string") return message.message;
      if (typeof message.message === "object") {
        // common shape: { message: { content: "..." } }
        return (
          (message.message.content as string) ||
          (message.message.text as string) ||
          JSON.stringify(message.message)
        );
      }
    }

    return message.content ?? "";
  })();

  // Normalize timestamp to a Date object. If missing, use `new Date()`.
  const ts = (() => {
    if (!message.timestamp) return new Date();
    if (message.timestamp instanceof Date) return message.timestamp;
    try {
      return new Date(message.timestamp as string);
    } catch (e) {
      return new Date();
    }
  })();

  return (
    <Box
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px",
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      <Avatar
        size="sm"
        radius="xl"
        color={isUser ? "blue" : "gray"}
        style={{ flexShrink: 0 }}
      >
        {isUser ? "U" : "AI"}
      </Avatar>

      <Box style={{ flex: 1, maxWidth: "70%" }}>
        <Text
          size="sm"
          style={{
            padding: "8px 4px",
            borderRadius: "12px",
            backgroundColor: isUser ? "#228be6" : "#f1f3f5",
            color: isUser ? "white" : "#212529",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {rawContent}
        </Text>
        <Text size="xs" c="dimmed" mt={4} ta={isUser ? "right" : "left"}>
          {ts.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Box>
    </Box>
  );
}
