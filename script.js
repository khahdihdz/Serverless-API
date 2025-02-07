async function fetchGoldPrice() {
    try {
        const response = await fetch('https://hite.vn/hhhh/vangdainghianh/');
        const text = await response.text();
        
        // Sử dụng DOMParser để phân tích HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Giả sử giá vàng nằm trong một thẻ cụ thể, bạn cần điều chỉnh selector cho phù hợp
        const priceElement = doc.querySelector('.11'); // Thay đổi '.price-selector' thành selector thực tế
        const price = priceElement ? priceElement.textContent : 'Không tìm thấy giá';

        document.getElementById('price').textContent = price;
    } catch (error) {
        console.error('Lỗi khi lấy giá vàng:', error);
        document.getElementById('price').textContent = 'Lỗi khi tải giá vàng';
    }
}

// Gọi hàm để lấy giá vàng khi trang được tải
window.onload = function() {
    fetchGoldPrice(); // Lần đầu tiên khi tải trang
    setInterval(fetchGoldPrice, 60000); // Cập nhật mỗi 60 giây (60000 ms)
};