'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DonationTrendsChartProps {
  data: Array<{
    month: string;
    total_amount: number;
    donation_count: number;
    average_amount: number;
  }>;
}

export function DonationTrendsChart({ data }: DonationTrendsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donation Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-green-600">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.total_amount));
  const maxCount = Math.max(...data.map(d => d.donation_count));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span>Total Amount</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Donation Count</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  {/* Total amount bar */}
                  <div 
                    className="w-4/5 bg-emerald-500 rounded-t transition-all hover:bg-emerald-600"
                    style={{ 
                      height: `${(item.total_amount / maxAmount) * 200}px`,
                      minHeight: '4px'
                    }}
                    title={`Amount: ${formatCurrency(item.total_amount)}`}
                  ></div>
                  
                  {/* Donation count bar */}
                  <div 
                    className="w-2/5 bg-orange-500 rounded transition-all hover:bg-orange-600"
                    style={{ 
                      height: `${(item.donation_count / maxCount) * 40}px`,
                      minHeight: item.donation_count > 0 ? '2px' : '0px'
                    }}
                    title={`Count: ${item.donation_count}`}
                  ></div>
                  
                  {/* Month label */}
                  <div className="text-xs text-muted-foreground transform -rotate-45 origin-left whitespace-nowrap">
                    {new Date(item.month + '-01').toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">
                {formatCurrency(data.reduce((sum, item) => sum + item.total_amount, 0))}
              </div>
              <div className="text-sm text-green-600">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {data.reduce((sum, item) => sum + item.donation_count, 0)}
              </div>
              <div className="text-sm text-green-600">Total Donations</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(data.reduce((sum, item) => sum + item.average_amount, 0) / data.length)}
              </div>
              <div className="text-sm text-green-600">Avg Amount</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {(data.reduce((sum, item) => sum + item.donation_count, 0) / data.length).toFixed(1)}
              </div>
              <div className="text-sm text-green-600">Avg/Month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}