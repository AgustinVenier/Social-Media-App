import { type User } from "@/models";

export const persistenceUserInfo = (userInfo: User) => {
  cookieStore.set("userInfo", JSON.stringify(userInfo));
};

export const getPersistedUserInfo = async () => {
  const userInfoCookie = await cookieStore.get("userInfo");
  if (userInfoCookie && userInfoCookie.value) {
    return JSON.parse(userInfoCookie.value);
  }
  return null;
};
