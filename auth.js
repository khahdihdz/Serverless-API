const CLIENT_ID = "422012132533-pgroo786kqrbdq8aj1b791erm4aic29l.apps.googleusercontent.com"; // Thay bằng Client ID của bạn
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.write";

function signIn() {
    gapi.auth2.getAuthInstance().signIn().then(user => {
        console.log("Đăng nhập thành công!");
    }).catch(err => console.error("Lỗi đăng nhập:", err));
}

function initAuth() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: SCOPES
        });
    });
}

window.onload = initAuth;