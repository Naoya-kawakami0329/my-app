"use client";

import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { FaPaperPlane } from "react-icons/fa6";
import { db } from '../firebase';
import { useAppContext } from '@/context/AppContext';

type Message={
  text:string;
  sender:string
  createdAt:Timestamp
}
const Chat = () => {
  const {selectedRoom}=useAppContext();
  const [inputMessage,setInputMessage]=useState<string>("");
  const [message,setMessage]=useState<Message[]>([]);

  //各roomにおけるメッセージを取得
  useEffect(()=>{
if(selectedRoom){
      const fetchMessages=async()=>{
      const roomDocRef=doc(db,"rooms")
      const messagesCollectionRef=collection(roomDocRef,"messsages");
      const q=query(messagesCollectionRef,orderBy("createdAt"))
      const unsubscribe=onSnapshot(q,(snapshot)=>{
       const newMessages=snapshot.docs.map((doc)=>doc.data() as Message)
       setMessage(newMessages)
    })
    return ()=>{
      unsubscribe();
    }
  }
  fetchMessages()
  }},[selectedRoom])

  const sendMessage=async()=>{
    if(!inputMessage.trim()) return;
    const messageData={
      text:inputMessage,
      sender:"user",
      createdAt:serverTimestamp(),
    }

    //メッセージをFirestoreに保存
    const roomDocRef=doc(db,"rooms",
      "sZPGRTCLRKkELgKVCyOd")
    const messageCollectionRef=collection(roomDocRef,"messages")
    await addDoc(messageCollectionRef,messageData)
    
  }
  return (
    <div className='bg-gray-500 h-full p-4 flex flex-col'>
      <h1 className='tezt-2xl text-white font-semibold mb-4'>room1</h1>
      <div className='flex-grow overflow-y-auto mb-4'>
        <div className='text-right'> 
            <div className='bg-blue-500 inline-block rounded px-4 py-2 mb-2'>
               <p className='text-white font-medium'>Hello</p> 
            </div>
        </div>
        <div className='text-left'> 
            <div className='bg-green-500 inline-block rounded px-4 py-2 mb-2'>
               <p className='text-white font-medium'>How are you?</p> 
            </div>
        </div>
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
