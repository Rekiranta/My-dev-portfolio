async function uploadData() {
    const raw = document.getElementById("data-input").value;
    const values = raw.split(",").map(v => v.trim() === "" ? null : Number(v));

    const res = await fetch("/upload", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({values})
    });

    const output = await res.json();
    document.getElementById("output").textContent =
        JSON.stringify(output, null, 2);
}

document.getElementById("send-btn").onclick = uploadData;
