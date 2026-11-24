import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function OrderReceiptModal({ order, onClose }) {
  const receiptRef = useRef();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount before using Portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !order) return null;

  const handleDownloadPDF = async () => {
    const element = receiptRef.current;
    const parent = element.parentElement; 
    
    // Temporarily remove scroll constraints so html2canvas sees the FULL height
    const originalOverflow = parent.style.overflow;
    parent.style.overflow = 'visible';

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height perfectly based on aspect ratio
      const pdfHeight = (canvas.height * pageWidth) / canvas.width;
      
      // Fit exactly to one page
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
      pdf.save(`Receipt-${order.orderNumber}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF");
    } finally {
      parent.style.overflow = originalOverflow; // Restore scroll
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const customerName = order.guestDetails?.name || order.customerId?.name || 'Guest';
  const customerPhone = order.guestDetails?.phone || order.customerId?.phone || 'N/A';
  const orderDate = new Date(order.createdAt).toLocaleString();

  // Use React Portal to render directly into the body, bypassing the 11-page layout
  return createPortal(
    <div id="print-portal-root" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:bg-white print:p-0 print:static print:inset-auto">
      
      <div className="bg-white text-black w-full max-w-sm rounded-xl shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:rounded-none">
        
        {/* Scrollable area for screen ONLY */}
        <div className="overflow-y-auto print:overflow-visible">
          
          <div ref={receiptRef} className="p-6 bg-white text-black font-sans receipt-content">
            
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-3 mb-4">
              <h1 className="text-2xl font-black uppercase tracking-widest leading-none">BLACK CAFE</h1>
              <p className="text-[10px] uppercase font-bold tracking-wider mt-1">Premium Fast Food</p>
              <p className="text-[10px] text-gray-600 mt-1">Ring road main kabootar chowk peshawar</p>
              <p className="text-[10px] text-gray-600">Ph: 03710900074</p>
            </div>

            {/* Order Info */}
            <div className="flex justify-between text-[11px] mb-4">
              <div>
                <p><span className="font-bold">Order:</span> {order.orderNumber}</p>
                <p><span className="font-bold">Date:</span> {orderDate.split(',')[0]}</p>
              </div>
              <div className="text-right">
                <p><span className="font-bold">Type:</span> {order.orderType}</p>
                <p><span className="font-bold">Payment:</span> {order.paymentMethod}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t border-b border-gray-300 py-3 mb-4 text-[11px]">
              <p className="font-bold uppercase text-[9px] tracking-wider text-gray-500 mb-1">Customer Details</p>
              <p className="font-bold text-xs">{customerName}</p>
              <p>{customerPhone}</p>
              {order.orderType === 'DELIVERY' && order.deliveryAddress?.address && (
                <p className="mt-1 text-[10px]"><span className="font-bold">Addr:</span> {order.deliveryAddress.address}</p>
              )}
            </div>

            {/* Items */}
            <table className="w-full text-[11px] mb-4">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="pb-1 w-6">Qty</th>
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-1.5 align-top font-bold">{item.quantity}</td>
                    <td className="py-1.5 pr-2">
                      <p className="font-semibold text-[11px] leading-tight">{item.productName}</p>
                      {(item.size || item.addons?.length > 0) && (
                        <p className="text-[9px] text-gray-500 leading-tight mt-0.5">
                          {item.size && `${item.size}`}
                          {item.size && item.addons?.length > 0 && ' • '}
                          {item.addons?.map(a => a.name).join(', ')}
                        </p>
                      )}
                    </td>
                    <td className="py-1.5 text-right align-top text-[11px] font-semibold">
                      {((item.unitPrice * item.quantity) / 100).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t-2 border-black pt-2 text-[11px]">
              <div className="flex justify-between mb-1">
                <span>Subtotal:</span>
                <span>{(order.subtotal / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Delivery:</span>
                <span>{(order.deliveryFee / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-sm mt-2 border-t border-black pt-2">
                <span>TOTAL:</span>
                <span>PKR {(order.total / 100).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center text-[9px] mt-6 text-gray-500">
              <p className="font-bold text-black mb-1">Thank you for dining with Black Cafe!</p>
              <p>Powered by Corelogics.ae</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end gap-2 print:hidden shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs text-gray-600 font-bold hover:bg-gray-200 rounded transition">
            Close
          </button>
          <button onClick={handlePrint} className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded hover:bg-black flex items-center gap-2 transition">
            <span className="material-symbols-outlined text-[16px]">print</span> Print
          </button>
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-red-700 flex items-center gap-2 transition shadow-sm">
            <span className="material-symbols-outlined text-[16px]">download</span> PDF
          </button>
        </div>
      </div>
    </div>,
    document.body // Render directly to the body!
  );
}