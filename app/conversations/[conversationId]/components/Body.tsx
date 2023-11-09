"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import React from "react";
import MessageBox from "./MessageBox";
import axios from "axios";

type Props = {
  initialMessages: FullMessageType[];
};

const Body = ({ initialMessages }: Props) => {
  const [messages, setMessages] =
    React.useState<FullMessageType[]>(initialMessages);
  const buttomRef = React.useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  React.useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
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
      <div ref={buttomRef} className="pt-24" />
    </div>
  );
};

export default Body;
