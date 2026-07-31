export interface NavItem {
  label: string
  to: string
  icon?: Component
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

import { Receipt, Users, ChevronRight } from '@lucide/vue';

export const mainNavItems: NavItem[] = [
  { label: 'Lista de Facturas', to: '/bills', icon: Receipt },
  { label: 'Lista de Facturas por Participante', to: '/billMembers', icon: Users },
]

export const manageGroup: NavGroup = {
  label: 'Administrar',
  items: [
    { label: 'Lista de Participantes', to: '/manage/members' },
    { label: 'Lista de Comercios', to: '/manage/places' },
  ],
}