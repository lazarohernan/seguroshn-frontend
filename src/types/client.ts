export interface Client {
  id: number
  name: string
  dni: string
  rtn: string
  birthDate: string
  email: string
  company?: string
  phone: string
  alternativePhone?: string
  address: string
  insuranceCount: number
  status: 'active' | 'inactive'
  lastUpdate: string
}
