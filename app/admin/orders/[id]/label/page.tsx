"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, Printer } from "lucide-react";
import { useGetOrderByIdQuery } from "@/lib/store/apis/checkout-api";

export default function PrintLabelPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: order, isLoading, isError } = useGetOrderByIdQuery(id);

  // Auto-trigger the print dialog once the data and DOM are ready
  useEffect(() => {
    if (order && !isLoading && !isError) {
      const timer = setTimeout(() => {
        window.print();
      }, 500); // Slight delay allows any external barcode images to render
      return () => clearTimeout(timer);
    }
  }, [order, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm font-medium">Generating Label...</span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-destructive font-medium">Failed to load order data for printing.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-10 flex items-start justify-center">
      
      {/* 🛡️ CRITICAL CSS TRICK: 
        This global style tag completely hijacks the browser's print engine. 
        It forces a 4x6 thermal dimension, hides the Admin Sidebar, 
        and extracts ONLY the #print-container to send to the printer.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: 4in 6in; margin: 0; }
          body { background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
          body * { visibility: hidden; }
          #print-container, #print-container * { visibility: visible; }
          #print-container { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 4in; 
            height: 6in; 
            margin: 0; 
            padding: 16px; 
            background: white;
            box-shadow: none;
            border: none;
          }
        }
      `}} />

      {/* Manual Print Trigger (Hidden during actual print) */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Printer className="h-4 w-4" /> Print Label
        </button>
      </div>

      {/* THE PHYSICAL LABEL CANVAS */}
      <div 
        id="print-container" 
        className="w-[4in] h-[6in] bg-white text-black p-4 shadow-xl border border-gray-300 relative flex flex-col"
      >
        
        {/* Top: Addresses */}
        <div className="flex justify-between border-b-2 border-black pb-3 mb-3 shrink-0">
          <div className="w-1/2 pr-3 border-r-2 border-black">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">From:</p>
            <p className="text-[11px] font-black leading-tight mb-0.5">Atlascub Studio</p>
            <p className="text-[9px] leading-tight">Ismailpur, PO-Amarnagar</p>
            <p className="text-[9px] leading-tight">Faridabad, Haryana 121013</p>
            <p className="text-[9px] leading-tight">support@atlascub.in</p>
            <p className="text-[9px] leading-tight">8287627289</p>
          </div>
          <div className="w-1/2 pl-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Ship To:</p>
            <p className="text-[11px] font-black leading-tight mb-0.5">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p className="text-[9px] leading-tight">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-[9px] leading-tight">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-[9px] leading-tight font-medium mt-0.5">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
            <p className="text-[9px] leading-tight mt-1">Ph: +91 {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Center: Generated Barcode Integration */}
        <div className="flex flex-col items-center justify-center py-3 border-b-2 border-black mb-3 shrink-0">
          {/* @ts-ignore - Assuming labelUrl/barcodeValue were added to the OrderResponse type in backend */}
          {order.labelUrl ? (
            // @ts-ignore
            <img src={order.labelUrl} alt="Order Barcode" className="h-16 w-4/5 object-contain" />
          ) : (
            <div className="h-16 border-2 border-dashed border-gray-400 w-4/5 flex items-center justify-center rounded">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Awaiting Generation</span>
            </div>
          )}
          {/* @ts-ignore */}
          <p className="font-mono text-[10px] mt-1 tracking-[0.2em] font-bold">
            {/* @ts-ignore */}
            {order.barcodeValue || order.orderNumber}
          </p>
        </div>

        {/* Bottom: Items Summary */}
        <div className="flex-1 overflow-hidden">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Package Contents:</p>
          <ul className="space-y-1.5">
            {order.items.map((item: any, i: number) => (
              <li key={i} className="text-[10px] flex items-start gap-2 border-b border-gray-100 pb-1">
                <span className="font-bold border border-black px-1 rounded-sm">{item.quantity}x</span>
                <div className="flex-1 leading-tight">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-gray-600 ml-1 block text-[8px] uppercase tracking-wider">
                    Size: {item.size} • Color: {item.color}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Total & Payment Indicator */}
        <div className="mt-3 flex justify-between items-end border-t border-black pt-2 pb-3 shrink-0">
          <p className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-sm inline-block">
            {order.paymentMethod === 'razorpay' ? 'PREPAID' : 'COD'}
          </p>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-gray-500">Order Value</p>
            <p className="text-xs font-black">₹{order.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Footer: Courier Specifics */}
        {/* @ts-ignore */}
        {(order.awbCode || order.courierName) && (
          <div className="mt-auto pt-3 border-t-2 border-black flex justify-between items-end shrink-0">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Logistics Partner</p>
              {/* @ts-ignore */}
              <p className="text-[11px] font-black uppercase">{order.courierName || 'Shiprocket API'}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">AWB Tracking</p>
              {/* @ts-ignore */}
              <p className="text-[11px] font-mono font-black">{order.awbCode}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}