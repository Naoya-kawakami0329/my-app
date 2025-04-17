"use client";

import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { FaPaperPlane } from "react-icons/fa6";
import { db } from '../firebase';
import { useAppContext } from '@/context/AppContext';
import OpenAI from 'openai';

type Message={
  text:string;
  sender:string
  createdAt:Timestamp
}
const Chat = () => {

  const openai=new OpenAI({
    apiKey:process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser:true
  })
  
  const {selectedRoom, userId}=useAppContext();
  const [inputMessage,setInputMessage]=useState<string>("");
  const [messages,setMessage]=useState<Message[]>([]);

  //各roomにおけるメッセージを取得
  useEffect(() => {
    if (!selectedRoom || !userId) return; //  どちらも揃ったときのみ
  
    const roomDocRef = doc(db, "rooms", selectedRoom!);
    const messagesCollectionRef = collection(roomDocRef, "messages");
    const q = query(messagesCollectionRef, orderBy("createdAt"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
      setMessage(newMessages);
    });
  
    return () => unsubscribe();
  }, [selectedRoom]);

  
  
  const sendMessage=async()=>{
    if (!inputMessage.trim() || !selectedRoom) return; 
    if(!inputMessage.trim()) return;
    const messageData={
      text:inputMessage,
      sender:"user",
      createdAt:serverTimestamp(),
    }

    //メッセージをFirestoreに保存
    const roomDocRef=doc(db,"rooms",
      selectedRoom)
    const messageCollectionRef=collection(roomDocRef,"messages")
    await addDoc(messageCollectionRef,messageData);

    //OpenAiからの返信
    const gpt3Response=await openai.chat.completions.create({
messages:[{role:"user",content:inputMessage}],
model:"gpt-3.5-turbo",
    })
    const botResponse=gpt3Response.choices[0].message.content;
    await addDoc(messageCollectionRef,{
      text:botResponse,
      sender:"bot",
      createdAt:serverTimestamp(),
    });
  }
  return (
    <div className='bg-gray-500 h-full p-4 flex flex-col'>
      <h1 className='tezt-2xl text-white font-semibold mb-4'>room1</h1>
      <div className='flex-grow overflow-y-auto mb-4'>
      {messages.map((message,index)=>(
        <div key={index} className={message.sender==="user" ? "text-right" : "text-left"}>
          <div className={message.sender==="user" ?  'bg-blue-500 inline-block rounded px-4 py-2 mb-2':'bg-green-500 inline-block rounded px-4 py-2 mb-2' }>
<p className="text-white">{message.text}</p>
          </div>
        </div>
      ))}
      </div>
       <div className='flex-shrink-0 relative'>
        <input 
        type="text" 
        placeholder='send a message' 
        className='rounded border-2 w-full pr-10 focus:outline-none p-2'
        onChange={(e)=>setInputMessage(e.target.value)}
        />
        <button 
        className='absolute inset-y-0 right-4 flex items-center'
        onClick={(e)=>sendMessage()}>
            <FaPaperPlane/>
        </button>
      </div>
    </div>
  
  )
}

export default Chat
