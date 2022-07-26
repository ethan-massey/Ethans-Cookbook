
const USER_TOKEN_KEY = "EthansRecipeDatabaseUser";

export function handleUserAuth(userToken, setUserStatus){
    if(!userToken){
        //console.log('no token!')
        setUserStatus(false);
    }else{
        var dateString = userToken.timestamp;
        // see if token is old. If so, delete it and set user to logged out
        if(moreThanFiveDays(dateString)){
            localStorage.removeItem(USER_TOKEN_KEY);
            setUserStatus(false);
        }else{
            setUserStatus(true);
        }
    }
}

export function createNewToken(){
    var userToken = {timestamp: new Date().getTime()}
    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(userToken));
}

// checks difference in timestamps
export function moreThanFiveDays(tokenDate) {
    const MSEC_IN_A_DAY = 84000000;
    var now = new Date().getTime();
    var diff = now - tokenDate;
    if(diff / MSEC_IN_A_DAY > 5){
        return true;
    }
    return false;
}