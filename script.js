async function addSteps() {
    const steps = document.getElementById("stepsInput").value;
    if (!steps || steps <= 0) {
        alert("Vui lòng nhập số bước hợp lệ!");
        return;
    }

    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

    const requestBody = {
        dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
        maxEndTimeNs: Date.now() * 1e6,
        minStartTimeNs: (Date.now() - 60000) * 1e6,
        point: [{
            value: [{ intVal: parseInt(steps) }],
            dataTypeName: "com.google.step_count.delta"
        }]
    };

    const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.step_count.delta:com.google.android.gms:estimated_steps/datasets", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    if (response.ok) {
        alert("Cập nhật bước chân thành công!");
        document.getElementById("historyList").innerHTML += `<li class="list-group-item">${steps} bước</li>`;
    } else {
        alert("Lỗi cập nhật dữ liệu!");
    }
}