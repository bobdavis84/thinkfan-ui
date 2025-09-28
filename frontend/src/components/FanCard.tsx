import React from 'react'
import { Fan, Settings, Power } from 'lucide-react'
import { formatFanSpeed, getFanSpeedColor } from '../utils/formatters'

interface FanCardProps {
  fanInfo: Record<string, string>
  isConnected: boolean
}

const FanCard: React.FC<FanCardProps> = ({ fanInfo, isConnected }) => {
  const getIcon = (label: string) => {
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('status')) {
      return <Power className="w-4 h-4" />
    }
    if (lowerLabel.includes('level')) {
      return <Settings className="w-4 h-4" />
    }
    return <Fan className="w-4 h-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'enabled':
        return 'text-green-600 dark:text-green-400'
      case 'disabled':
        return 'text-red-600 dark:text-red-400'
      case 'auto':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const sortedFanInfo = Object.entries(fanInfo).sort(([a], [b]) => {
    // Prioritize Fan1, then status, then level
    const order = ['Fan1', 'status', 'level']
    const aIndex = order.findIndex(item => a.includes(item))
    const bIndex = order.findIndex(item => b.includes(item))
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.localeCompare(b)
  })

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Fan className="w-5 h-5 mr-2 text-primary-600" />
          Fan Information
        </h2>
        {!isConnected && (
          <span className="text-xs text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
            Offline
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {sortedFanInfo.length > 0 ? (
          sortedFanInfo.map(([label, value]) => {
            const isRPM = value.includes('RPM')
            const isStatus = label.toLowerCase().includes('status')
            const { value: numValue } = isRPM 
              ? formatFanSpeed(value) 
              : { value: 0 }
            
            let displayValue = value
            let colorClass = 'text-gray-600 dark:text-gray-400'
            
            if (isRPM) {
              colorClass = getFanSpeedColor(numValue)
            } else if (isStatus) {
              colorClass = getStatusColor(value)
            }
            
            return (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getIcon(label)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label === 'Fan1' ? 'Primary Fan' : label}
                  </span>
                </div>
                <span className={`text-sm font-mono ${colorClass}`}>
                  {displayValue}
                </span>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Fan className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No fan data available</p>
            {!isConnected && (
              <p className="text-xs mt-1">Check connection to backend</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FanCard