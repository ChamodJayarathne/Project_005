import { jsPDF } from "jspdf";

/**
 * Adds a standard letterhead to a jsPDF instance.
 * @param {jsPDF} doc - The jsPDF document instance.
 * @param {string} title - The title of the report.
 * @param {string} logoImageData - The logo as a base64 string or image object.
 */
export const addLetterhead = (doc, title, logoImageData) => {
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  let yPos = 20;

  // Colors
  const darkBlue = [40, 53, 147];
  const lightGrey = [100, 100, 100];
  const dividerGrey = [200, 200, 200];

  // 1. Add Logo
  if (logoImageData) {
    try {
      // Adjusted logo size and position
      doc.addImage(logoImageData, "JPEG", margin, yPos - 10, 40, 30);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }

  // 2. Add Contact Info (Right Aligned)
  doc.setFontSize(10);
  doc.setTextColor(...lightGrey);
  doc.text("Wonder Choice", pageWidth - margin, yPos, { align: "right" });
  doc.text("Contact: +94711921992", pageWidth - margin, yPos + 6, { align: "right" });
  doc.text("URL: https://www.wonder-choice.com", pageWidth - margin, yPos + 12, { align: "right" });
  
  yPos += 25;

  // 3. Add Divider
  doc.setDrawColor(...dividerGrey);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 15;

  // 4. Add Report Title
  doc.setFontSize(18);
  doc.setTextColor(...darkBlue);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, yPos);
  
  // 5. Add Generation Date (Right Aligned with title)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightGrey);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    pageWidth - margin,
    yPos,
    { align: "right" }
  );

  yPos += 10;
  
  return yPos; // Return the current Y position for the content to start
};
