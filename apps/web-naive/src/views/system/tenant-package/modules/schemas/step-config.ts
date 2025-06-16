import { h } from 'vue';

import { $t } from '@vben/locales';

import { NGradientText } from 'naive-ui';

// Step configuration for multi-step form
export const stepConfigs = [
  {
    title: h(
      NGradientText,
      {
        type: 'warning',
        size: '14',
      },
      {
        default: () => $t('page.system.tenantPackage.basicInfo'),
      },
    ),
    icon: 'lucide:info',
    description: $t('page.system.tenantPackage.basicInfoDescription'),
  },
  {
    title: h(
      NGradientText,
      {
        type: 'info',
        size: '14',
      },
      {
        default: () => $t('page.system.tenantPackage.limitsInfo'),
      },
    ),
    icon: 'lucide:settings',
    description: $t('page.system.tenantPackage.limitsInfoDescription'),
  },
  {
    title: h(
      NGradientText,
      {
        type: 'success',
        size: '14',
      },
      {
        default: () => $t('page.system.tenantPackage.queueInfo.title'),
      },
    ),
    icon: 'lucide:message-circle',
    description: $t('page.system.tenantPackage.queueInfo.description'),
  },
];
