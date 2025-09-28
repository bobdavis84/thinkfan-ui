export const formatTemperature = (temp: string): { value: number; unit: string } => {
  const match = temp.match(/([+-]?\d+(?:\.\d+)?)\s*°?([CF]?)/)
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] || 'C'
    }
  }
  return { value: 0, unit: 'C' }
}

export const formatFanSpeed = (speed: string): { value: number; unit: string } => {
  const match = speed.match(/(\d+)\s*(RPM)?/)
  if (match) {
    return {
      value: parseInt(match[1]),
      unit: 'RPM'
    }
  }
  return { value: 0, unit: 'RPM' }
}

export const getTemperatureColor = (temp: number): string => {
  if (temp < 40) return 'text-blue-600 dark:text-blue-400'
  if (temp < 60) return 'text-green-600 dark:text-green-400'
  if (temp < 75) return 'text-yellow-600 dark:text-yellow-400'
  if (temp < 85) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

export const getFanSpeedColor = (speed: number): string => {
  if (speed === 0) return 'text-gray-600 dark:text-gray-400'
  if (speed < 2000) return 'text-blue-600 dark:text-blue-400'
  if (speed < 4000) return 'text-green-600 dark:text-green-400'
  if (speed < 6000) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}