import React from 'react'

export default function StatsCard({ title, value, icon: Icon, trend, trendUp }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="text-2xl font-bold text-text">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trendUp ? 'text-accent' : 'text-red-500'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-2 bg-primary/10 rounded-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  )
}