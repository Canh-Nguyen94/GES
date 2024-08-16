<script setup>
import { storeToRefs } from 'pinia'
import { Transition, computed, onUnmounted, watch, ref } from 'vue'
import {
  Pencil,
  Download,
  CloudUpload,
  CalendarDays,
  UserRound,
  Trash2,
  X,
  Check
} from 'lucide-vue-next'
import { Button } from '@common/ui/button'
import { Table, TableRow, TableCell } from '@common/ui/table'
import Text from '@components/text/Text.vue'
import ModelStatus from '@views/models/ModelStatus.vue'
import { useLayoutStore } from '@store/layout.store'
import { useCacheStore } from '@store/cache.store'
import { modelsService } from '@service/models.service'
import { formatTimeStamp } from '@utils/datetime.util'
import { toast_failed, toast_successfully } from '@utils/toast.util'
import { useAuthStore } from '@store'

const { toggleConfirmDelete, toggleLoading, toggleViewDetail } = useLayoutStore()
const { setCache, setPopupCache, triggerCounter } = useCacheStore()
const { isProjectAdmin, isSuperAdmin: isBimarAdmin } = storeToRefs(useAuthStore())
const { cache, counterDetail } = storeToRefs(useCacheStore())

defineProps({
  data: { type: Object, required: false }
})

const emits = defineEmits(['update:modelValue'])
const modelValue = defineModel()

const onEdit = ref(false)
const incomingName = ref('')

const queryParams = computed(() => {
  return {
    id: cache.value.id,
    counter: counterDetail
  }
})
const { data, status, isFetching } = modelsService.getModelDetail(queryParams)

const closePanel = () => {
  incomingName.value = ''
  toggleViewDetail(false)
}

function getUserDisplayName(firstName = '', lastName = '') {
  let displayName = firstName + ' ' + lastName
  return displayName?.slice(0, 20) + (displayName?.length > 20 ? '...' : '')
}

const getModelName = (name, accName) => {
  return name || accName
}

const handleDelete = (modelName, id) => {
  setPopupCache({ name: modelName, id })
  toggleConfirmDelete()
}

const handleDownloadBimModel = async (modelName, id) => {
  try {
    toggleLoading(true)
    await modelsService.downloadBimModel(modelName, id)

    toast_successfully('Download model successfully')
  } catch (e) {
    toast_failed('Download model failed')
    console.log('Download model failed', JSON.stringify(e))
  } finally {
    toggleLoading(false)
  }
}

const handleUploadProcessedModel = (id) => {
  document.querySelector(`input#${id}`).click()
}

const handleFileChange = (modelName, id) => {
  const files = event.target.files
  uploadProcessedModel(files, modelName, id)
}

const uploadProcessedModel = async (files, folderName, id) => {
  try {
    toggleLoading(true)
    await modelsService.uploadProcessedModel(files, folderName, id)

    toast_successfully('Your files are uploaded, please wait for processing')
  } catch (e) {
    toast_failed('Failed to upload your files')
    console.log('Error while upload process model', JSON.stringify(e))
  } finally {
    toggleLoading(false)
  }
}

const handleRename = () => {
  onEdit.value = true
}

const handleRename_submit = async (id) => {
  try {
    toggleLoading(true)
    await modelsService.updateModel(id, {
      name: incomingName.value
    })
  } catch (e) {
    console.log('Rename error', JSON.stringify(e))
  } finally {
    onEdit.value = false
    triggerCounter()
    toggleLoading(false)
  }
}

const handleRename_cancel = () => {
  onEdit.value = false
}

