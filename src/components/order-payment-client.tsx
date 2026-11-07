'use client';

import React, { useState } from 'react';
import { PromptPayPayment } from './promptpay-payment';
import { SlipUploader } from './slip-uploader';
import { Order } from '@/lib/types';

interface OrderPaymentClientProps {
  order: Order;
  promptpayId: string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  initialQrUrl?: string;
}

export function OrderPaymentClient({
  order,
  promptpayId,
  bankName,
  bankAccount,
  accountName,
  initialQrUrl,
}: OrderPaymentClientProps) {
  const [currentAmount, setCurrentAmount] = useState(order.total);
  const [isTestMode, setIsTestMode] = useState(false);

  const handleAmountChange = (amt: number, test: boolean) => {
    setCurrentAmount(amt);
    setIsTestMode(test);
  };

  return (
    <div className="space-y-6">
      <PromptPayPayment
        promptpayId={promptpayId}
        totalAmount={order.total}
        orderNo={order.order_no}
        bankName={bankName}
        bankAccount={bankAccount}
        accountName={accountName}
        initialQrUrl={initialQrUrl}
        onAmountChange={handleAmountChange}
      />

      <SlipUploader
        orderId={order.id}
        orderNo={order.order_no}
        customerName={order.customer_name}
        phone={order.phone}
        total={order.total}
        initialStatus={order.status}
        initialSlipUrl={order.slip_url}
        currentAmount={currentAmount}
        isTestMode={isTestMode}
      />
    </div>
  );
}
