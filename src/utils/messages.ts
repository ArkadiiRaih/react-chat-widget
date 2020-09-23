import { ElementType } from 'react';

import { Message as MessageI, Link, CustomCompMessage, LinkParams } from '../store/types';

import Message from '../components/Widget/components/Conversation/components/Messages/components/Message';
import Snippet from '../components/Widget/components/Conversation/components/Messages/components/Snippet';
import QuickButton from '../components/Widget/components/Conversation/components/QuickButtons/components/QuickButton';

import { MESSAGES_TYPES, MESSAGE_SENDER, MESSAGE_BOX_SCROLL_DURATION } from '../constants';

export function createNewMessage(text: string, sender: string, id?: string): MessageI {
  return {
    type: MESSAGES_TYPES.TEXT,
    component: Message,
    text,
    sender,
    timestamp: new Date(),
    showAvatar: sender === MESSAGE_SENDER.RESPONSE,
    customId: id,
    unread: sender === MESSAGE_SENDER.RESPONSE
  };
}

export function createLinkSnippet(link: LinkParams, id?: string) : Link {
  return {
    type: MESSAGES_TYPES.SNIPPET.LINK,
    component: Snippet,
    title: link.title,
    link: link.link,
    target: link.target || '_blank',
    sender: MESSAGE_SENDER.RESPONSE,
    timestamp: new Date(),
    showAvatar: true,
    customId: id,
    unread: true
  };
}

export function createComponentMessage(component: ElementType, props: any, showAvatar: boolean, id?: string): CustomCompMessage {
  return {
    type: MESSAGES_TYPES.CUSTOM_COMPONENT,
    component,
    props,
    sender: MESSAGE_SENDER.RESPONSE,
    timestamp: new Date(),
    showAvatar,
    customId: id,
    unread: true
  };
}

export function createQuickButton(button: { label: string, value: string | number }) {
  return {
    component: QuickButton,
    label: button.label,
    value: button.value
  };
}

// TODO: Clean functions and window use for SSR

function sinEaseOut(timestamp: any, begining: any, change: any, duration: any) {
  return change * ((timestamp = timestamp / duration - 1) * timestamp * timestamp + 1) + begining;
}

/**
 * @param {*} target scroll target
 * @param {*} scrollStart
 * @param {*} scroll scroll distance
 * @param {*} speed scroll speed multiplier
 */
function scrollWithSlowMotion(target: any, scrollStart: any, scroll: number, speed?: number) {
  const raf = window?.requestAnimationFrame;
  let start = 0;
  const step = (timestamp) => {
    if (!start) {
      start = timestamp;
    }
    let stepScroll = sinEaseOut(timestamp - start, 0, scroll, MESSAGE_BOX_SCROLL_DURATION*(speed || 1));
    let total = scrollStart + stepScroll;
    target.scrollTop = total;
    if (total < scrollStart + scroll) {
      raf(step);
    }
  };
  raf(step);
}

export function scrollToLast(messagesDiv: HTMLDivElement | null) {
  if (!messagesDiv) return;

  const screenHeight = messagesDiv.clientHeight;
  const scrollTop = messagesDiv.scrollTop;
  const scrollOffset = messagesDiv.scrollHeight - (scrollTop + screenHeight);
  const scrollDistance = (scrollOffset < screenHeight) ? scrollOffset : (screenHeight - 20);

  if (scrollOffset) scrollWithSlowMotion(messagesDiv, scrollTop, scrollDistance);
}

export function scrollToPos(messagesDiv: HTMLDivElement | null, position: number) {
  if (!messagesDiv) return;

  const scrollTop = messagesDiv.scrollTop;

  if (position === 0) {
    scrollWithSlowMotion(messagesDiv, scrollTop, messagesDiv.scrollHeight, 2);
  } else {
    scrollWithSlowMotion(messagesDiv, scrollTop, position - 20, 2);
  }
}
