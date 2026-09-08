const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = (data) => {
    return new Promise((resolve, reject) => {
        console.log("PDF GENERATOR STARTED");

        const fileName = `${data.quoteId}.pdf`;
        const folderPath = path.join(__dirname, "../quotes");
        const logoPath = path.join(__dirname, "../assets/threeditron-logo.png");

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, fileName);
        const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // --- Theme Colors ---
        const PRIMARY_COLOR = "#000000"; // Black
        const ACCENT_COLOR = "#D4AF37"; // Gold
        const TEXT_MAIN = "#333333";
        const TEXT_MUTED = "#666666";
        const BORDER_COLOR = "#E5E7EB";
        const ALT_ROW_COLOR = "#F9FAFB";

        const printText = (text, x, y, size, font, color, options = {}) => {
            doc.fontSize(size).font(font).fillColor(color).text(text, x, y, options);
        };

        // ================= HEADER =================
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 45, { width: 90 });
        } else {
            // Text Logo Fallback
            doc.rect(50, 45, 90, 40).fill(PRIMARY_COLOR);
            printText("THREEDITRON", 55, 60, 12, "Helvetica-Bold", ACCENT_COLOR);
        }

        printText("QUOTATION", 400, 45, 24, "Helvetica-Bold", PRIMARY_COLOR, { align: "right", width: 145 });
        printText(`Quote #: ${data.quoteId}`, 400, 75, 10, "Helvetica", TEXT_MAIN, { align: "right", width: 145 });
        printText(`Date: ${data.date || new Date().toLocaleDateString()}`, 400, 90, 10, "Helvetica", TEXT_MAIN, { align: "right", width: 145 });

        printText("THREEDITRON", 160, 45, 18, "Helvetica-Bold", PRIMARY_COLOR);
        printText("Online 3D Printing & Rapid Prototyping", 160, 65, 10, "Helvetica", TEXT_MUTED);
        printText("Phone: +91 9999999999 | Email: support@threeditron.com", 160, 80, 9, "Helvetica", TEXT_MUTED);
        printText("Website: www.threeditron.com", 160, 95, 9, "Helvetica", TEXT_MUTED);
        printText("GSTIN: 20AAAAA0000A1Z5", 160, 110, 9, "Helvetica", TEXT_MUTED);

        doc.moveTo(50, 130).lineTo(545, 130).lineWidth(2).strokeColor(ACCENT_COLOR).stroke();

        // ================= CUSTOMER DETAILS =================
        let currentY = 150;
        
        doc.rect(50, currentY, 240, 90).fill(ALT_ROW_COLOR);
        doc.rect(50, currentY, 240, 20).fill(PRIMARY_COLOR);
        printText("CUSTOMER DETAILS", 60, currentY + 6, 10, "Helvetica-Bold", ACCENT_COLOR);
        
        currentY += 25;
        printText(`Name: ${data.name || "N/A"}`, 60, currentY, 10, "Helvetica-Bold", TEXT_MAIN);
        printText(`Phone: ${data.phone || "N/A"}`, 60, currentY + 15, 10, "Helvetica", TEXT_MAIN);
        printText(`Email: ${data.email || "N/A"}`, 60, currentY + 30, 10, "Helvetica", TEXT_MAIN);
        printText(`Address: ${data.address || "N/A"}`, 60, currentY + 45, 10, "Helvetica", TEXT_MAIN);

        // ================= PROJECT DETAILS =================
        currentY = 150;
        doc.rect(305, currentY, 240, 90).fill(ALT_ROW_COLOR);
        doc.rect(305, currentY, 240, 20).fill(PRIMARY_COLOR);
        printText("PROJECT DETAILS", 315, currentY + 6, 10, "Helvetica-Bold", ACCENT_COLOR);
        
        currentY += 25;
        printText(`Material: ${data.material || "N/A"}`, 315, currentY, 9, "Helvetica", TEXT_MAIN);
        printText(`Color: ${data.color || "N/A"}`, 315, currentY + 15, 9, "Helvetica", TEXT_MAIN);
        printText(`Weight: ${data.weight ? data.weight + "g" : "N/A"}`, 315, currentY + 30, 9, "Helvetica", TEXT_MAIN);
        printText(`Infill: ${data.infill ? data.infill + "%" : "N/A"}`, 315, currentY + 45, 9, "Helvetica", TEXT_MAIN);
        printText(`Quantity: ${data.quantity || 1}`, 430, currentY, 9, "Helvetica", TEXT_MAIN);
        printText(`Shipping: ${data.shipping || "N/A"}`, 430, currentY + 15, 9, "Helvetica", TEXT_MAIN);

        // ================= PRICING TABLE =================
        currentY = 270;
        const col1 = 50, col2 = 300, col3 = 400, col4 = 480;
        
        doc.rect(50, currentY, 495, 20).fill(PRIMARY_COLOR);
        printText("Description", col1 + 10, currentY + 6, 10, "Helvetica-Bold", ACCENT_COLOR);
        printText("Rate (INR)", col2, currentY + 6, 10, "Helvetica-Bold", ACCENT_COLOR);
        printText("Qty", col3, currentY + 6, 10, "Helvetica-Bold", ACCENT_COLOR);
        printText("Amount (INR)", col4, currentY + 6, 10, "Helvetica-Bold", ACCENT_COLOR);
        
        currentY += 25;
        const subtotal = Number(data.subtotal || data.totalPrice || 0);
        const qty = Number(data.quantity || 1);
        const rate = (subtotal / qty).toFixed(2);
        const shippingCost = 0; // Or from data if available
        const gst = subtotal * 0.18;
        const grandTotal = subtotal + gst + shippingCost;

        const tableItems = [
            { desc: `3D Printing Service - ${data.material || "Standard"}`, rate: rate, qty: qty, amt: subtotal.toFixed(2) },
            { desc: "Post Processing", rate: "Included", qty: "-", amt: "0.00" },
            { desc: `Shipping (${data.shipping || "Standard"})`, rate: shippingCost.toFixed(2), qty: 1, amt: shippingCost.toFixed(2) },
            { desc: "GST (18%)", rate: "-", qty: "-", amt: gst.toFixed(2) }
        ];

        tableItems.forEach((item, index) => {
            if (index % 2 === 0) doc.rect(50, currentY - 5, 495, 20).fill(ALT_ROW_COLOR);
            printText(item.desc, col1 + 10, currentY, 9, "Helvetica", TEXT_MAIN);
            printText(item.rate, col2, currentY, 9, "Helvetica", TEXT_MAIN);
            printText(item.qty.toString(), col3, currentY, 9, "Helvetica", TEXT_MAIN);
            printText(item.amt, col4, currentY, 9, "Helvetica", TEXT_MAIN);
            currentY += 20;
        });

        doc.moveTo(50, currentY).lineTo(545, currentY).lineWidth(1).strokeColor(BORDER_COLOR).stroke();
        currentY += 10;
        
        doc.rect(380, currentY - 5, 165, 30).fill(ACCENT_COLOR);
        printText("GRAND TOTAL", 390, currentY + 5, 12, "Helvetica-Bold", PRIMARY_COLOR);
        printText(`Rs ${grandTotal.toFixed(2)}`, 470, currentY + 5, 12, "Helvetica-Bold", PRIMARY_COLOR);

        // ================= SUMMARY BOX =================
        currentY += 50;
        doc.rect(50, currentY, 200, 80).lineWidth(1).strokeColor(BORDER_COLOR).stroke();
        printText("SUMMARY", 60, currentY + 10, 10, "Helvetica-Bold", PRIMARY_COLOR);
        printText("Payment Status:", 60, currentY + 30, 9, "Helvetica", TEXT_MUTED);
        printText("Pending", 150, currentY + 30, 9, "Helvetica-Bold", TEXT_MAIN);
        printText("Quotation Validity:", 60, currentY + 45, 9, "Helvetica", TEXT_MUTED);
        printText("7 Days", 150, currentY + 45, 9, "Helvetica-Bold", TEXT_MAIN);
        printText("Est. Delivery:", 60, currentY + 60, 9, "Helvetica", TEXT_MUTED);
        printText("3-5 Business Days", 150, currentY + 60, 9, "Helvetica-Bold", TEXT_MAIN);

        // ================= TERMS & CONDITIONS =================
        currentY += 100;
        printText("Terms & Conditions:", 50, currentY, 11, "Helvetica-Bold", PRIMARY_COLOR);
        doc.moveTo(50, currentY + 15).lineTo(170, currentY + 15).lineWidth(2).strokeColor(ACCENT_COLOR).stroke();
        currentY += 25;
        
        const terms = [
            "1. This quotation is valid for 7 days from the date of issue.",
            "2. Production commences only upon 100% advance payment or approved PO.",
            "3. Final cost may vary slightly based on actual material consumption during slicing.",
            "4. Threeditron ensures high-quality prints, but typical FDM layer lines will be visible.",
            "5. Delivery timelines are estimates and subject to machine availability.",
            "6. Due to the custom nature of 3D printing, refunds/returns are not permitted once production begins."
        ];
        
        terms.forEach(term => {
            printText(term, 50, currentY, 9, "Helvetica", TEXT_MUTED);
            currentY += 15;
        });

        // ================= FOOTER & PAGING =================
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            const bottom = doc.page.height - 80;
            
            doc.moveTo(50, bottom).lineTo(545, bottom).lineWidth(1).strokeColor(BORDER_COLOR).stroke();
            
            // QR Code Placeholder
            doc.rect(50, bottom + 10, 40, 40).lineWidth(1).strokeColor(BORDER_COLOR).stroke();
            printText("SCAN", 58, bottom + 25, 8, "Helvetica", TEXT_MUTED);

            printText("www.threeditron.com", 110, bottom + 15, 9, "Helvetica-Bold", PRIMARY_COLOR);
            printText("support@threeditron.com | +91 9999999999", 110, bottom + 28, 9, "Helvetica", TEXT_MUTED);
            printText("This is a computer-generated quotation and does not require a signature.", 110, bottom + 41, 8, "Helvetica-Oblique", TEXT_MUTED);
            
            printText(`Page ${i + 1} of ${pages.count}`, 495, bottom + 25, 9, "Helvetica", TEXT_MUTED);
        }

        doc.end();

        stream.on("finish", () => {
            console.log("PDF SAVED:", filePath);
            resolve(filePath);
        });

        stream.on("error", (err) => {
            reject(err);
        });
    });
};

module.exports = generatePDF;