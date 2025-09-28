import React from 'react'
import { Shield, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

interface StatusBarProps {
  systemStats: Record<string, string>
  isConnected: boolean
}

const StatusBar: React.FC<StatusBarProps> = ({ systemStats, isConnected }) => {
  const hasPermissions = systemStats.permissions === 'True'
  const procFanExists = systemStats.proc_fan_exists === 'True'

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )
  }

  const getStatusColor = (status: boolean) => {
    return status 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary-600" />
          System Status
        </h2>
      </div>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            {getStatusIcon(isConnected)}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Backend Connection
            </span>
          </div>
          <span className={`text-sm font-mono ${getStatusColor(isConnected)}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Fan Control File */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            {getStatusIcon(procFanExists)}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fan Control File
            </span>
          </div>
          <span className={`text-sm font-mono ${getStatusColor(procFanExists)}`}>
            {procFanExists ? 'Available' : 'Missing'}
          </span>
        </div>

        {/* Permissions */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            {getStatusIcon(hasPermissions)}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Write Permissions
            </span>
          </div>
          <span className={`text-sm font-mono ${getStatusColor(hasPermissions)}`}>
            {hasPermissions ? 'Granted' : 'Denied'}
          </span>
        </div>

        {/* System Requirements Info */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">System Requirements</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>ThinkPad laptop with thinkpad_acpi module</li>
                <li>Fan control enabled in kernel module</li>
                <li>Proper permissions for /proc/acpi/ibm/fan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        {(!procFanExists || !hasPermissions) && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Troubleshooting</p>
                {!procFanExists && (
                  <p className="mb-2">
                    • Add "options thinkpad_acpi fan_control=1" to /etc/modprobe.d/thinkpad_acpi.conf
                  </p>
                )}
                {!hasPermissions && (
                  <p>
                    • Run the application with appropriate permissions or use pkexec
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusBar