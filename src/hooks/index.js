import { useState, useEffect, useRef } from 'react';

// Hook
export function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }
    
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export function useIntersect ({ root = null, rootMargin, threshold = [0] }) {
  const [entry, updateEntry] = useState({});
  const [node, setNode] = useState(null);

  const observer = useRef(null);

  useEffect(
    () => {
      if(observer.current) {
        observer.current.disconnect();
      }
      observer.current = new window.IntersectionObserver(([entry]) => updateEntry(entry), {
        root,
        rootMargin,
        threshold
      })

      const { current: currentObserver } = observer;
      if (node) currentObserver.observe(node);

      return () => currentObserver.disconnect();
    },
    [node, root, rootMargin, threshold]
  );

  return [setNode, entry];
};