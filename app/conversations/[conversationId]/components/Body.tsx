"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import React from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import getConversationById from "@/app/actions/getConversationById";
import { find } from "lodash";

type Props = {
  initialMessages: FullMessageType[];
};

const Body = ({ initialMessages }: Props) => {
  const [messages, setMessages] =
    React.useState<FullMessageType[]>(initialMessages);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  React.useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  React.useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const messageHandler = (message: FullMessageType) => {
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });

      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("messages:update", messageHandler);
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("messages:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageBox
          key={index}
          isLast={index === messages.length - 1}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
