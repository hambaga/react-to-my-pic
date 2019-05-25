import React, {useEffect, useState, Fragment, useCallback} from 'react';
import Unsplash from 'unsplash-js';
import {unsplash} from './keys.json';
import {Arrow, ColumnFlex, Content, Emojis, ErrorContent, FeaturedImage, Spinner, Emoji} from './App.styled';

interface CarouselItem {
  src: string;
  reaction: EmojiUnicode | null;
}

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

const {photos} = new Unsplash(unsplash);

const App = () => {
  const [carousel, setCarousel] = useState<CarouselItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Preload the first two images, toggle the loading state when the first image finishes loading
  useEffect(() => {
    Promise.all(
      Array.from(Array(2)).map(() =>
        photos.getRandomPhoto({})
          .then(res => res.json())
          .then(val => {
            return new Promise(resolve => {
              const image = new Image();
              image.src = val.urls.regular;
              image.onload = () => {
                setCarousel(carousel => {
                  if (carousel.length === 0) {
                    setLoading(false);
                  }
                  return [...carousel, {
                    src: image.src,
                    reaction: null
                  }];
                });
                resolve();
              };
            });
          })
      )
    ).catch(() => setError(true));
  }, []);

  /**
   * Whenever the user reaches the last image of the carousel, this hook will prefetch the next image
   * to avoid showing the loading state
   */
  useEffect(() => {
    if (current !== carousel.length - 1 || carousel.length < 2) { return; }
    const restCarousel = [...carousel];
    setCarousel([...restCarousel, {src: '', reaction: null}]);
    setLoading(true);
    photos.getRandomPhoto({})
      .then(res => res.json())
      .then(val => {
        const src = val.urls.regular;
        setCarousel([...restCarousel, {src, reaction: null}]);
        return new Promise(resolve => {
          const image = new Image();
          image.src = val.urls.regular;
          image.onload = () => {
            setLoading(false);
            resolve();
          };
        });
      })
      .catch(() => setError(true));
  }, [current, carousel]);

  const decrement = useCallback(() => {
    if (current === 0) { return; }
    setCurrent(current => current - 1);
  }, [current]);

  const increment = useCallback(() => {
    if (current === carousel.length - 1) { return; }
    setCurrent(current => current + 1);
  }, [current, carousel]);

  const getEmojiHandler = useCallback((emoji: EmojiUnicode) => {
    return () => {
      const newCarousel = [...carousel];
      newCarousel[current].reaction = emoji;
      setCarousel(newCarousel);
      setCurrent(current => current + 1);
    };
  }, [carousel, current]);

  return (
    <Fragment>
      {error && (
        <ErrorContent>
          <p>
            Unfortunately, the Unsplash folks only allow 50 requests per hour for development.
            If you see this message, it means that the request to get their pictures have been blocked.
            Please try again in an hour <span aria-label="aww" role="img">😅</span>. But hey, you can still
            check your status:
          </p>
        </ErrorContent>
      )}
      <Content>
        {(loading && carousel.length < 2) || (loading && current === carousel.length - 1)
          ? <Spinner/>
          : (
            <Fragment>
              <Arrow onClick={decrement} hidden={current === 0} direction="left"/>
              <ColumnFlex>
                <FeaturedImage src={carousel[current].src} alt=""/>
                <Emojis>
                  {emojiMeta.map(({unicode}) => (
                    <Emoji
                      onClick={getEmojiHandler(unicode)}
                      blurred={carousel[current].reaction !== null && carousel[current].reaction !== unicode}
                      key={unicode}
                      role="img"
                    >
                      {unicode}
                    </Emoji>
                  ))}
                </Emojis>
              </ColumnFlex>
              <Arrow
                onClick={increment}
                hidden={current === carousel.length - 2 || carousel.length < 2 || current === carousel.length - 1}
                direction="right"
              />
            </Fragment>
          )
        }
      </Content>
    </Fragment>
  );
};

export default App;
