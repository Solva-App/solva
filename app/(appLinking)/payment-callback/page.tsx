import { useEffect } from "react";
import { useRouter } from "next/router";

const PaymentCallback = () => {
  const router = useRouter();
  const { trxref, reference } = router.query;

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
