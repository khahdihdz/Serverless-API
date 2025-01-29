const CLIENT_ID = "422012132533-pgroo786kqrbdq8aj1b791erm4aic29l.apps.googleusercontent.com"; // Thay bằng Client ID của bạn

const SCOPES = "https://www.googleapis.com/auth/fitness.activity.write";

function onGoogleLoad() {
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: SCOPES
        }).then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            if (authInstance.isSignedIn.get()) {
                updateUI(authInstance.currentUser.get());
            }
        });
    });
}

function signIn() {
    gapi.auth2.getAuthInstance().signIn().then(user => {
        localStorage.setItem("googleUser", JSON.stringify(user.getBasicProfile()));
        updateUI(user);
    }).catch(err => console.error("Lỗi đăng nhập:", err));
}

function signOut() {
    gapi.auth2.getAuthInstance().signOut().then(() => {
        localStorage.removeItem("googleUser");
        updateUI(null);
    });
}

function updateUI(user) {
    if (user) {
        document.getElementById("userInfo").innerHTML = `Xin chào, ${user.getBasicProfile().getName()}!`;
        document.getElementById("signInBtn").style.display = "none";
        document.getElementById("signOutBtn").style.display = "block";
    } else {
        document.getElementById("userInfo").innerHTML = "Bạn chưa đăng nhập!";
        document.getElementById("signInBtn").style.display = "block";
        document.getElementById("signOutBtn").style.display = "none";
    }
}