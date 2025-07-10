import { useRef,useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './skeleton/MessageSkeleton'
import ChatHeader from './ChatHeader.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { formatMsgTime } from '../lib/utils.js';

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeMessage, unsubscribeMessage}=useChatStore();

  useEffect(()=>{
    getMessages(selectedUser._id);
    subscribeMessage();
    return() => unsubscribeMessage();
  },[selectedUser._id,getMessages,subscribeMessage, unsubscribeMessage])

useEffect(()=>{
  if(messageRef.current && messages){messageRef.current.scrollIntoView({behavior:"smooth"})}
},[messages])

  const {authUser}= useAuthStore();
  const messageRef= useRef(null);

  if(isMessagesLoading) return (
  <div className="flex-1 flex flex-col overflow-auto">
    <ChatHeader/>
    <MessageSkeleton/>
    <MessageInput/>
  </div>
)
  return (
    <div className="flex-1 flex flex-col h-full bg-base-100 ml-4 ">
      <ChatHeader/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
       {messages.map((message)=>(
        <div key={message._id} className={`chat ${message.senderId===authUser._id ? "chat-end":"chat-start"}`}
        ref={messageRef}>
        <div className="chat-image avatar">
          <div className="size-10 rounded-full border">
            <img
            src={message.senderId=== authUser._id ?authUser.profilePic || "/avatar.png" :
              selectedUser.profilePic || "/avatar.png" 
                }   alt="profilePic"
            />
            </div>
          </div>
          <div className="chat-header mb-1">
             <time className="text-xs opacity-50 ml-1">{formatMsgTime(message.createdAt)}</time>
             </div>
             <div className="chat-bubble flex flex-col">
              {message.image && (
              <img src={message.image}
              alt="Attachment"
              className='sm:max-w-[200px] rounded-md mb-2'
              />
              )}
              {message.text && <p>{message.text}</p>}
              </div>
          </div>
       ))}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer