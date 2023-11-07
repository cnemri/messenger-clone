import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

type Props = {
  children?: React.ReactNode;
};

const ConversationsLayout = ({ children }: Props) => {
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={[]} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ConversationsLayout;
