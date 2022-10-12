const USER_SESSION_KEY = "EthansRecipeDatabaseUserSessionID";

export function handleUserSession(setUserStatus) {
  var userSessionID = sessionStorage.getItem(USER_SESSION_KEY);
  // if nothing found in sessionStorage
  if (!userSessionID) {
    setUserStatus(false);
  } else {
    // sessionID found in sessionStorage, but we need to validate it
    async function checkSession() {
      const response = await fetch(
        `https://ethans-cookbook.herokuapp.com/api/checkSession`,
        {
          method: "POST",
          body: JSON.stringify({
            sessionID: userSessionID,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch((err) => {
        throw err;
      });
      // any error
      if (!response.ok) {
        setUserStatus(false);
        // delete sessionID from sessionstorage
        sessionStorage.removeItem(USER_SESSION_KEY);
        // show login modal
        return;
      }
      // good sessionID
      if (response.ok) {
        setUserStatus(true);
        return;
      }
    }

    checkSession();
  }
}

export function saveSessionToStorage(sessionID) {
  console.log(sessionStorage);
  sessionStorage.setItem(USER_SESSION_KEY, sessionID);
}
