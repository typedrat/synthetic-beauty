import { action, computed } from "nanostores";
import { persistentMap } from "@nanostores/persistent";

import dayjs from "dayjs";

export type UserInfo =
    | {
          loggedIn: true;
          accessToken: string;
          refreshToken: string;
          expiration: dayjs.Dayjs;
      }
    | { loggedIn: false };

export const userInfo = persistentMap<UserInfo>(
    "userInfo:",
    { loggedIn: false },
    { encode: JSON.stringify, decode: JSON.parse }
);

export const isValid = computed(userInfo, (state) =>
    state.loggedIn
        ? !!(
              state.accessToken &&
              state.refreshToken &&
              state.expiration &&
              dayjs().isBefore(state.expiration)
          )
        : false
);

export const initialLogin = action(
    userInfo,
    "initialLogin",
    (store, accessToken: string, refreshToken: string, ttl: number) =>
        store.set({
            loggedIn: true,
            accessToken,
            refreshToken,
            expiration: dayjs().add(ttl, "seconds"),
        })
);

export const logOut = action(userInfo, "logOut", (store) =>
    store.set({ loggedIn: false })
);

export const refreshIfExpired = action(
    userInfo,
    "refreshIfExpired",
    (_store) => {
        if (isValid.get()) {
            return;
        }

        console.error("refreshIfExpired is not implemented yet!");
    }
);
