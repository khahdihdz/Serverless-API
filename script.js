let accessToken = "";

function loginGoogleFit() {
    const clientId = "422012132533-pgroo786kqrbdq8aj1b791erm4aic29l.apps.googleusercontent.com";  // Thay thế bằng Client ID của bạn
    const redirectUri = "https://hackfit-beta.vercel.app";  // Thay thế với URL redirect của bạn
    const scope = "https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.activity.read";
    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
}

// Lấy token từ URL sau khi đăng nhập
window.onload = function () {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    if (params.has("access_token")) {
        accessToken = params.get("access_token");
        document.getElementById("status").innerText = "✅ Đăng nhập thành công!";
    }
};

function fakeSteps() {
    if (!accessToken) return alert("⚠️ Vui lòng đăng nhập trước!");

    const steps = parseInt(document.getElementById("stepsInput").value) || 10000;
    const currentTimeMillis = Date.now();
    const oneHourMillis = 60 * 60 * 1000;

    const requestBody = {
        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas",
        "maxEndTimeNs": (currentTimeMillis * 1e6).toString(),
        "minStartTimeNs": ((currentTimeMillis - oneHourMillis) * 1e6).toString(),
        "point": [{
            "dataTypeName": "com.google.step_count.delta",
            "startTimeNanos": ((currentTimeMillis - oneHourMillis) * 1e6).toString(),
            "endTimeNanos": (currentTimeMillis * 1e6).toString(),
            "value": [{ "intVal": steps }]
        }]
    };

    fetch("https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas/datasets", {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Ghi bước chân:", data);
        if (data.error) {
            document.getElementById("status").innerText = "❌ Lỗi ghi dữ liệu!";
        } else {
            document.getElementById("status").innerText = "✅ Ghi bước chân thành công!";
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
        document.getElementById("status").innerText = "❌ Lỗi ghi dữ liệu!";
    });
}

function checkSteps() {
    if (!accessToken) return alert("⚠️ Vui lòng đăng nhập trước!");

    const startTime = (Date.now() - 24 * 60 * 60 * 1000) * 1e6;  // 24 giờ trước
    const endTime = Date.now() * 1e6; 

    fetch(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            aggregateBy: [{
                dataTypeName: "com.google.step_count.delta"
            }],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: startTime / 1e6,
            endTimeMillis: endTime / 1e6
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Dữ liệu bước chân:", data);
        const steps = data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
        document.getElementById("status").innerText = `📜 Số bước chân hôm nay: ${steps}`;
    })
    .catch(error => {
        console.error("Lỗi:", error);
        document.getElementById("status").innerText = "❌ Không tìm thấy dữ liệu!";
    });
}