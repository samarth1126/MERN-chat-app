import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "8px 4px",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(139,92,246,0.3) transparent",
      }}
    >
      {messages &&
        messages.map((m, i) => {
          const isOwn = m.sender._id === user._id;
          const showAvatar =
            isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id);

          return (
            <div
              key={m._id}
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                justifyContent: isOwn ? "flex-end" : "flex-start",
              }}
            >
              {/* Avatar — only for other users */}
              {!isOwn && (
                <div
                  style={{ width: "32px", marginRight: "6px", flexShrink: 0 }}
                >
                  {showAvatar ? (
                    <Tooltip.Root positioning={{ placement: "bottom-start" }}>
                      <Tooltip.Trigger asChild>
                        <Avatar.Root
                          size="sm"
                          cursor="pointer"
                          style={{
                            border: "2px solid rgba(139,92,246,0.4)",
                            boxShadow: "0 0 8px rgba(139,92,246,0.2)",
                          }}
                        >
                          <Avatar.Image src={m.sender.pic} />
                          <Avatar.Fallback>{m.sender.name}</Avatar.Fallback>
                        </Avatar.Root>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        {m.sender.name}
                        <Tooltip.Arrow />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  ) : null}
                </div>
              )}

              {/* Bubble */}
              <div
                style={{
                  position: "relative",
                  maxWidth: "72%",
                  marginLeft: isOwn
                    ? "auto"
                    : isSameSenderMargin(messages, m, i, user._id),
                }}
              >
                <span
                  style={{
                    display: "block",
                    padding: "8px 14px",
                    borderRadius: isOwn
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                    letterSpacing: "0.01em",

                    // Own message — violet tinted
                    ...(isOwn
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(109,40,217,0.7), rgba(139,92,246,0.55))",
                          border: "1px solid rgba(139,92,246,0.35)",
                          color: "#ede9fe",
                          boxShadow:
                            "0 2px 12px rgba(109,40,217,0.25), 0 0 0 1px rgba(139,92,246,0.1) inset",
                        }
                      : // Other user — neutral dark
                        {
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          color: "rgba(255,255,255,0.88)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }),
                  }}
                >
                  {m.content}
                </span>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
