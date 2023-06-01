import { requestSender } from "$lib/helper/api";
import { tokenClear } from "$lib/helper/token";

const login = async (data:object) => {
  return requestSender(
    "/login",
    null,
    "POST",
    data,
    false,
  );
};

const renew = async () => {
  return requestSender(
    "/token/renew",
    null,
    "GET",
    null,
    true,
  );
};

const logout = () => {
  tokenClear();
};

export { login, renew, logout };
