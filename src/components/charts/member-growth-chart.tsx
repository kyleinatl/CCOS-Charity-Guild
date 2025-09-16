'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MemberGrowthChartProps {
  data: Array<{
    month: string;
    new_members: number;
    total_members: number;
  }>;
}

export function MemberGrowthChart({ data }: MemberGrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxTotal = Math.max(...data.map(d => d.total_members));
  const maxNew = Math.max(...data.map(d => d.new_members));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Total Members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>New Members</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  {/* Total members bar */}
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ 
                      height: `${(item.total_members / maxTotal) * 200}px`,
                      minHeight: '4px'
                    }}
                    title={`Total: ${item.total_members}`}
                  ></div>
                  
                  {/* New members bar */}
                  <div 
                    className="w-full bg-green-500 rounded transition-all hover:bg-green-600"
                    style={{ 
                      height: `${(item.new_members / maxNew) * 40}px`,
                      minHeight: item.new_members > 0 ? '2px' : '0px'
                    }}
                    title={`New: ${item.new_members}`}
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
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data[data.length - 1]?.total_members || 0}
              </div>
              <div className="text-sm text-muted-foreground">Current Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.reduce((sum, item) => sum + item.new_members, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total New</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(data.reduce((sum, item) => sum + item.new_members, 0) / data.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg/Month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}