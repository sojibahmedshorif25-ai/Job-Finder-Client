import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { CheckCircle2, ShieldAlert, Sparkles, Building } from "lucide-react";
import Loading from "./Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshPremium } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setError("Invalid request. Missing Stripe Session ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Call backend verification
        const res = await axios.post(`${API_URL}/payments/verify-session`, {
          session_id: sessionId
        });

        if (res.data.success) {
          setPaymentDetails(res.data.payment);
          await refreshPremium(); // Refresh context state
        } else {
          setError("Payment verification failed. Please contact support.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to verify Stripe payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-premium p-8 rounded-2xl border border-dark-850 relative z-10 text-center shadow-2xl space-y-6">
        {error ? (
          <>
            <div className="inline-flex p-4 rounded-full bg-red-950/20 border border-red-500/20 text-red-400">
              <ShieldAlert className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold text-white">Payment Error</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              {error}
            </p>
            <Link
              to="/dashboard/my-startup"
              className="inline-block px-5 py-2.5 rounded-lg bg-dark-900 border border-dark-800 text-slate-350 text-xs font-semibold hover:bg-dark-850 transition-colors"
            >
              Back to My Startup
            </Link>
          </>
        ) : (
          <>
            <div className="inline-flex p-4 rounded-full bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>Premium Activated</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">Payment Successful!</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thank you for your payment. Your StartupForge premium subscription is now active! You have unlimited opportunities enabled.
              </p>
            </div>

            {paymentDetails && (
              <div className="bg-dark-950/80 border border-dark-900 rounded-xl p-4 text-left text-[11px] space-y-2 text-slate-400">
                <div className="flex justify-between">
                  <span>Tx ID:</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{paymentDetails.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-bold text-white">{paymentDetails.user_email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold text-emerald-400">${paymentDetails.amount?.toFixed(2)} USD</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/dashboard/my-startup"
                className="w-full flex items-center justify-center space-x-1.5 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-brand-600/10"
              >
                <Building className="h-4 w-4" />
                <span>Go to My Startup Workspace</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
