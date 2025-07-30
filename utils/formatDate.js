import { format } from "date-fns";

/**
 * Định dạng ngày từ chuỗi ISO (yyyy-MM-dd hoặc Date object)
 * sang định dạng dd/MM/yyyy
 * @param {string | Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  try {
    return format(new Date(dateStr), "dd/MM/yyyy");
  } catch (error) {
    console.error("Lỗi định dạng ngày:", error);
    return "";
  }
}
