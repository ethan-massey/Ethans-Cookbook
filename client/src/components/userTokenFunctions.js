const USER_TOKEN_KEY = "EthansRecipeDatabaseUserJWT";

export function handleUserSession(setUserStatus) {
  var userToken = localStorage.getItem(USER_TOKEN_KEY);
  // if nothing found in localstorage
  if (!userToken) {
    setUserStatus(false);
  } else {
    // token found in localstorage, but we need to validate it
    async function checkToken() {
      const response = await fetch(`https://ethans-cookbook.herokuapp.com/api/checkToken`, {
        method: "POST",
        body: JSON.stringify({
          token: userToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        throw err;
      });

      // Bad token
      if (response.status === 401) {
        setUserStatus(false);
        // delete token from localstorage
        localStorage.removeItem(USER_TOKEN_KEY);
        // show login modal
        return;
      }
      // any other error
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      // good token
      if (response.ok) {
        setUserStatus(true);
        return;
      }
    }

    checkToken();
  }
}

export function saveJWTLocalStorage(token) {
  localStorage.setItem(USER_TOKEN_KEY, token);
}
