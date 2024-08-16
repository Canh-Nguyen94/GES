<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@common/ui/accordion'
import Icon from '@components/Icon.vue'
import { navHeaderItems } from '@constants/landing'

const { t } = useI18n()
</script>

<template>
  <div class="pt-3 px-[70px]">
    <h2 class="text-center leading-8">
      Frequently Asked Questions <br />
      Common questions you be asking about VERTEX.
    </h2>
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent> Yes. It adheres to the WAI-ARIA design pattern. </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent> Yes. It adheres to the WAI-ARIA design pattern. </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style scoped>
.bg {
  background: #0f2027;
  background: -webkit-linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
}
</style>
