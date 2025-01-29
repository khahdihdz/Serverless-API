<script>
    const CLIENT_ID = 'YOUR_CLIENT_ID'; // Thay bằng Client ID của bạn
    const API_KEY = 'YOUR_API_KEY'; // Thay bằng API Key của bạn
    const SCOPES = 'https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.activity.read';

    let accessToken;

    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest"]
        }).then(() => {
            document.getElementById('loginButton').addEventListener('click', handleAuthClick);
            document.getElementById('writeButton').addEventListener('click', writeStepData);
            document.getElementById('readButton').addEventListener('click', readStepData);
        }).catch(error => console.error("Lỗi khi khởi tạo API:", error));
    }

    function handleAuthClick() {
        gapi.auth2.getAuthInstance().signIn().then(() => {
            accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('controlPanel').style.display = 'block';
        }).catch(error => console.error("Lỗi đăng nhập:", error));
    }

    function writeStepData() {
        const stepCount = document.getElementById('stepInput').value || 1000;
        const apiUrl = "https://www.googleapis.com/fitness/v1/users/me/dataset:insert";
        const timestamp = (new Date()).getTime() * 1000000;

        const data = {
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
            "maxEndTimeNs": timestamp,
            "minStartTimeNs": timestamp - 10000000000,
            "point": [{
                "startTimeNanos": timestamp - 10000000000,
                "endTimeNanos": timestamp,
                "value": [{"intVal": parseInt(stepCount)}]
            }]
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Lỗi khi ghi dữ liệu: " + data.error.message);
                } else {
                    alert("Dữ liệu đã được ghi thành công!");
                }
            }).catch(error => {
                alert("Có lỗi xảy ra: " + error);
            });
    }

    function readStepData() {
        const readUrl = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
        const readData = {
            "aggregateBy": [{
                "dataTypeName": "com.google.step_count.delta",
                "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            }],
            "startTimeMillis": (new Date()).getTime() - 86400000,
            "endTimeMillis": new Date().getTime()
        };

        fetch(readUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(readData)
        }).then(response => response.json())
            .then(data => {
                let stepCount = 0;
                if (data.bucket && data.bucket.length > 0) {
                    stepCount = data.bucket[0].dataset[0].point.reduce((sum, point) => sum + point.value[0].intVal, 0);
                }
                document.getElementById('stepData').innerHTML = `
                    <div class="alert alert-info">Tổng số bước chân trong 24h qua: <b>${stepCount}</b></div>
                `;
            }).catch(error => {
                alert("Có lỗi xảy ra khi đọc dữ liệu: " + error);
            });
    }

    function start() {
        gapi.load("client:auth2", function() {
            gapi.auth2.init({ client_id: CLIENT_ID }).then(() => {
                initClient();
            }).catch(error => console.error("Lỗi khởi tạo gapi.auth2:", error));
        });
    }

    window.onload = start;
</script>