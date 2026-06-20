import React, { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, ShieldAlert, DollarSign, Calendar } from "lucide-react";
import Loading from "../Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/admin/transactions`);
        if (res.data.success) {
          setTransactions(res.data.transactions);
        }
      } catch (err) {
        console.error("Failed to load admin transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
        <CreditCard className="h-5.5 w-5.5 text-brand-500" />
        <span>Transactions Audit Logs ({transactions.length})</span>
      </h2>

      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-dark-900/30 border border-dark-850 rounded-xl text-slate-500 text-sm">
          No premium transactions have been logged on the platform yet.
        </div>
      ) : (
        <div className="glass rounded-xl border border-dark-850 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dark-900 border-b border-dark-850 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Customer Email</th>
                  <th className="p-4">Paid Amount</th>
                  <th className="p-4">Transaction Date</th>
                  <th className="p-4 text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-900 text-slate-300">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-dark-900/30 transition-colors">
                    <td className="p-4 font-bold text-white tracking-wide">
                      {tx.transaction_id}
                    </td>
                    <td className="p-4 font-medium text-slate-350">
                      {tx.user_email}
                    </td>
                    <td className="p-4 font-bold text-brand-400">
                      ${tx.amount?.toFixed(2)} USD
                    </td>
                    <td className="p-4 text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{new Date(tx.paid_at || tx.createdAt).toLocaleString()}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-[9px] px-2.5 py-1 rounded bg-emerald-950/20 border border-emerald-500/20 font-bold uppercase text-emerald-400">
                        {tx.payment_status || "Succeeded"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
