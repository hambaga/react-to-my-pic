export type EmojiUnicode = '👍' | '🤔' | '😆' | '💩';

interface Emoji {
  unicode: EmojiUnicode;
  color: string;
}

export const emojiMeta: Emoji[] = [
  {unicode: '👍', color: 'sandybrown'},
  {unicode: '🤔', color: 'indianred'},
  {unicode: '😆', color: 'dodgerblue'},
  {unicode: '💩', color: 'yellowgreen'}
];
