const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});

function shortenUrl() {
    const urlInput = document.getElementById('urlInput').value;
    if (!isValidShopeeUrl(urlInput)) {
        alert('Harap masukkan URL Shopee yang valid.');
        return;
    }

    const path = getPathFromShopeeUrl(urlInput);
    const productName = formatProductName(path);
    if (!path || !productName) {
        alert('Tidak dapat mengambil nama produk dari URL Shopee.');
        return;
    }

    // Menggunakan API TinyURL untuk memendekkan URL
    fetch(`http://tinyurl.com/api-create.php?url=${encodeURIComponent(urlInput)}`)
        .then(response => response.text())
        .then(shortUrl => {
            const shortUrlElement = document.getElementById('shortUrl');
            shortUrlElement.innerHTML = `
                <a href="${shortUrl}" target="_blank">${shortUrl}</a><br><br>
                Nama Produk: <strong>${productName}</strong>
            `;
            
            // Enable the copy buttons
            const copyBtn = document.getElementById('copyBtn');
            const copyBtnWithName = document.getElementById('copyBtnWithName');
            copyBtn.disabled = false;
            copyBtnWithName.disabled = false;
            copyBtn.setAttribute('data-url', shortUrl);
            copyBtnWithName.setAttribute('data-url', shortUrl);
            copyBtnWithName.setAttribute('data-product-name', productName);
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
            document.getElementById('shortUrl').innerText = 'Gagal memendekkan URL.';
            document.getElementById('copyBtn').disabled = true;
            document.getElementById('copyBtnWithName').disabled = true;
        });
}

function isValidShopeeUrl(url) {
    const shopeeDomainPattern = /^(https?:\/\/)?(www\.)?shopee\.co\.id\/.+/i;
    return shopeeDomainPattern.test(url);
}

function getPathFromShopeeUrl(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('shopee.co.id')) {
            return urlObj.pathname.split('/')[1] || ''; // Ambil bagian path pertama
        }
    } catch (e) {
        console.error('URL tidak valid:', e);
    }
    return null;
}

function formatProductName(path) {
    // Menghapus ID produk dan karakter khusus dari path
    if (!path) return '';

    const namePart = path.split('-').slice(0, -2).join(' '); // Ambil semua bagian kecuali ID
    return namePart.replace(/-/g, ' ').replace(/\b(\w)/g, char => char.toUpperCase()); // Ubah karakter pemisah menjadi spasi dan kapitalisasi kata
}

function copyUrl() {
    const copyBtn = document.getElementById('copyBtn');
    const shortUrl = copyBtn.getAttribute('data-url');

    if (shortUrl) {
        navigator.clipboard.writeText(shortUrl).then(() => {
            alert('URL telah disalin ke clipboard!');
        }).catch(err => {
            console.error('Gagal menyalin URL:', err);
        });
    }
}

function copyUrlAndName() {
    const copyBtnWithName = document.getElementById('copyBtnWithName');
    const shortUrl = copyBtnWithName.getAttribute('data-url');
    const productName = copyBtnWithName.getAttribute('data-product-name');

    if (shortUrl && productName) {
        const textToCopy = `URL: ${shortUrl}\nNama Produk: ${productName}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('URL dan nama produk telah disalin ke clipboard!');
        }).catch(err => {
            console.error('Gagal menyalin URL dan nama produk:', err);
        });
    }
}
