<template>
  <div class="card flex justify-content-center">
    <Dialog v-model:visible="visible" modal :style="{ width: width}" :draggable="false"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :closable="false"
            class="bg-white rounded-lg border border-black">
      <div class=" flex items-center justify-center mb-5 mt-3">
        <h1 class="text-[1.4em] font-bold text-primary-300 text-center  md:leading-[60px]">
          {{ title ? title : '' }}</h1>
      </div>
      <slot name="contenido">
        <div class="text-center">
          <p class="text-[#637381] font-semibold">Fecha: {{ $moment(data.fecha_solicitud).format('DD/MM/YYYY') }}</p>
        </div>
        <div class="text-left px-14 space-y-3">
          <p class="text-[#637381] font-bold">Empleado: {{ data.empleado?.nombre_completo }}</p>
          <p class="text-[#637381] text-xs">Inicio de incapacidad</p>
          <Input type="date" class="w-[60%]" v-model="data.fecha_inicio" :disabled="!isStoring"></Input>
          <p class="text-[#637381] text-xs">Fin de incapacidad</p>
          <Input type="date" class="w-[60%]" v-model="data.fecha_fin" :disabled="!isStoring"></Input>
          <p class="text-[#637381] text-xs">Detalle de incapacidad</p>
          <textarea class="w-[90%]" v-model="data.detalle" :disabled="!isStoring && !isEditing"></textarea>
          <p class="text-[#637381] text-xs">Comprobante</p>
          <input v-if="isStoring || isEditing" type="file" class="w-[90%]" ref="fileInput">
          <p v-if="data.comprobante" class="text-blue-950 font-bold cursor-pointer">Ver comprobante</p>
          <p v-if="!data.comprobante && !isStoring" class="text-gray-600 font-bold">No existe un comprobante</p>
        </div>
      </slot>
      <div class="flex justify-center items-center space-x-0 lg:space-x-5 flex-col lg:flex-row mt-8 mb-3">
        <slot name="footer">
          <button v-if="isStoring" class="border bg-[#3056D3] text-white px-20 py-2 rounded mb-5"
                  @click="solicitarIncapacidad">Solicitar
          </button>
          <button v-if="isEditing" class="border bg-[#3056D3] text-white px-20 py-2 rounded mb-5"
                  @click="editarIncapacidad">Editar
          </button>
          <button class="border bg-white px-20 py-2 rounded mb-5" @click="$emit('close')">Cerrar</button>
        </slot>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import Dialog from 'primevue/dialog'
import { Input } from 'flowbite-vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const visible = ref(false)
const emit = defineEmits(['crearIncapacidad'])

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '60rem'
  },
  show: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: {},
    required: false
  },
  isGerente: {
    type: Boolean,
    default: false
  },
  isStoring: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  visible.value = props.show
})

const fechaInicioInput = ref(null)
const fechaFinInput = ref(null)
const detalleInput = ref(null)
const fileInput = ref(null)

const solicitarIncapacidad = () => {
  const formData = new FormData()
  formData.append('fecha_inicio', props.data.fecha_inicio)
  formData.append('fecha_fin', props.data.fecha_fin)
  formData.append('detalle', props.data.detalle)
  if (fileInput.value && fileInput.value.files[0]) {
    formData.append('comprobante', fileInput.value.files[0])
  }

  axios.post('api/incapacidades', formData)
    .then(response => {
      console.log(response.data)
      emit('crearIncapacidad')
      toast.success('La operación se realizó con éxito.')
    })
    .catch(error => {
      console.error(error)
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        for (const field in errors) {
          if (errors.hasOwnProperty(field)) {
            toast.error(`${errors[field]}`)
          }
        }
      } else {
        toast.error('Ocurrió un error durante la operación.')
      }
    })
}

const editarIncapacidad = () => {
  const detalle = props.data.detalle || '' // Si detalle es undefined o null, se establece en una cadena vacía

  axios.put(`api/incapacidades/${props.data.id}`, { detalle: detalle })
    .then(response => {
      console.log(response.data)
      emit('crearIncapacidad')
      toast.success('La operación se realizó con éxito.')
    })
    .catch(error => {
      console.error(error)
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        for (const field in errors) {
          if (errors.hasOwnProperty(field)) {
            toast.error(`${errors[field]}`)
          }
        }
      } else {
        toast.error('Ocurrió un error durante la operación.')
      }
    })
}
</script>

<style>
.p-dialog-mask {
  background-color: rgba(0, 0, 0, 0.5) !important; /* Ajusta el último valor para cambiar la transparencia */
}

#modal-content .p-datepicker {
  top: 0px !important;
  left: 7% !important;
}

.p-overflow-hidden {
  overflow: hidden !important;
}

@media screen and (max-width: 450px) {
  #modal-content .p-datepicker {
    top: 0px !important;
    left: 0px !important;
  }
}
</style>