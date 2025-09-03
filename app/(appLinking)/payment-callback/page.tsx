"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const PaymentCallback = () => {
  const searchParams = useSearchParams();
  const trxref = searchParams.get("trxref");
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (trxref && reference) {
      const appLink = `solvaapp://payment-success?trxref=${trxref}&reference=${reference}`;

      window.location.href = appLink;
    }
  }, [trxref, reference]);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Redirecting to your app...</h1>
      <p>If nothing happens, please make sure your app is installed.</p>
    </div>
  );
};

export default PaymentCallback;
