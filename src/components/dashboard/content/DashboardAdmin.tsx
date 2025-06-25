import React, { useEffect, useState } from 'react';
import StatsCard from '../StatsCard';
import WeeklyReport from '../WeeklyReport';
import UsersBarChart from '../UsersBarChart';
import SalesByCountry from '../SalesByCountry';
import TransactionsTable from '../TransactionsTable';
import TopProducts from '../TopProducts';
import {getPaymentTotal} from '../../../api/payment';
import { getOrdersReport } from '../../../api/orders';
import { getPendingCancelledOrders } from '../../../api/orders';
import { ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  subtitle?: string;
  subvalue?: string;
  percentage?: string;
  badge?: string;
}
interface SaleReport{
  totalSale: number;
  priviousSale: number;
  increaseSale: number;
}
interface RawSaleReport {
  totalSale: number;
  previousSale: number;
  increaseSale: number;
}
interface OrderReport {
  totalOrders: number;
 previousTotalOrders: number;
  percent: number;
}



interface Pending{
  pending:number;
    cancel:number;
}


const DashboardContent = () => {
  const [saleData, setSaleData] = useState<SaleReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaymentTotal()
      .then((data:RawSaleReport) => {
        const totalSale = data.totalSale || 0;
        const priviousSale = data.previousSale || 0;
        const increaseSale = totalSale > 0 ? ((totalSale - priviousSale) / priviousSale * 100).toFixed(2) : 0;

        setSaleData({
          totalSale,
          priviousSale,
          increaseSale: increaseSale ? parseFloat(increaseSale) : 0,
        });
        setLoading(false);
      });
  }, []);
  console.log(saleData);

const [orderData, setOrderData] = useState<OrderReport | null>(null);

useEffect(() => {
  const fetchOrdersReport = async () => {
    try {
      const data: OrderReport = await getOrdersReport();
      setOrderData({
        totalOrders: data.totalOrders || 0,
        previousTotalOrders: data.previousTotalOrders || 0,
        percent: data.percent || 0,
      });
    } catch (error) {
      console.error("Error fetching orders report:", error);
      setOrderData(null);
    }
  };
  fetchOrdersReport();
}, []);

const [pendingData, setPendingData] = useState<Pending | null>(null);
useEffect(() => {
  const fetchPendingCancelledOrders = async () => {
    try {
      const data: Pending = await getPendingCancelledOrders();
      setPendingData({
        pending: data.pending || 0,
        cancel: data.cancel || 0,
      });
      console.log("Pending & Cancelled Orders:", data);
     
    } catch (error) {
      console.error("Error fetching pending cancelled orders:", error);
      setPendingData(null);
    }
  };
  fetchPendingCancelledOrders();
}, []);
 console.log("pending log: ", pendingData);


  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
if (!saleData) {
  return <p>Loading...</p>;
}
  return (
    <div>
      {/* Top Stats - Static structure, dynamic values */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total Sales"
          value={`${saleData.totalSale.toLocaleString()}`}
          subtitle="Last 7 days"
          subvalue="Sales"
          percentage={`↑ ${saleData.increaseSale}%`}
        />
        <StatsCard
          title="Total Orders"
          value={`${orderData?.totalOrders.toLocaleString()}`}
          //badge="2000.23"
          subvalue="Orders"
          percentage={`↑ ${orderData?.percent}%`}
        />
        <StatsCard
          title="Pending & Canceled"
          value={(pendingData?.pending ?? 0).toLocaleString()}
          subtitle="Last 7 days"
          subvalue={(pendingData?.cancel ?? 0).toLocaleString()}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-3 gap-6">
        <WeeklyReport />
        <div className="space-y-6">
          <UsersBarChart />
          <SalesByCountry />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <TransactionsTable />
        <TopProducts />
      </div>
    </div>
  );
};

export default DashboardContent;
