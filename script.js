document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("checkbox");
    const body = document.body;

    // Load theme from local storage if available
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark");
        checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    });
});

function shortenUrl() {
    const inputElement = document.getElementById("urlInput");
    let longUrl = inputElement.value;

    // Verifikasi apakah URL mengandung substring "i." dan "?"
    if (longUrl.includes("i.") && longUrl.includes("?")) {
        const extractedUrl = longUrl.substring(0, longUrl.indexOf("?"));
        const productName = extractedUrl.split("-").slice(1, -1).join(" ").replace(/-/g, " ");
        const shortUrlContainer = document.getElementById("shortUrl");

        fetch(`https://api.tinyurl.com/create?api_token=YOUR_API_TOKEN`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: extractedUrl,
                domain: "tinyurl.com",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.data && data.data.tiny_url) {
                    const shortUrl = data.data.tiny_url;
                    shortUrlContainer.innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a><br>${productName}`;
                    document.getElementById("copyBtn").disabled = false;
                    document.getElementById("copyBtnWithName").disabled = false;
                } else {
                    shortUrlContainer.innerHTML = "Terjadi kesalahan dalam memperpendek URL.";
                }
            })
            .catch((error) => {
                shortUrlContainer.innerHTML = "Terjadi kesalahan dalam memperpendek URL.";
            });
    } else {
        alert("URL tidak valid. Harap masukkan URL yang benar.");
    }
}

function copyUrl() {
    const shortUrlContainer = document.getElementById("shortUrl");
    const urlText = shortUrlContainer.querySelector("a").textContent;
    navigator.clipboard.writeText(urlText).then(() => {
        alert("URL berhasil disalin.");
    });
}

function copyUrlAndName() {
    const shortUrlContainer = document.getElementById("shortUrl");
    const urlText = shortUrlContainer.querySelector("a").textContent;
    const productName = shortUrlContainer.innerText.split("\n")[1];
    const combinedText = `${urlText} - ${productName}`;
    navigator.clipboard.writeText(combinedText).then(() => {
        alert("URL dan Nama Produk berhasil disalin.");
    });
}
