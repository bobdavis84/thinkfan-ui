export interface SystemInfo {
  temperatures: Record<string, string>
  fan_info: Record<string, string>
  system_stats: Record<string, string>
}

export interface FanControlRequest {
  speed: string
}

export type Theme = 'light' | 'dark'

export interface SensorData {
  label: string
  value: string
  unit?: string
  type: 'temperature' | 'fan' | 'system'
}