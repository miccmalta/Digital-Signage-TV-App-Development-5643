import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';

const { FiBarChart3, FiTrendingUp, FiActivity, FiMonitor, FiClock, FiEye } = FiIcons;

function Analytics() {
  const { state } = useApp();
  const [timeRange, setTimeRange] = useState('7d');

  const uptimeChartOptions = {
    title: {
      text: 'Screen Uptime',
      textStyle: { color: '#ffffff' }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#475569',
      textStyle: { color: '#ffffff' }
    },
    legend: {
      data: ['Uptime %'],
      textStyle: { color: '#cbd5e1' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: state.analytics.weeklyStats.map(stat => stat.day),
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#cbd5e1' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#cbd5e1' },
      splitLine: { lineStyle: { color: '#334155' } }
    },
    series: [
      {
        name: 'Uptime %',
        type: 'line',
        data: state.analytics.weeklyStats.map(stat => stat.uptime),
        smooth: true,
        lineStyle: { color: '#06b6d4' },
        areaStyle: { color: 'rgba(6,182,212,0.1)' }
      }
    ]
  };

  const contentPlaybackOptions = {
    title: {
      text: 'Content Playback',
      textStyle: { color: '#ffffff' }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#475569',
      textStyle: { color: '#ffffff' }
    },
    legend: {
      data: ['Content Views'],
      textStyle: { color: '#cbd5e1' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: state.analytics.weeklyStats.map(stat => stat.day),
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#cbd5e1' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#cbd5e1' },
      splitLine: { lineStyle: { color: '#334155' } }
    },
    series: [
      {
        name: 'Content Views',
        type: 'bar',
        data: state.analytics.weeklyStats.map(stat => stat.content),
        itemStyle: { color: '#8b5cf6' }
      }
    ]
  };

  const screenStatusOptions = {
    title: {
      text: 'Screen Status Distribution',
      textStyle: { color: '#ffffff' }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1e293b',
      borderColor: '#475569',
      textStyle: { color: '#ffffff' }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#cbd5e1' }
    },
    series: [
      {
        name: 'Screen Status',
        type: 'pie',
        radius: '50%',
        data: [
          { value: state.screens.filter(s => s.status === 'online').length, name: 'Online' },
          { value: state.screens.filter(s => s.status === 'offline').length, name: 'Offline' },
          { value: state.screens.filter(s => s.status === 'warning').length, name: 'Warning' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        itemStyle: {
          color: function(params) {
            const colors = ['#10b981', '#ef4444', '#f59e0b'];
            return colors[params.dataIndex];
          }
        }
      }
    ]
  };

  const stats = [
    {
      title: 'Total Screens',
      value: state.screens.length,
      icon: FiMonitor,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Average Uptime',
      value: '98.5%',
      icon: FiActivity,
      color: 'green',
      change: '+2.1%'
    },
    {
      title: 'Content Views',
      value: '1.2K',
      icon: FiEye,
      color: 'purple',
      change: '+15%'
    },
    {
      title: 'Active Hours',
      value: '156h',
      icon: FiClock,
      color: 'orange',
      change: '+8%'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-slate-400">Monitor performance and usage statistics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className={`text-${stat.color}-400 text-xl`} />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <SafeIcon icon={FiTrendingUp} className="text-xs" />
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6"
        >
          <ReactECharts option={uptimeChartOptions} style={{ height: '300px' }} theme="dark" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6"
        >
          <ReactECharts option={contentPlaybackOptions} style={{ height: '300px' }} theme="dark" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6"
        >
          <ReactECharts option={screenStatusOptions} style={{ height: '300px' }} theme="dark" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Content</h3>
          <div className="space-y-3">
            {state.content.slice(0, 5).map((content, index) => (
              <div key={content.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{content.name}</div>
                    <div className="text-slate-400 text-sm">{content.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{Math.floor(Math.random() * 100) + 50} views</div>
                  <div className="text-slate-400 text-sm">{Math.floor(Math.random() * 10) + 5}h playtime</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Analytics;