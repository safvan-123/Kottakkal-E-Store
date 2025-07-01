// utils/generateInvoicePdf.js
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// If needed, pass `logo` from the calling page or import here
export const generateInvoicePdf = async (
  order,
  logo,
  options = { save: false }
) => {
  const toBase64 = (url, type = "image/jpeg", quality = 0.5, maxSize = 100) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const width = img.width * scale;
        const height = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataURL = canvas.toDataURL(type, quality);
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = url;
    });

  const logoBase64 = await toBase64(logo, "image/jpeg", 0.9, 150);
  const productImages = await Promise.all(
    order.items.map((item) =>
      toBase64(item.product?.image, "image/jpeg", 0.4, 100)
    )
  );

  const doc = new jsPDF();

  // --- Header Section ---
  doc.addImage(logoBase64, "PNG", 14, 10, 16, 16);
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41);
  doc.text("Kottakkal e-Store", 38, 20);
  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text("INVOICE", 180, 20, { align: "right" });

  // --- Order Info ---
  const marginTop = 10;
  const createdAt = new Date(order.createdAt).toLocaleString();
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Order ID: ${order._id}`, 14, 35 + marginTop);
  doc.text(`Date: ${createdAt}`, 14, 42 + marginTop);
  doc.text(`Status: ${order.status}`, 14, 49 + marginTop);
  doc.text(`Payment: ${order.paymentMethod}`, 14, 56 + marginTop);
  doc.text(`Paid: ${order.isPaid ? "Yes" : "No"}`, 14, 63 + marginTop);

  // --- Shipping Info ---
  const { name, phone, address, city, pincode } = order.shippingAddress;
  const shipToStartY = 83;
  doc.text("Ship To:", 14, shipToStartY);
  doc.setFont("helvetica", "bold");
  doc.text(`${name}`, 14, shipToStartY + 7);
  doc.setFont("helvetica", "normal");
  doc.text(`Phone: ${phone}`, 14, shipToStartY + 13);
  doc.text(`Address: ${address}, ${city} - ${pincode}`, 14, shipToStartY + 19);

  // --- Table Data ---
  const tableData = order.items.map((item, i) => [
    i + 1,
    "", // We'll draw product name manually next to image
    item.size,
    item.color,
    item.quantity,
    `${item.product?.price}`,
  ]);

  doc.autoTable({
    startY: 114,
    head: [["#", "Product", "Size", "Color", "Qty", "Price"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      cellPadding: 3,
      fontSize: 10,
      halign: "left",
      minCellHeight: 14,
    },
    columnStyles: {
      1: { cellWidth: 60 }, // Product column wider
    },
    didDrawCell: function (data) {
      // Only apply to body rows in Product column
      if (
        data.section === "body" &&
        data.column.index === 1 &&
        data.row.index < productImages.length
      ) {
        const img = productImages[data.row.index];
        const productName = order.items[data.row.index].product?.name || "N/A";

        const imgX = data.cell.x + 2;
        const imgY = data.cell.y + 2;
        const imgSize = 10;

        doc.addImage(img, "PNG", imgX, imgY, imgSize, imgSize);

        const textX = imgX + imgSize + 6;
        const textY = imgY + 6;

        doc.setFontSize(10);
        doc.setTextColor(20);
        doc.text(productName, textX, textY);
      }
    },
  });

  // --- Totals Section ---
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setDrawColor(220);
  doc.setFillColor(243);
  doc.roundedRect(14, finalY, 180, 20, 3, 3, "S");

  const pageWidth = doc.internal.pageSize.getWidth();
  const labelX = 18;
  const valueX = pageWidth - 18;
  const textY = finalY + 10;

  doc.setFontSize(13);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text("Offer Price:", labelX, textY);
  doc.setTextColor(0, 102, 204);
  doc.text(`INR ${order.offerPrice}`, valueX, textY, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(40);
  doc.text("Total Amount:", labelX, textY + 8);
  doc.setTextColor(220, 53, 69);
  doc.text(`INR ${order.totalAmount}`, valueX, textY + 8, {
    align: "right",
  });

  // --- Footer ---
  const footerY = finalY + 30;
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text("Thanks for shopping with us!", pageWidth / 2, footerY, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.setFont("helvetica", "normal");
  doc.text("Kottakkal eStore", pageWidth / 2, footerY + 6, {
    align: "center",
  });

  if (options.save) {
    doc.save(`Invoice_${order._id}.pdf`);
    return null; // nothing to return when saved
  } else {
    const pdfBlob = doc.output("blob");
    const pdfBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.readAsDataURL(pdfBlob);
    });

    return pdfBase64; // ✅ return the actual PDF as base64
  }
  // Return either a blob, base64 or trigger download:
};
