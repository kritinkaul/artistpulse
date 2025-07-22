'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface GoogleTrendsInterest {
  date: string;
  interest: number;
}

interface GoogleTrendsRegional {
  country: string;
  interest: number;
}

interface GoogleTrendsQuery {
  query: string;
  value: string | number;
}

interface GoogleTrendsProps {
  googleTrends?: {
    interest?: {
      artist: string;
      interest_over_time: GoogleTrendsInterest[];
      peak_interest: number;
      average_interest: number;
      timeframe: string;
      status: string;
      service_available?: boolean;
      fallback?: boolean;
    };
    regional?: {
      artist: string;
      top_countries: GoogleTrendsRegional[];
      status: string;
      fallback?: boolean;
    };
    related?: {
      artist: string;
      rising_queries: GoogleTrendsQuery[];
      top_queries: GoogleTrendsQuery[];
      status: string;
      fallback?: boolean;
    };
  };
}

export default function GoogleTrends({ googleTrends }: GoogleTrendsProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Only show if we have actual Google Trends data
  const hasData = googleTrends?.interest?.status === 'success' || 
                  googleTrends?.regional?.status === 'success' || 
                  googleTrends?.related?.status === 'success';

  const isServiceAvailable = !googleTrends?.interest?.fallback && 
                            !googleTrends?.regional?.fallback && 
                            !googleTrends?.related?.fallback;

  // Don't render if no data and service is unavailable
  if (!hasData && !isServiceAvailable) {
    return null;
  }

  const interestData = googleTrends?.interest;
  const regionalData = googleTrends?.regional;
  const relatedData = googleTrends?.related;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Google Trends Analytics
        </h2>
        
        {!isServiceAvailable && (
          <div className="text-xs text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
            LIMITED DATA - Service Unavailable
          </div>
        )}
      </div>

      {/* Service unavailable message */}
      {!isServiceAvailable && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-medium">Google Trends Service Unavailable</span>
          </div>
          <p className="text-yellow-300/80 text-sm mt-1">
            The Google Trends microservice is not running. Start it with: <code className="bg-yellow-500/20 px-1 rounded">./python-services/start_trends_service.sh</code>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interest Over Time */}
        {interestData?.interest_over_time && interestData.interest_over_time.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">Search Interest Over Time</h3>
            <div className="mb-3 text-sm text-gray-400">
              <div>Peak Interest: <span className="text-blue-400 font-semibold">{interestData.peak_interest}</span></div>
              <div>Average: <span className="text-blue-400 font-semibold">{interestData.average_interest}</span></div>
              <div>Timeframe: <span className="text-gray-300">{interestData.timeframe}</span></div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={interestData.interest_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="interest" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: '#60A5FA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Countries */}
        {regionalData?.top_countries && regionalData.top_countries.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">Top Countries by Interest</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={regionalData.top_countries.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="country" 
                  stroke="#9CA3AF"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar 
                  dataKey="interest" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Rising Queries */}
        {relatedData?.rising_queries && relatedData.rising_queries.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">Rising Search Queries</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {relatedData.rising_queries.slice(0, 8).map((query, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300 text-sm truncate flex-1">{query.query}</span>
                  <span className="text-green-400 font-semibold text-sm ml-2">
                    {typeof query.value === 'string' && query.value.includes('%') ? query.value : `+${query.value}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Queries */}
        {relatedData?.top_queries && relatedData.top_queries.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">Top Related Queries</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {relatedData.top_queries.slice(0, 8).map((query, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300 text-sm truncate flex-1">{query.query}</span>
                  <span className="text-blue-400 font-semibold text-sm ml-2">
                    {typeof query.value === 'number' ? `${query.value}%` : query.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* No data message when service is available but no data */}
      {isServiceAvailable && !hasData && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500">No Google Trends data available for this artist</p>
        </div>
      )}
    </div>
  );
}
