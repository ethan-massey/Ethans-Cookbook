
const USER_TOKEN_KEY = "EthansRecipeDatabaseUserJWT";

export function handleUserSession(userToken, setUserStatus){
    if(!userToken){
        //console.log('no token!')
        setUserStatus(false);
    }else{
        setUserStatus(true);
    }
}

export function saveJWTLocalStorage(token){
    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(token));
}
