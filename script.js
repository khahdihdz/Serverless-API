const CLIENT_ID = "422012132533-pgroo786kqrbdq8aj1b791erm4aic29l.apps.googleusercontent.com"; // Thay CLIENT_ID của bạn tại đây
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.write";

let accessToken = null;

// Hàm xử lý sự kiện khi người dùng click đăng nhập với Google
function handleAuthClick() {
    google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.access_token) {
                accessToken = response.access_token;
                document.getElementById("status").innerText = "✅ Đã đăng nhập";
                document.getElementById("status").classList.replace("text-warning", "text-success");
                document.getElementById("hack-btn").disabled = false;
            }
        }
    }).requestAccessToken();
}

// Gửi yêu cầu tăng bước chân giả vào Google Fit
function sendFakeSteps() {
    if (!accessToken) {
        alert("⚠️ Vui lòng đăng nhập trước!");
        return;
    }

    const url = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";

    const startTime = new Date().getTime() - 60000; // 1 phút trước
    const endTime = new Date().getTime(); // Hiện tại

    const requestBody = {
        "aggregateBy": [{
            "dataTypeName": "com.google.step_count.delta",
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        }],
        "bucketByTime": { "durationMillis": 60000 },
        "startTimeMillis": startTime,
        "endTimeMillis": endTime
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("status").innerText = "🎉 Đã thêm 10,000 bước chân!";
        document.getElementById("status").classList.replace("text-success", "text-primary");
        console.log("Đã thêm bước chân giả:", data);
    })
    .catch(error => {
        document.getElementById("status").innerText = "❌ Lỗi khi gửi dữ liệu!";
        document.getElementById("status").classList.replace("text-primary", "text-danger");
        console.error("Lỗi khi gửi dữ liệu:", error);
    });
}

// Thêm sự kiện vào các nút trong HTML
document.getElementById("login-btn").addEventListener("click", handleAuthClick);
document.getElementById("hack-btn").addEventListener("click", sendFakeSteps);