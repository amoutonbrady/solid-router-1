import { Routing } from './types';
import { pathToLocation, pathNameToLocation } from './utils';

export function browserPathRouting(): Routing {
  const get = () => pathNameToLocation(document.location.pathname, document.location.search);
  return {
    listen: (set) => {
      const handlePopState = () => set(get());
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    },
    get,
    push: (next) => {
      history.pushState(null, '', next.pathName);
    },
    replace: (next) => {
      history.replaceState(null, '', next.pathName);
    },
    origin:() => window.location.origin
  };
}

export function browserHashRouting(): Routing {
  const get = () => pathNameToLocation(document.location.hash.slice(1) || '/', document.location.search);
  return {
    listen: (set) => {
      const handleHashChange = () => set(get());
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    },
    get,
    push: (next) => {
      window.location.hash = next.pathName;
      return true;
    },
    replace: (next) => {
      window.location.hash = next.pathName;
      return true;
    },
    origin: () => window.location.origin
  };
}

export function memoryRouting(origin: string, initialPath: string, max: number = 50): Routing {
  const history: string[] = [initialPath];
  return {
    listen: (_set) => () => {},
    get: () => pathToLocation(history[0] || '/'),
    push: (next) => {
      if (history.unshift(next.path) > max) {
        history.splice(max, Infinity);
      }
    },
    replace: (next) => {
      history[0] = next.path;
    },
    origin: () => origin
  };
}