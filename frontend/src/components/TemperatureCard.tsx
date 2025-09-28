import React from 'react'
import { Thermometer, Cpu, Activity } from 'lucide-react'
import { formatTemperature, getTemperatureColor } from '../utils/formatters'

interface TemperatureCardProps {
  temperatures: Record<string, string>
  isConnected: boolean
}

const TemperatureCard: React.FC<TemperatureCardProps> = ({ temperatures, isConnected }) => {
  const getIcon = (label: string) => {
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('cpu') || lowerLabel.includes('core')) {
      return <Cpu className="w-4 h-4" />
    }
    if (lowerLabel.includes('usage') || lowerLabel.includes('load')) {
      return <Activity className="w-4 h-4" />
    }
    return <Thermometer className="w-4 h-4" />
  }

  const sortedTemps = Object.entries(temperatures).sort(([a], [b]) => {
    // Prioritize CPU-related sensors
    const aPriority = a.toLowerCase().includes('cpu') ? 0 : 1
    const bPriority = b.toLowerCase().includes('cpu') ? 0 : 1
    if (aPriority !== bPriority) return aPriority - bPriority
    return a.localeCompare(b)
  })

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Thermometer className="w-5 h-5 mr-2 text-primary-600" />
          Temperature Sensors
        </h2>
        {!isConnected && (
          <span className="text-xs text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
            Offline
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {sortedTemps.length > 0 ? (
          sortedTemps.map(([label, value]) => {
            const isTemperature = value.includes('°C')
            const { value: numValue } = isTemperature 
              ? formatTemperature(value) 
              : { value: parseFloat(value.replace(/[^\d.-]/g, '')) }
            
            return (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getIcon(label)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </div>
                <span className={`text-sm font-mono ${
                  isTemperature ? getTemperatureColor(numValue) : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {value}
                </span>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Thermometer className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No temperature data available</p>
            {!isConnected && (
              <p className="text-xs mt-1">Check connection to backend</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemperatureCard