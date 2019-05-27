import React, {useEffect, useState, Fragment, useCallback} from 'react';
import Unsplash from 'unsplash-js';
import {unsplash} from './keys.json';
import {
  Arrow,
  ColumnFlex,
  Content,
  Emojis,
  ErrorContent,
  FeaturedImage,
  Spinner,
  Emoji,
  Link,
} from './App.styled';

interface CarouselItem {
  src: string;
  reaction: string | null;
  author: string;
  authorUrl: string;
  imageUrl: string;
}

export type EmojiUnicode = '👍' | '🤔' | '😆' | '😋';

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
          .then(({urls, user, links}) => {
            return new Promise(resolve => {
              const image = new Image();
              image.src = urls.regular;
              image.onload = () => {
                setCarousel(carousel => {
                  if (carousel.length === 0) {
                    setLoading(false);
                  }
                  return [...carousel, {
                    src: image.src,
                    reaction: null,
                    author: user.name,
                    authorUrl: user.links.html,
                    imageUrl: links.html
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
    setCarousel([...restCarousel, {src: '', reaction: null, author: '', authorUrl: '', imageUrl: ''}]);
    setLoading(true);
    photos.getRandomPhoto({})
      .then(res => res.json())
      .then((val) => {
        console.log(val);
        const {urls, user, links} = val;
        const src = urls.regular;
        setCarousel([
          ...restCarousel, {
            src,
            reaction: null,
            author: user.name,
            authorUrl: user.links.html,
            imageUrl: links.html
          }
        ]);
        return new Promise(resolve => {
          const image = new Image();
          image.src = urls.regular;
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

  if (error) {
    return (
      <ErrorContent>
        <p>
          Unfortunately, the Unsplash folks only allow 50 requests per hour for development.
          If you see this message, it means that the request to get their pictures have been blocked.
          Please try again in an hour <span aria-label="aww" role="img">😅</span>
        </p>
      </ErrorContent>
    )
  }

  const showSpinner = (loading && carousel.length < 2) || (loading && current === carousel.length - 1);

  return (
    <Fragment>
      <Content>
        {showSpinner
          ? <Spinner/>
          : (
            <Fragment>
              <Arrow onClick={decrement} hidden={current === 0} direction="left"/>
              <ColumnFlex>
                <a href={carousel[current].imageUrl} rel="noopener noreferrer" target="_blank">
                  <FeaturedImage src={carousel[current].src} alt=""/>
                </a>
                {carousel[current].author.length > 0 && (
                  <h4>
                    Image by{' '}
                    <Link href={carousel[current].authorUrl} rel="noopener noreferrer" target="_blank">
                      {carousel[current].author}
                    </Link>
                  </h4>
                )}
                <Emojis>
                  {['👍', '🤔', '😆', '😋'].map((emoji) => (
                    <Emoji
                      onClick={getEmojiHandler(emoji as EmojiUnicode)}
                      blurred={carousel[current].reaction !== null && carousel[current].reaction !== emoji}
                      key={emoji}
                      role="img"
                    >
                      {emoji}
                    </Emoji>
                  ))}
                </Emojis>
              </ColumnFlex>
              <Arrow
                onClick={increment}
                hidden={current === carousel.length - 2 || current === carousel.length - 1 || carousel.length < 2}
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
