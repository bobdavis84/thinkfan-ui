import { useState } from 'react'
import { useWebSocket } from './hooks/useWebSocket'
import { useTheme } from './hooks/useTheme'
import TemperatureCard from './components/TemperatureCard'
import FanCard from './components/FanCard'
import FanControls from './components/FanControls'
import StatusBar from './components/StatusBar'
import Header from './components/Header'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { systemInfo, isConnected, sendFanControl } = useWebSocket()
  const [selectedFanSpeed, setSelectedFanSpeed] = useState<string>('auto')

  const handleFanSpeedChange = async (speed: string) => {
    setSelectedFanSpeed(speed)
    await sendFanControl(speed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Header 
          theme={theme} 
          onToggleTheme={toggleTheme} 
          isConnected={isConnected}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TemperatureCard 
            temperatures={systemInfo?.temperatures || {}} 
            isConnected={isConnected}
          />
          <FanCard 
            fanInfo={systemInfo?.fan_info || {}} 
            isConnected={isConnected}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <FanControls
              selectedSpeed={selectedFanSpeed}
              onSpeedChange={handleFanSpeedChange}
              isConnected={isConnected}
              currentLevel={systemInfo?.fan_info?.level || 'auto'}
            />
          </div>
          <div>
            <StatusBar 
              systemStats={systemInfo?.system_stats || {}}
              isConnected={isConnected}
            />
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          <p>ThinkFan UI v2.0.0 - Modern fan control for ThinkPad laptops</p>
          <p className="mt-1">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App