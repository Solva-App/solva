"use client";

import { useEffect } from "react";

const PaymentCallbackClient = () => {
  useEffect(() => {
    window.location.href = "solvaapp://";
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Redirecting to your app...</h1>
      <p>If nothing happens, please make sure your app is installed.</p>
    </div>
  );
};

export default PaymentCallbackClient;
