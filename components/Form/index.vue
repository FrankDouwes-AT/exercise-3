<template>
  <div class="container">
    <form ref="formRef" method="post" @change="onFormChange" @input="onFormChange">

      <div class="form-element">
        <label for="presets">Presets:</label>
        <select ref="presetsRef" id="presets" :disabled="state.cycling">
          <option v-for="(option, index) in PRESETS" :key="`option_${index}`" :value="option.value">{{option.label}}</option>
        </select>
      </div>

      <div class="form-element">
        <label for="custom">Custom:</label>
        <input ref="customRef"
               name="custom"
               id="custom"
               type="text"
               pattern="^[0-9]{8}$"
               placeholder="Provide a size for each letter"
               maxlength="8"
               minlength="8"
               :disabled="!state.customInputVisible"
               :required="state.customInputVisible" >
      </div>

      <div class="form-element">
        <label for="needle">Needle:</label>
        <input ref="needleRef"
               name="needle"
               id="needle"
               type="number"
               value=3
               placeholder="Needle"
               maxlength="1"
               minlength="1"
               :disabled="state.cycling"
               required >
      </div>

      <div class="form-element">
        <label for="number">Number:</label>
        <input ref="numberRef"
               name="number"
               id="number"
               type="number"
               value=4
               placeholder="Number"
               maxlength="1"
               minlength="1"
               :disabled="state.cycling"
               required >
      </div>

      <div class="actions">
        <button aria-label="submit" lass="actions__button actions__button--primary" type="button" @click.prevent="onFormSubmit" :disabled="state.loading || state.cycling">Submit</button>
        <button aria-label="cycle" ref="cycleBtnRef" class="actions__button actions__button--secondary" type="button" @click.prevent="onFormCycle">
          {{(state.cycling) ? "Stop cycle" : "Start cycle"}}
        </button>
      </div>

      <p v-if="state.error" class="error">{{state.error.message}}</p>

    </form>
  </div>
</template>

<script setup lang="ts">

/*
  Admittedly this component got large, but given the time constraint, and the fact I'n om holiday,
  this will have to do, yes you could split this up and use Emit to bubble events
  the action buttons could/should be their own component, and possibly form elements.
 */
import type {TState} from "~/components/Form/types";
import { NuxtApi } from "~/services/nuxt-api";
import type {TClosestValuesParams} from "~/utils/find-closest-values/types";
import {useAvroTrosStore} from "~/store/avrotros";
import {PRESETS} from "~/components/Form/constants";

const formRef = ref<HTMLFormElement>()
const customRef = ref<HTMLInputElement>()
const needleRef = ref<HTMLInputElement>()
const numberRef = ref<HTMLInputElement>()
const presetsRef = ref<HTMLSelectElement>()
const cycleBtnRef = ref<HTMLButtonElement>()

const cycleInterval = ref<any | undefined>()

const avrotrosStore = useAvroTrosStore()

/*
At some point I decided to start using ref() for template references, and reactive() for component state,
there are multiple ways to do state in nuxt3, but this a good pattern to differentiate between
component state and other/template related state (which are generally refs).
*/
const state: TState = reactive({
  loading: false,
  error: null,
  customInputVisible: false,
  cycling: false,
  cycleCount: 0
})

/*
  I should probably move these _ functions to composables, but given this 'app' is so small, there's
  really no reason to do so, and spend more time refactoring (I'm on holiday!)
*/
const _stringToNumbersArray = (string?: string): Array<number> => {
  return (string || '').split('').map((x) => parseInt(x))
}

const _getArrayValues = (): Array<number> => {
  return (state.customInputVisible)
      ? _stringToNumbersArray(customRef.value?.value)
      : _stringToNumbersArray(presetsRef.value?.value)
}

const _getFormValues = (): TClosestValuesParams => {

  return {
      array: _getArrayValues(),
      /* to be honest, this is where I disagree with the TS compiler, it becomes 'extra work' instead of a helper
         the input is required, therefor the value is a string, there's nothing gained by extra checks here.
         console.log(typeof _formData.get('needle'))
         console.log(typeof _formData.get('number'))
      */
      needle: parseInt(needleRef.value?.value),
      number: parseInt(numberRef.value?.value),
  }
}

