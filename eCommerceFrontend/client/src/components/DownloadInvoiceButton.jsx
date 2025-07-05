import { Download } from "lucide-react";
import "jspdf-autotable";
import logo from "../assets/DeliveryImage.avif"; // replace with your logo path
import { generateInvoicePdf } from "./GenerateInvoicePdf";

export default function DownloadInvoiceButton({ order }) {
  if (!order || !order.items?.length) return;
  const handleDownload = async () => {
    const savePdf = await generateInvoicePdf(order, logo, { save: true });

    return savePdf;
  };
  return (
    <button
      onClick={handleDownload}
      className="mt-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg transition shadow-md"
    >
      <Download className="w-5 h-5" />
      Download Invoice
    </button>
  );
}