watch(modelValue, () => {
  if (modelValue.value === true) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

watch(
  isFetching,
  (newValue) => {
    toggleLoading(newValue)
  },
  { immediate: true }
)

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <!-- <Teleport to="#panel"> -->
  <Transition name="slide-to-left">
    <div v-show="modelValue" class="fixed inset-0 h-full mt-18 z-50">
      <!-- handle click outside modal to close @click="closePanel"  -->
      <div class="absolute inset-0 bg-opacity bg-opacity-50 transition-opacity"></div>
      <!-- Sidebar Content -->
      <section class="absolute inset-y-0 right-0 md:pl-10 max-w-full flex">
        <div class="w-screen max-w-lg">
          <div class="h-full flex flex-col bg-background z-99 shadow-panel pt-4.5rem pb-2.5rem">
            <!-- Sidebar Header -->
            <div class="flex items-center justify-end pt-4 pr-4">
              <button @click="closePanel">
                <X size="28" class="text-secondary" />
              </button>
            </div>
            <!-- Sidebar Content -->
            <div class="h-full px-10 overflow-auto">
              <div v-if="!onEdit" class="md:mt-3rem mt-1rem grid grid-cols-10">
                <h1
                  type="heading"
                  class="leading-none text-[26px] font-semibold text-black col-span-9"
                >
                  {{ incomingName || getModelName(data?.name, data?.accName) }}
                </h1>
                <div class="inline-flex items-center justify-center">
                  <Button
                    :disabled="!isProjectAdmin && !isBimarAdmin"
                    @click="handleRename"
                    class="border border-secondary rounded-[6px] w-fit h-fit p-1"
                    ><Pencil size="24" class="text-secondary"
                  /></Button>
                </div>
              </div>
              <div v-else class="md:mt-3rem mt-1rem">
                <Input
                  :disabled="!isProjectAdmin && !isBimarAdmin"
                  :value="incomingName || getModelName(data?.name, data?.accName)"
                  @input="incomingName = $event.target.value"
                  class="leading-none w-[100%] text-[26px] font-semibold text-black border border-[2px] border-primary px-1 rounded-[5px]"
                />
                <br />
                <div class="text-right mt-1">
                  <Button
                    :disabled="!isProjectAdmin && !isBimarAdmin"
                    @click="handleRename_cancel"
                    class="border border-secondary rounded-[6px] w-fit h-fit p-1"
                    ><X size="24" class="text-secondary" color="red"
                  /></Button>
                  <Button
                    :disabled="!isProjectAdmin && !isBimarAdmin"
                    @click="handleRename_submit(data?.id)"
                    class="border border-secondary rounded-[6px] w-fit h-fit p-1"
                    ><Check size="24" class="text-secondary" color="green"
                  /></Button>
                </div>
              </div>
              <!-- Action Buttons -->
              <div class="my-5 grid grid-cols-10 gap-4">
                <Button
                  @click="handleDownloadBimModel(data?.accName, data?.id)"
                  class="col-span-4 border border-secondary px-0"
                  ><Download size="18" class="text-secondary mr-1" />DOWNLOAD BIM</Button
                >
                <Button
                  :disabled="!isProjectAdmin && !isBimarAdmin"
                  @click="handleUploadProcessedModel(data.id)"
                  class="col-span-6 border border-secondary px-0"
                  ><CloudUpload size="18" class="text-secondary mr-1" />
                  <input
                    type="file"
                    :id="data?.id"
                    @change="handleFileChange(data?.accName, data?.id)"
                    style="display: none"
                    webkitdirectory
                    multiple
                  />
                  UPLOAD PROCESSED MODEL</Button
                >
              </div>
              <!-- Details -->
              <Table>
                <TableRow>
                  <TableCell class="text-left text-secondary">Project</TableCell>
                  <TableCell class="text-right text-primary">{{ data?.project?.name }}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="text-left text-secondary">Status</TableCell>
                  <TableCell class="float-right text-primary"
                    ><ModelStatus :status="data?.status"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="text-left text-secondary">AR Capture</TableCell>
                  <TableCell class="text-right text-primary">{{ 0 }}</TableCell>
                </TableRow>
                <div class="h-[50px]"></div>
                <TableRow>
                  <TableCell class="text-left text-secondary">Version</TableCell>
                  <TableCell class="text-right text-primary">{{ 'V1' }}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="text-left text-secondary">Source</TableCell>
                  <TableCell class="text-right text-primary">{{ data?.source }}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="text-left text-secondary">Account</TableCell>
                  <TableCell class="text-right text-primary">{{ data?.account?.name }}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="text-left text-secondary">Project</TableCell>
                  <TableCell class="text-right text-primary">{{ data?.accProject }}</TableCell>
                </TableRow>
              </Table>
              <!-- Small Details -->
              <div class="mt-10">
                <CalendarDays size="24" class="text-secondary float-left" />
                <Text class="text-secondary ml-1"
                  >Added: {{ formatTimeStamp(data?.createdAt?._seconds) }}</Text
                >
                <span class="opacity-20 mx-2">|</span>
                <Text class="text-secondary"
                  >Processed: {{ formatTimeStamp(data?.processedAt?._seconds) }}</Text
                >
              </div>
              <div class="mt-5">
                <UserRound size="24" class="text-secondary float-left" />
                <Text class="text-secondary ml-1">
                  Created by:
                  {{ getUserDisplayName(data?.user?.firstName, data?.user?.lastName) }}</Text
                >
              </div>
            </div>
            <!-- Sidebar Footer -->
            <div class="px-10 my-[1rem] px-1.5rem">
              <div class="flex flex-col items-start">
                <Button
                  :disabled="!isProjectAdmin && !isBimarAdmin"
                  variant="ghost"
                  class="mx-0 px-0"
                  @click="handleDelete(data?.name || data?.accName, data?.id)"
                >
                  <Trash2 size="24" class="text-destructive" />
                  <Text class="text-primary-red ml-1"> DELETE MODEL </Text>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Transition>
  <!-- </Teleport> -->
</template>
