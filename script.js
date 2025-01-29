let accessToken = null;

function loadClient() {
    gapi.client.setApiKey("AIzaSyCDAqPtdamfREUzrgK5f01mUPodtn-8ojY"); // Đặt API Key của bạn ở đây
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/fitness/v1/rest")
        .then(() => {
            console.log("Google Fit API loaded successfully.");
        }, (err) => {
            console.error("Error loading Google Fit API", err);
        });
}

function authenticate() {
    return gapi.auth2.getAuthInstance().signIn({ scope: "https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.activity.read" })
        .then((response) => {
            accessToken = response.getAuthResponse().access_token;
            console.log("Đăng nhập thành công với Access Token:", accessToken);
            document.getElementById("status").innerText = "Đã đăng nhập thành công!";
            document.getElementById("submitBtn").disabled = false;
        }, (err) => {
            console.error("Lỗi đăng nhập:", err);
            document.getElementById("status").innerText = "Lỗi đăng nhập!";
        });
}

function fakeSteps() {
    if (!accessToken) {
        alert("Vui lòng đăng nhập trước!");
        return;
    }

    const steps = parseInt(document.getElementById("stepsInput").value) || 10000;
    const currentTimeMillis = Date.now();
    const startTimeMillis = currentTimeMillis - 3600000; // Lùi lại 1 giờ

    const requestBody = {
        "name": "session_hack_" + Date.now(),
        "description": "Fake bước chân",
        "startTimeMillis": startTimeMillis,
        "endTimeMillis": currentTimeMillis,
        "activityType": 8,  // Walking
        "application": {
            "packageName": "com.example.hackfit"
        },
        "dataSets": [{
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
            "point": [{
                "startTimeNanos": startTimeMillis * 1e6,
                "endTimeNanos": currentTimeMillis * 1e6,
                "dataTypeName": "com.google.step_count.delta",
                "value": [{ "intVal": steps }]
            }]
        }]
    };

    fetch("https://www.googleapis.com/fitness/v1/users/me/sessions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Ghi bước chân:", data);
        document.getElementById("status").innerText = "✅ Ghi bước chân thành công!";
    })
    .catch(error => {
        console.error("Lỗi ghi dữ liệu:", error);
        document.getElementById("status").innerText = "❌ Lỗi ghi dữ liệu!";
    });
}

document.getElementById("loginBtn").addEventListener("click", () => {
    gapi.load("client:auth2", () => {
        gapi.auth2.init({
            client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com", // Đặt Client ID của bạn ở đây
        }).then(() => {
            authenticate();
        });
    });
});

document.getElementById("submitBtn").addEventListener("click", () => {
    fakeSteps();
});