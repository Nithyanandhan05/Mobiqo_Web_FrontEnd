/**
 * invoiceGenerator.ts
 * Generates a professional PDF invoice for Mobiqo orders using jsPDF + html2canvas.
 * Renders an off-screen HTML element, captures it, and downloads as a PDF.
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceData {
    invoice_no: string;
    order_date: string;
    customer_name: string;
    phone?: string;
    address?: string;
    payment_method?: string;
    product_name: string;
    product_image_url?: string;
    price: number;
    status?: string;
    warranty_expiry?: string;
}

function pad(n: number) {
    return String(n).padStart(2, '0');
}

function formatDate(d: string | undefined) {
    if (!d) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getDueDate(orderDate: string | undefined) {
    const base = orderDate ? new Date(orderDate) : new Date();
    base.setFullYear(base.getFullYear() + 1);
    return base.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildInvoiceHTML(data: InvoiceData): string {
    const now = new Date();
    const generatedOn = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const invoiceId = data.invoice_no || `MDQ-${Date.now()}`;
    const formattedPrice = `₹${data.price.toLocaleString('en-IN')}`;
    const gst = Math.round(data.price * 0.18);
    const subtotal = data.price - gst;
    const productName = data.product_name || 'Product';
    const shortName = productName.split('(')[0].trim();
    const imgSrc = data.product_image_url ||
        `https://tse1.mm.bing.net/th?q=${encodeURIComponent(shortName + ' smartphone')}&w=300&h=300&c=7&rs=1`;
    const warrantyExpiry = data.warranty_expiry || getDueDate(data.order_date);

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1e293b; width: 794px; }
  .page { width: 794px; padding: 40px 48px; background: #fff; }
  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 28px; border-bottom: 2px solid #e2e8f0; margin-bottom: 28px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-shield { width: 48px; height: 48px; background: linear-gradient(135deg,#1f93f6,#124cb1); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .brand-shield svg { width: 28px; height: 28px; fill: white; }
  .brand-name { font-size: 26px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
  .brand-tag { font-size: 10px; font-weight: 700; color: #1f93f6; text-transform: uppercase; letter-spacing: 1.5px; }
  .invoice-meta { text-align: right; }
  .invoice-title { font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
  .invoice-num { font-size: 13px; font-weight: 700; color: #64748b; margin-top: 4px; }
  .invoice-date { font-size: 12px; color: #94a3b8; margin-top: 2px; }
  /* Status */
  .status-bar { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg,#1f93f6 0%,#124cb1 100%); border-radius: 14px; padding: 14px 22px; margin-bottom: 28px; color: white; }
  .status-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; opacity: .8; }
  .status-value { font-size: 15px; font-weight: 900; margin-top: 2px; }
  /* Parties */
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
  .party-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; }
  .party-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
  .party-name { font-size: 14px; font-weight: 800; color: #0f172a; }
  .party-sub { font-size: 12px; color: #64748b; margin-top: 3px; line-height: 1.5; }
  /* Product */
  .section-title { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }
  .product-card { display: flex; align-items: center; gap: 18px; background: #f0f7ff; border: 1.5px solid #bfdbfe; border-radius: 16px; padding: 18px 22px; margin-bottom: 28px; }
  .product-img { width: 90px; height: 90px; object-fit: contain; border-radius: 12px; background: white; padding: 6px; border: 1px solid #e2e8f0; flex-shrink: 0; }
  .product-info { flex: 1; }
  .product-name { font-size: 16px; font-weight: 900; color: #0f172a; }
  .product-cat { font-size: 11px; font-weight: 700; color: #1f93f6; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  .product-specs { font-size: 11px; color: #64748b; margin-top: 6px; }
  .product-price-big { font-size: 24px; font-weight: 900; color: #0f172a; text-align: right; }
  /* Price table */
  .price-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
  .price-table th { background: #f1f5f9; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.2px; padding: 10px 16px; text-align: left; }
  .price-table th:last-child { text-align: right; }
  .price-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
  .price-table td:last-child { text-align: right; font-weight: 700; color: #0f172a; }
  .total-row td { font-weight: 900; font-size: 15px; color: #0f172a; border-top: 2px solid #e2e8f0; border-bottom: none; }
  /* Warranty */
  .warranty-card { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px; padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: center; gap: 14px; }
  .warranty-icon { width: 40px; height: 40px; background: #dcfce7; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .warranty-title { font-size: 13px; font-weight: 800; color: #166534; }
  .warranty-sub { font-size: 11px; color: #16a34a; margin-top: 3px; }
  /* Footer */
  .footer { border-top: 2px dashed #e2e8f0; padding-top: 22px; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-brand { font-size: 12px; font-weight: 800; color: #1f93f6; }
  .footer-sub { font-size: 10px; color: #94a3b8; margin-top: 2px; }
  .footer-right { text-align: right; }
  .thank-you { font-size: 15px; font-weight: 900; color: #0f172a; }
  .thank-sub { font-size: 10px; color: #94a3b8; margin-top: 3px; }
  .watermark-bar { background: linear-gradient(90deg,#1f93f6,#124cb1); height: 5px; border-radius: 0 0 6px 6px; margin-bottom: 6px; }
</style>
</head>
<body>
<div class="page">
  <!-- Brand Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-shield">
        <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
      </div>
      <div>
        <div class="brand-name">Mobiqo</div>
        <div class="brand-tag">Electronics Platform</div>
      </div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-title">TAX INVOICE</div>
      <div class="invoice-num"># ${invoiceId}</div>
      <div class="invoice-date">Generated: ${generatedOn}</div>
    </div>
  </div>

  <!-- Status Bar -->
  <div class="status-bar">
    <div>
      <div class="status-label">Order Status</div>
      <div class="status-value">${data.status || 'Processing'}</div>
    </div>
    <div>
      <div class="status-label">Order Date</div>
      <div class="status-value">${formatDate(data.order_date)}</div>
    </div>
    <div>
      <div class="status-label">Payment</div>
      <div class="status-value">${data.payment_method || 'Online'}</div>
    </div>
  </div>

  <!-- Parties -->
  <div class="parties">
    <div class="party-card">
      <div class="party-label">Billed To</div>
      <div class="party-name">${data.customer_name || 'Customer'}</div>
      ${data.phone ? `<div class="party-sub">📞 ${data.phone}</div>` : ''}
      ${data.address ? `<div class="party-sub">📍 ${data.address}</div>` : ''}
    </div>
    <div class="party-card">
      <div class="party-label">Sold By</div>
      <div class="party-name">Mobiqo Electronics</div>
      <div class="party-sub">📧 support@mobiqo.com</div>
      <div class="party-sub">🌐 www.mobiqo.com</div>
      <div class="party-sub">📍 Tamil Nadu, India — 600001</div>
    </div>
  </div>

  <!-- Product -->
  <div class="section-title">Item Details</div>
  <div class="product-card">
    <img class="product-img" src="${imgSrc}" alt="${productName}"
      onerror="this.src='https://cdn-icons-png.flaticon.com/512/330/330714.png'" crossorigin="anonymous" />
    <div class="product-info">
      <div class="product-name">${productName}</div>
      <div class="product-cat">Electronics · Smartphone</div>
      <div class="product-specs">Model: MBQ-${(data.invoice_no || '').replace(/[^0-9]/g, '').slice(-4) || '----'} &nbsp;&nbsp; Qty: 1 &nbsp;&nbsp; HSN: 8517</div>
    </div>
    <div class="product-price-big">${formattedPrice}</div>
  </div>

  <!-- Price Table -->
  <div class="section-title">Price Breakdown</div>
  <table class="price-table">
    <thead>
      <tr>
        <th>Description</th>
        <th>HSN Code</th>
        <th>Rate</th>
        <th>GST @ 18%</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${productName}</td>
        <td>8517</td>
        <td>₹${subtotal.toLocaleString('en-IN')}</td>
        <td>₹${gst.toLocaleString('en-IN')}</td>
        <td>₹${data.price.toLocaleString('en-IN')}</td>
      </tr>
      <tr style="color:#64748b;font-size:12px">
        <td colspan="3">Delivery Charges</td>
        <td>—</td>
        <td style="color:#16a34a;font-weight:800">FREE</td>
      </tr>
      <tr class="total-row">
        <td colspan="3">Total Amount</td>
        <td>₹${gst.toLocaleString('en-IN')}</td>
        <td>${formattedPrice}</td>
      </tr>
    </tbody>
  </table>

  <!-- Warranty -->
  <div class="warranty-card">
    <div class="warranty-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#16a34a"/>
        <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div>
      <div class="warranty-title">1-Year Manufacturer Warranty Included</div>
      <div class="warranty-sub">Warranty valid until: ${warrantyExpiry} &nbsp;·&nbsp; Warranty ID: WRN-${invoiceId}</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <div class="footer-brand">Mobiqo Electronics Platform</div>
      <div class="footer-sub">support@mobiqo.com &nbsp;·&nbsp; www.mobiqo.com</div>
      <div class="footer-sub" style="margin-top:6px;color:#cbd5e1">This is a computer-generated invoice and does not require a signature.</div>
    </div>
    <div class="footer-right">
      <div class="thank-you">Thank you for shopping! 🛍️</div>
      <div class="thank-sub">Enjoy your Mobiqo purchase</div>
    </div>
  </div>
</div>
<div class="watermark-bar"></div>
</body>
</html>`;
}

export async function downloadInvoice(data: InvoiceData): Promise<void> {
    const html = buildInvoiceHTML(data);

    // Create an off-screen iframe to render the invoice
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:794px;height:1200px;border:none;visibility:hidden;';
    document.body.appendChild(iframe);

    await new Promise<void>(resolve => {
        iframe.onload = () => {
            setTimeout(resolve, 300); // wait for fonts/images to paint
        };
        iframe.srcdoc = html;
    });

    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) throw new Error('Could not access iframe document');

        const canvas = await html2canvas(iframeDoc.body, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 794,
            windowWidth: 794,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Mobiqo_Invoice_${data.invoice_no || 'order'}.pdf`);
    } finally {
        document.body.removeChild(iframe);
    }
}
