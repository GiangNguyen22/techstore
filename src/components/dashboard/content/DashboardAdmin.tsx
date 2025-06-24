import React, { useEffect, useState } from 'react';
import StatsCard from '../StatsCard';
import WeeklyReport from '../WeeklyReport';
import UsersBarChart from '../UsersBarChart';
import SalesByCountry from '../SalesByCountry';
import TransactionsTable from '../TransactionsTable';
import TopProducts from '../TopProducts';
import {getPaymentTotal} from '../../../api/payment';
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
          value={`$${saleData.totalSale.toLocaleString()}`}
          subtitle="Last 7 days"
          subvalue="Sales"
          percentage={`↑ ${saleData.increaseSale}%`}
        />
        <StatsCard
          title="Total Orders"
          value="10.7K"
          badge="2000.23"
          subvalue="Orders"
          percentage="↑ 14.4%"
        />
        <StatsCard
          title="Pending & Canceled"
          value="509"
          subtitle="Last 7 days"
          subvalue="User 1000"
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
