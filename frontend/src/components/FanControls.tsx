import React, { useState } from 'react'
import { Settings, Zap, Wind, AlertTriangle } from 'lucide-react'

interface FanControlsProps {
  selectedSpeed: string
  onSpeedChange: (speed: string) => void
  isConnected: boolean
  currentLevel: string
}

const FanControls: React.FC<FanControlsProps> = ({ 
  selectedSpeed, 
  onSpeedChange, 
  isConnected, 
  currentLevel 
}) => {

  const [isLoading, setIsLoading] = useState(false)

  const handleSpeedChange = async (speed: string) => {
    if (!isConnected || isLoading) return
    
    setIsLoading(true)
    try {
      await onSpeedChange(speed)
    } catch (error) {
      console.error('Failed to change fan speed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const presetButtons = [
    {
      id: 'auto',
      label: 'Auto',
      description: 'Automatic fan control (recommended)',
      icon: <Settings className="w-4 h-4" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'full-speed',
      label: 'Full Speed',
      description: 'Maximum fan speed',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-red-600 hover:bg-red-700',
      textColor: 'text-white'
    }
  ]

  const levelButtons = Array.from({ length: 8 }, (_, i) => ({
    id: i.toString(),
    label: i === 0 ? 'Off' : `Level ${i}`,
    description: i === 0 ? 'Fan disabled' : `Manual level ${i}`,
    icon: <Wind className="w-4 h-4" />,
    color: i === 0 
      ? 'bg-gray-600 hover:bg-gray-700' 
      : 'bg-green-600 hover:bg-green-700',
    textColor: 'text-white'
  }))

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          Fan Controls
        </h2>
        {!isConnected && (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Offline</span>
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Level:
          </span>
          <span className="text-sm font-mono text-primary-600 dark:text-primary-400">
            {currentLevel}
          </span>
        </div>
      </div>

      {/* Preset Controls */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Preset Modes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {presetButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleSpeedChange(button.id)}
              disabled={!isConnected || isLoading}
              className={`
                ${button.color} ${button.textColor}
                p-4 rounded-lg transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedSpeed === button.id ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-800' : ''}
                ${isLoading ? 'animate-pulse' : ''}
              `}
            >
              <div className="flex items-center space-x-2 mb-1">
                {button.icon}
                <span className="font-medium">{button.label}</span>
              </div>
              <p className="text-xs opacity-90">{button.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Level Controls */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Manual Levels
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {levelButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleSpeedChange(button.id)}
              disabled={!isConnected || isLoading}
              className={`
                ${button.color} ${button.textColor}
                p-3 rounded-lg transition-all duration-200 text-sm
                disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedSpeed === button.id ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-gray-800' : ''}
                ${isLoading ? 'animate-pulse' : ''}
              `}
            >
              <div className="flex flex-col items-center space-y-1">
                {button.icon}
                <span className="font-medium text-xs">{button.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Warning for manual control */}
      <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Manual Control Warning</p>
            <p>
              Manual fan control may affect system cooling. Use "Auto" mode for optimal performance.
              Level 0 disables the fan completely - use with caution.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FanControls