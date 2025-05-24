// export function formatPrice(price: any) {
//   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
// }
export function formatPrice(price: any) {
  // Chuyển giá thành số nguyên (lấy phần nguyên)
  const integerPrice = Math.floor(Number(price));

  // Format số nguyên với dấu chấm phân cách hàng nghìn
  return integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
// export function formatPrice(price: any) {
//   if (!price || isNaN(price)) return "0"; // Kiểm tra giá trị hợp lệ

//   const roundedPrice = Math.floor(Number(price)); // Chỉ lấy phần nguyên
//   return new Intl.NumberFormat("vi-VN").format(roundedPrice); // Format giá
// }

