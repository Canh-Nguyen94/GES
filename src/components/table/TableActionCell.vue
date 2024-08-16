<script setup>
import { ref, toRefs, watch, computed } from 'vue'
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  Info,
  Printer,
  Download,
  CloudUpload
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Button, Icon } from '@common/ui'
import Text from '@components/text/Text.vue'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@common/ui/dropdown-menu'
import { useLayoutStore } from '@store/layout.store'
import { useCacheStore } from '@store/cache.store'
import { useAuthStore } from '@store'
import { isPermitted } from '@utils/common.util'
import { ACTIONS_ROLE } from '@constants/user-role.constant'

const { triggerCounterDetail } = useCacheStore()
const { toggleLoading } = useLayoutStore()
const { permissions, isSuperAdmin: isBimarAdmin } = storeToRefs(useAuthStore())

const props = defineProps({
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  path: {
    type: String,
    default: ''
  },
  value: {
    type: Object
  },
  actions: {
    type: Array,
    default: () => []
  },
  linkToDetail: {
    type: String,
    default: ''
  },
  linkToEdit: {
    type: String,
    default: ''
  },
  linkToInvite: {
    type: String,
    default: ''
  },
  setOpenPopup: {
    type: Function
  },
  setOpenSidePanel: {
    type: Function
  },
  handleView: {
    type: Function
  },
  handleEdit: {
    type: Function
  },
  handleDelete: {
    type: Function
  },

  // props related to tag
  handlePrintTag: {
    type: Function
  },

  // props related to model
  handleUploadProcessedModel: {
    type: Function
  },
  handleFileChange: {
    type: Function
  },
  handleDownloadBimModel: {
    type: Function
  },
  handleShowInFolder: {
    type: Function
  }
})

const { path, actions: tableActions } = toRefs(props)
const newActions = computed(() => {
  const permitedActions = []
  props.actions?.forEach((action) => {
    const checkPassing = isPermitted(isBimarAdmin.value, path.value, permissions.value, action)
    if (checkPassing) {
      permitedActions.push(action)
    }
  })
  return permitedActions
})

const _handleView = (value) => {
  triggerCounterDetail()
  if (props.handleView) props.handleView(value)
}
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <RouterLink
      v-if="actions.includes('detail')"
      :disabled="!newActions.includes('detail')"
      :to="linkToDetail"
    >
      <Icon icon="ic-expand" />
    </RouterLink>

    <DropdownMenu v-if="actions.length > 0">
      <DropdownMenuTrigger @click.prevent.stop>
        <EllipsisVertical class="text-secondary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="flex flex-col gap-2 py-[6px]">
        <DropdownMenuItem as-child>
          <Button
            v-if="actions.includes(ACTIONS_ROLE.view)"
            :disabled="!newActions.includes(ACTIONS_ROLE.view)"
            variant="ghost"
            class="flex gap-2 justify-start px-5 py-1 w-full text-left"
            @click="_handleView(value)"
          >
            <Info size="24" class="text-secondary" />
            <Text>View Details </Text>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <Button
            v-if="actions.includes(ACTIONS_ROLE.edit) || isSuperAdmin"
            :disabled="!newActions.includes(ACTIONS_ROLE.edit) || isSuperAdmin"
            variant="ghost"
            class="flex gap-2 justify-start px-5 py-1 w-full text-left"
            @click="handleEdit"
          >
            <Pencil size="24" class="text-secondary" />
            <Text>Edit </Text>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <Button
            v-if="actions.includes(ACTIONS_ROLE.showInFolder) || isSuperAdmin"
            :disabled="!newActions.includes(ACTIONS_ROLE.showInFolder) || isSuperAdmin"
            variant="ghost"
            class="flex gap-2 justify-start px-5 py-1 w-full text-left"
            @click="handleShowInFolder(value.folder?.name, value.folder?.id)"
          >
            <Icon icon="folder" :size="24" class="" />
            <Text>Show in Folder </Text>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <Button
            v-if="actions.includes(ACTIONS_ROLE.rename) || isSuperAdmin"
            :disabled="!newActions.includes(ACTIONS_ROLE.rename) || isSuperAdmin"
            variant="ghost"
            class="flex gap-2 justify-start px-5 py-1 w-full text-left"
            @click="handleRename"
          >
            <Pencil size="24" class="text-secondary" />
            <Text>Rename </Text>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <Button
            v-if="actions.includes(ACTIONS_ROLE.print) || isSuperAdmin"
            :disabled="!newActions.includes(ACTIONS_ROLE.print) || isSuperAdmin"
            variant="ghost"
            class="flex gap-2 justify-start px-5 py-1 w-full text-left"
            @click="handlePrintTag(value.name)"
          >
            <Printer size="24" class="text-secondary" />
            <Text>Print Tag </Text>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <Button
            v-if="actions.includes(ACTIONS_ROLE.downloadBIMModel) || isSuperAdmin"
            :disabled="!newActions.includes(ACTIONS_ROLE.downloadBIMModel) || isSuperAdmin"
            variant="ghost"
            class="flex gap-2 justify-start px-5 py-1 w-full text-left"
            @click="handleDownloadBimModel(value.accName, value.id)"
          >
            <Download size="24" class="text-secondary" />
            <Text>Download BIM </Text>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <Button
            v-if="actions.includes(ACTIONS_ROLE.uploadProcessedModel) || isSuperAdmin"
            :disabled="!newActions.includes(ACTIONS_ROLE.uploadProcessedModel) || isSuperAdmin"
            variant="ghost"
            class="flex gap-2 justify-start px-5 py-1 w-full text-left"
          >
            <CloudUpload size="24" class="text-secondary" />
            <input
              type="file"
              :id="'_' + value.id"
              @change="handleFileChange(value.accName, value.id)"
              style="display: none"
              webkitdirectory
              multiple
            />
            <Text @click="handleUploadProcessedModel(value.id)">Upload Processed Model </Text>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <Button
            v-if="actions.includes(ACTIONS_ROLE.delete) || isSuperAdmin"
            :disabled="!newActions.includes(ACTIONS_ROLE.delete) || isSuperAdmin"
            variant="ghost"
            class="flex gap-2 justify-start px-5 py-1 w-full"
            @click="handleDelete(value.name, value.id || value.accName, value.id)"
          >
            <Trash2 size="24" class="text-destructive" />
            <Text> Delete </Text>
          </Button>
        </DropdownMenuItem>
        <slot name="action-group" />
      </DropdownMenuContent>
      <slot />
    </DropdownMenu>
  </div>
</template>
