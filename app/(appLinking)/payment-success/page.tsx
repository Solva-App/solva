import { useEffect } from "react";
import { useRouter } from "next/router";

const PaymentCallback = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const queryString = new URLSearchParams(router.query as Record<string, string>).toString();
    const appLink = `solvaapp://payment-success?${queryString}`;
    setTimeout(() => {
      window.location.href = appLink;
    }, 100);

    console.log("Redirecting to app with link:", appLink);
  }, [router.isReady, router.query]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Redirecting to App...</h1>
      <p>If nothing happens, please make sure the app is installed.</p>
    </div>
  );
};

export default PaymentCallback;
