// DOM Elements
const urlInput = document.getElementById("urlInput");
const generateBtn = document.getElementById("generateBtn");
const btnText = document.getElementById("btn-text");
const loader = document.getElementById("loader");
const resultContainer = document.getElementById("result-container");
const productNameEl = document.getElementById("productName");
const shortUrlLink = document.getElementById("shortUrlLink");
const copyBtn = document.getElementById("copyBtn");
const copyBtnWithName = document.getElementById("copyBtnWithName");
const errorMessage = document.getElementById("error-message");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const themeToggleBtn = document.getElementById("theme-toggle");
const darkIcon = document.getElementById("theme-toggle-dark-icon");
const lightIcon = document.getElementById("theme-toggle-light-icon");

// --- THEME TOGGLE ---
if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
    document.documentElement.classList.add("dark");
    lightIcon.classList.remove("hidden");
} else {
    document.documentElement.classList.remove("dark");
    darkIcon.classList.remove("hidden");
}

themeToggleBtn.addEventListener("click", function () {
    darkIcon.classList.toggle("hidden");
    lightIcon.classList.toggle("hidden");
    if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
        }
    } else {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
        }
    }
});

// --- CORE LOGIC ---
function setButtonLoading(isLoading) {
    generateBtn.disabled = isLoading;
    btnText.classList.toggle("hidden", isLoading);
    loader.classList.toggle("hidden", !isLoading);
}

function showMessage(message, isError = false) {
    errorMessage.textContent = message;
    errorMessage.classList.toggle("hidden", !message);
    if (isError) {
        resultContainer.classList.add("hidden");
    }
}

async function shortenUrl() {
    const longUrl = urlInput.value.trim();
    if (!isValidShopeeUrl(longUrl)) {
        showMessage("Harap masukkan URL Shopee yang valid.", true);
        return;
    }

    setButtonLoading(true);
    showMessage("");
    resultContainer.classList.add("hidden");

    const path = getPathFromShopeeUrl(longUrl);
    const productName = formatProductName(path);
    if (!path || !productName) {
        showMessage("Tidak dapat mengambil nama produk dari URL.", true);
        setButtonLoading(false);
        return;
    }

    try {
        const response = await fetch(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
        );
        if (!response.ok) throw new Error("Gagal menghubungi API TinyURL");
        const shortUrl = await response.text();

        productNameEl.textContent = productName;
        shortUrlLink.href = shortUrl;
        shortUrlLink.textContent = shortUrl;

        copyBtn.dataset.url = shortUrl;
        copyBtnWithName.dataset.text = `Nama Produk: ${productName}\nURL: ${shortUrl}`;

        resultContainer.classList.remove("hidden");
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        showMessage("Gagal memendekkan URL. Coba lagi nanti.", true);
    } finally {
        setButtonLoading(false);
    }
}

function isValidShopeeUrl(url) {
    const shopeeDomainPattern = /^(https?:\/\/)?(www\.)?shopee\.co\.id\/.+/i;
    return shopeeDomainPattern.test(url);
}

function getPathFromShopeeUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.split("/")[1] || "";
    } catch (e) {
        console.error("URL tidak valid:", e);
        return null;
    }
}

function formatProductName(path) {
    if (!path) return "";
    const namePart = path.split("-i.")[0];
    return namePart
        .replace(/-/g, " ")
        .replace(/\b(\w)/g, (char) => char.toUpperCase());
}

function copyToClipboard(text, message) {
    if (!text) return;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
        showToast(message);
    } catch (err) {
        console.error("Gagal menyalin teks:", err);
        showToast("Gagal menyalin!", true);
    }
    document.body.removeChild(textArea);
}

let toastTimeout;
function showToast(message, isError = false) {
    clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.toggle("bg-red-500", isError);
    toast.classList.toggle("bg-gray-900", !isError);
    toast.classList.remove("opacity-0", "translate-y-10");
    toastTimeout = setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-10");
    }, 3000);
}

urlInput.addEventListener("focus", () => {
    showMessage("");
    urlInput.select();
});