const onFormChange = async () => {

  state.loading = false
  state.error = undefined

  const _customInputVisible = (presetsRef.value?.value === 'custom')

  if (_customInputVisible && ! state.customInputVisible) {
    window.requestAnimationFrame(() => {
      if (customRef.value) {
        customRef.value.focus();
      }
    })
  }
  state.customInputVisible = (presetsRef.value?.value === 'custom')
}

// cycle through all available presets (playing an animation)
const onFormCycle = async () => {

    if (cycleInterval.value) {

      window.clearInterval(cycleInterval.value)
      cycleInterval.value = undefined
      state.cycling = false

    } else {

      state.cycling = true

      cycleInterval.value = setInterval(() => {

        state.cycleCount = (state.cycleCount < PRESETS.length - 2) ? state.cycleCount + 1 : 0

        if (presetsRef.value) {
          presetsRef.value.selectedIndex = state.cycleCount

          // this triggers a form change event, which by default it will not.
          presetsRef.value.dispatchEvent(new Event('change', { bubbles: true }));

          onFormSubmit()
        }

      }, 800)
  }
}

const onFormSubmit = async () => {

  if (formRef.value && !state.loading) {

    state.loading = true

    const _inputData: TClosestValuesParams = _getFormValues()

    avrotrosStore.setArray(_inputData.array)

    const {data, error} = await NuxtApi.getClosestValues(_inputData)

    avrotrosStore.setValues(data.value)

    state.error = error.value
    state.loading = false
  }
}

</script>

<style lang="scss" scoped>

  .container {

    width: calc(100% - 16px);
    max-width: 600px;

    background-color: hsla(var(--color-dark-blue), 0.05);
    backdrop-filter: blur(0.75rem);
    box-shadow: hsla(var(--color-cyan), 0.15) 0 7px 29px 0;

    border: 8px solid hsla(var(--color-cyan), 0.25);
    border-radius: 1rem;

    margin: 0 auto;
    margin-bottom: 40px;

    padding: 1.5rem 2rem;

    @media only screen and (min-width: 512px) {
      padding: 3rem 4rem;
    }

    color: #fff;

    .form-element {

      margin-bottom: 24px;

      > label {

        @include label;

        display: block;

        padding-bottom: 8px;

        font-size: 12px;
        letter-spacing: 1px;
      }
    }
  }

  input, label, select, button {

    @include label;

    letter-spacing: 1.5px;
    font-size: 16px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  input {

    background-color: transparent;
    color: white;

    border: 2px solid hsl(var(--color-cyan));

    transition: border 250ms ease;

    &::placeholder {
      color: rgba(255,255,255,0.5)
    }

    &:invalid {
      border-color: hsl(var(--color-red));
    }

    &:focus {
      border-color: hsl(var(--color-purple));
    }

    &:disabled {
      background-color: hsla(var(--color-cyan), 0.2);
    }
  }

  select {

    background-color: hsla(var(--color-dark-blue), 0.05);
    color: white;

    border: 2px solid hsl(var(--color-cyan));
    border-radius: 1rem;

    padding: 16px 24px;

    -moz-appearance:none; /* Firefox */
    -webkit-appearance:none; /* Safari and Chrome */
    appearance:none;

    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiNiYmIiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==);
    background-repeat: no-repeat;
    background-position-x: calc(100% - 18px);
    background-position-y: 50%;

    &:disabled {

      background-color: hsla(var(--color-cyan), 0.2);
    }
  }

  .actions {

    display: flex;
    flex-direction: column;

    @media only screen and (min-width: 512px) {
      flex-direction: row;
      justify-content: space-between;
    }


    &__button {

      @media only screen and (min-width: 512px) {
        width: calc(50% - 10px);
      }

      margin-bottom: 16px;
      padding: 16px 24px;

      border-radius: 1rem;

      &--primary {
        background-color: hsl(var(--color-cyan));
      }

      &--secondary {
        background-color: hsl(var(--color-purple));
      }
    }
  }

  .error {

    @include label;
    font-size: 12px;
    color: hsl(var(--color-red))
  }

</style>