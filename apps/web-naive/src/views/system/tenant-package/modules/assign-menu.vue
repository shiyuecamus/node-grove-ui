<script lang="ts" setup>
import type { Arrayable } from '@vueuse/core';
import type {
  TransferOption,
  TransferRenderSourceList,
  TransferRenderTargetLabel,
} from 'naive-ui';

import type { IdType, Recordable } from '@vben/types';

import { h, nextTick, ref } from 'vue';

import { useVbenModal, VbenTree } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { NSpin, NTransfer } from 'naive-ui';

import { getAllMenus, getTenantPackageMenuIds } from '#/api/core';

interface IconTransferOption extends TransferOption {
  icon: string;
}

defineOptions({ name: 'AssignMenu' });

const emit = defineEmits<{
  submit: [IdType, Array<IdType>];
}>();

const loading = ref(false);
const packageId = ref<IdType>();
const value = ref<Array<IdType>>([]);
const options = ref<TransferOption[]>([]);
const treeData = ref<Recordable<any>[]>([]);

/**
 * Función para aplanar la estructura de árbol en una lista de opciones
 */
function flattenTree(list: Recordable<any>[]): IconTransferOption[] {
  const result: IconTransferOption[] = [];

  function flatten(items: Recordable<any>[] = []) {
    items.forEach((item) => {
      // Añadir el item actual al resultado
      result.push({
        label: item.meta?.title ? $t(item.meta.title) : item.name || '',
        value: item.id,
        disabled: false,
        icon: item.meta?.icon || '',
      });

      // Procesar recursivamente los hijos si existen
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    });
  }

  flatten(list);
  return result;
}

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  closable: false,
  class: 'w-2/5',
  onCancel() {
    modalApi.close();
  },
  onConfirm: () => {
    modalApi.close();
    emit('submit', packageId.value as unknown as number, value.value);
  },
  onOpenChange(isOpen: boolean) {
    nextTick(async () => {
      if (isOpen) {
        loading.value = true;

        const { packageId: pkgId } = modalApi.getData<Recordable<any>>();
        packageId.value = pkgId;

        // Obtener los datos del árbol
        treeData.value = await getAllMenus();

        // Generar el array plano de opciones para el transfer
        options.value = flattenTree(treeData.value);

        // Obtener los valores seleccionados
        value.value = await getTenantPackageMenuIds(pkgId);

        loading.value = false;
      }
    });
  },
});

const renderSourceList: TransferRenderSourceList = function ({ onCheck }) {
  return h(
    VbenTree,
    {
      treeData: treeData.value,
      multiple: true,
      defaultExpandedLevel: 1,
      checkable: true,
      selectable: false,
      checkOnClick: true,
      valueField: 'id',
      keyField: 'id',
      labelField: 'meta.title',
      iconField: 'meta.icon',
      childrenField: 'children',
      modelValue: value.value,
      'onUpdate:modelValue': (selectedKeys: Arrayable<IdType> | undefined) => {
        if (selectedKeys) {
          value.value = Array.isArray(selectedKeys)
            ? selectedKeys
            : [selectedKeys];
          onCheck(value.value);
        }
      },
    },
    {
      node: ({ value: nodeValue }: { value: Recordable<any> }) => {
        return h(
          'div',
          {
            class: 'flex items-center gap-2',
          },
          [
            nodeValue.meta?.icon
              ? h(IconifyIcon, { icon: nodeValue.meta.icon })
              : null,
            nodeValue.meta?.title ? $t(nodeValue.meta.title) : '',
          ],
        );
      },
    },
  );
};

const renderTargetLavel: TransferRenderTargetLabel = function ({ option }) {
  return h(
    'div',
    {
      class: 'flex items-center gap-2',
    },
    [
      (option as IconTransferOption).icon
        ? h(IconifyIcon, { icon: (option as IconTransferOption).icon })
        : null,
      (option as IconTransferOption).label,
    ],
  );
};
</script>

<template>
  <Modal>
    <NSpin :show="loading">
      <NTransfer
        size="small"
        v-model:value="value"
        :options="options"
        :render-source-list="renderSourceList"
        :render-target-label="renderTargetLavel"
      />
    </NSpin>
  </Modal>
</template>

<style lang="css" scoped></style>
