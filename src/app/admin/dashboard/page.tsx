'use client'

import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface DashboardStats {
  totalListings: number
  activeListings: number
  soldListings: number
  listingGrowth: number | null
  totalUsers: number
  pendingListings: number
}

interface MonthlyListingCount {
  month: string // format: '2025-01'
  count: number
}

interface ListingStatusCount {
  status: string
  count: number
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c']

// 补全 1-12 月数据，缺失的月份用 0 补上
function fillMissingMonths(data: MonthlyListingCount[], year: number): MonthlyListingCount[] {
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthStr = `${year}-${(i + 1).toString().padStart(2, '0')}`
    return { month: monthStr, count: 0 }
  })
  const dataMap = new Map(data.map(d => [d.month, d.count]))
  return months.map(m => ({
    month: m.month,
    count: dataMap.get(m.month) ?? 0,
  }))
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyCounts, setMonthlyCounts] = useState<MonthlyListingCount[]>([])
  const [statusCounts, setStatusCounts] = useState<ListingStatusCount[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [years, setYears] = useState<number[]>([])

  useEffect(() => {
    fetch('/api/admin/dashboard/stats')
      .then(res => res.ok ? res.json() : Promise.reject('Stats fetch failed'))
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching dashboard stats:', error))
  }, [])

  useEffect(() => {
    fetch(`/api/admin/dashboard/charts?year=${selectedYear}`)
      .then(res => res.ok ? res.json() : Promise.reject('Chart data fetch failed'))
      .then(data => {
        const filled = fillMissingMonths(data.monthlyCounts, selectedYear)
        setMonthlyCounts(filled)
        setStatusCounts(data.statusCounts)
      })
      .catch(error => console.error('Error fetching chart data:', error))
  }, [selectedYear])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearList = []
    for (let y = currentYear; y >= 2020; y--) yearList.push(y)
    setYears(yearList)
  }, [])

  if (!stats) return <div>Loading...</div>

  const formattedGrowth = (() => {
    if (stats.listingGrowth == null) return 'N/A'
    if (stats.listingGrowth === 0) return 'No change from last month'
    const sign = stats.listingGrowth > 0 ? '+' : ''
    return `${sign}${stats.listingGrowth.toFixed(2)}% from last month`
  })()

  return (
    <div className="p-4 space-y-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Total Listings" value={stats.totalListings} icon="fas fa-home" color="text-blue-600" subtitle={formattedGrowth} />
        <StatCard title="Active Listings" value={stats.activeListings} icon="fas fa-check-circle" color="text-green-500" subtitle="Currently available" />
        <StatCard title="Sold Listings" value={stats.soldListings} icon="fas fa-tag" color="text-red-500" subtitle="This month" />
        <StatCard title="Total Users" value={stats.totalUsers} icon="fas fa-users" color="text-purple-500" subtitle="System-wide" />
        <StatCard title="Pending Listings" value={stats.pendingListings} icon="fas fa-clock" color="text-yellow-500" subtitle="Awaiting approval" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Monthly Listing Submissions</h2>
            <select
              className="border rounded px-2 py-1"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Listing Approval Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="count"
                nameKey="status"
                outerRadius={100}
                label
              >
                {statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// Stat Card
function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string
  value: number
  icon: string
  color: string
  subtitle: string
}) {
  return (
    <div className="rounded-xl shadow-lg p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">{title}</div>
        <div className={`text-3xl ${color}`}>
          <i className={icon}></i>
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500 mt-2">{subtitle}</div>
    </div>
  )
}
