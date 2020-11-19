/* eslint-disable @typescript-eslint/no-explicit-any */

import superagent, { SuperAgentRequest, Response } from 'superagent';
import LocalStorage from './localstorage';

export default class RequestController {
  private cache: LocalStorage;
  private activeRequests: Record<string, { cancel: () => void }>;

  constructor(localStorageKeyPrefix: string) {
    this.cache = new LocalStorage(localStorageKeyPrefix);
    this.activeRequests = {};
  }

  public abortAll(): void {
    let canceledRequestsCount = 0;
    console.log('abortAll()');

    for (let path in this.activeRequests) {
      if (typeof this.activeRequests[path].cancel === 'function') {
        canceledRequestsCount ++;
        this.activeRequests[path].cancel();
      }
    }

    console.log(`Canceled ${canceledRequestsCount} requests.`);
  }

  public get<T>(path: string, cacheTimeMS = 0, delayMS = 0): Promise <T | undefined> {
    // State for managing cleanup and cancelling.
    let delay: number;
    let finished = false;
    let req: SuperAgentRequest;

    let cancel: () => void = () => {
      console.log('Canceling before async logic is launched...');
      finished = true;
    };

    const promise = new Promise((resolve, reject) => {
      // Redefine cancel method.
      cancel = () => {
        // In case the promise has already resolved/rejected, don't run cancel behavior!
        if (finished) {
          return;
        }

        // Cancel/abort and cleanup async logic.
        window.clearTimeout(delay);

        if (req) {
          req.abort();
        }

        console.log('Canceled.');
        reject(new Error('Promise canceled'));
      };

      // If was canceled before async logic was launched, reject immediately.
      if (finished) {
        console.log('Canceled before async logic was launched.');
        reject(new Error('Promise canceled'));
      }

      // Async logic:
      const cachedResponse: T | undefined = this.cache.get(path);

      // If cached, then return the result immediately.
      if (cachedResponse) {
        resolve(cachedResponse);
        return;
      }

      // Rate limit request with setTimeout.
      delay = window.setTimeout(() => {
        req = superagent.get('/admin/thissprint/get').query({ endpoint: path });
        req.then((response: unknown): void => {
          let responseBody = (response as Response).body;

          // Cache the response.
          this.cache.set(path, responseBody, cacheTimeMS);

          // Complete the promise.
          resolve(responseBody);
        }).catch((err) => {
          // Catch and ignore error thrown for 'Aborted' requests.
          // Pass along all other errors.
          if ('Aborted' !== err.message) {
            return err;
          }
        });
      }, delayMS);
    })
      // After any scenario, set `finished = true` so cancelling has no effect
      .then((responseBody: unknown): T => {
        finished = true;
        delete this.activeRequests[path];
        return (responseBody as T);
      })
      .catch((err) => {
        if (/^Request has been terminated/.test(err.message)) {
          console.log('err: TOO MANY REQUESTS');
          return this.get(path, cacheTimeMS, 10 * SECONDS);
        }

        finished = true;
        delete this.activeRequests[path];
        return err;
      });

    this.activeRequests[path] = { cancel };

    return promise;
  }
}
