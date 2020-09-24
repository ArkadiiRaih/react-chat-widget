import React, { useEffect, useRef, useState, ElementRef, ImgHTMLAttributes, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import format from 'date-fns/format';

import { scrollToLast, scrollToPos } from '../../../../../../utils/messages';
import { Message, Link, CustomCompMessage, GlobalState } from '../../../../../../store/types';
import { setBadgeCount, markAllMessagesRead, rememberWindowPos } from '@actions';
import { getWindowPos } from "../../../../../../store/dispatcher";

import Loader from './components/Loader';
import './styles.scss';

type Props = {
  showTimeStamp: boolean,
  profileAvatar?: string;
}

let scrolledToBottom = true;
let prevScrollPos = 0;
let tmpMessagesLength = 0;

function Messages({ profileAvatar, showTimeStamp }: Props) {
  const dispatch = useDispatch();
  const { messages, typing, showChat, badgeCount } = useSelector((state: GlobalState) => ({
    messages: state.messages.messages,
    badgeCount: state.messages.badgeCount,
    typing: state.behavior.messageLoader,
    showChat: state.behavior.showChat
  }));

  const messageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (tmpMessagesLength < messages.length) {
      console.log('useEffect [messages] ', messages);

      if (scrolledToBottom && getWindowPos()) {
        setTimeout(() => { scrollToLast(messageRef.current); }, 20)
      }
    }
    tmpMessagesLength = messages.length;
  }, [messages.length]);
  useEffect(() => {
    console.log('useEffect [messages, badgeCount, showChat]');

    if (showChat && badgeCount) {
      dispatch(markAllMessagesRead());
    } else {
      dispatch(setBadgeCount(messages.filter((message) => message.unread).length));
    }
  }, [messages, badgeCount, showChat]);
  useEffect(() => {
    console.log('useEffect [showChat] ', showChat);

    if (messageRef.current) {
      console.log('useEffect [showChat] scrollHeight ', messageRef.current.scrollHeight);

      scrollToPos(messageRef.current, getWindowPos());
      dispatch(rememberWindowPos(messageRef.current.scrollHeight));
    }
  }, [showChat]);

  const getComponentToRender = (message: Message | Link | CustomCompMessage) => {
    const ComponentToRender = message.component;
    if (message.type === 'component') {
      return <ComponentToRender {...message.props} />;
    }
    return <ComponentToRender message={message} showTimeStamp={showTimeStamp} />;
  };

  const onScroll = e => {
    const {clientHeight, scrollHeight, scrollTop} = e.target;
    const scrollOffset = scrollHeight - (scrollTop + clientHeight);

    if (scrollTop < prevScrollPos) {
      scrolledToBottom = false;
    }
    scrolledToBottom = scrollOffset <= 20;

    console.log('==================================================');
    console.log('onScroll clientHeight ', clientHeight);
    console.log('onScroll scrollHeight ', scrollHeight);
    console.log('onScroll prevScrollPos ', prevScrollPos);
    console.log('onScroll scrollTop ', scrollTop);
    console.log('onScroll scrollOffset ', scrollOffset);
    console.log('onScroll ___scrolledToBottom___ ', scrolledToBottom);
    console.log('==================================================');

    prevScrollPos = scrollTop;
  };

  // TODO: Fix this function or change to move the avatar to last message from response
  // const shouldRenderAvatar = (message: Message, index: number) => {
  //   const previousMessage = messages[index - 1];
  //   if (message.showAvatar && previousMessage.showAvatar) {
  //     dispatch(hideAvatar(index));
  //   }
  // }

  return (
    <div id="messages" className="rcw-messages-container" ref={messageRef} onScroll={onScroll}>
      {messages?.map((message, index) =>
        <div className="rcw-message" key={`${index}-${format(message.timestamp, 'hh:mm')}`}>
          {profileAvatar &&
            message.showAvatar &&
            <img src={profileAvatar} className="rcw-avatar" alt="profile" />
          }
          {getComponentToRender(message)}
        </div>
      )}
      <Loader typing={typing} />
    </div>
  );
}

export default Messages;
