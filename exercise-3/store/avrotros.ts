import {defineStore} from 'pinia'
import {DEFAULTS} from "~/store/constants";

type TStoreState = {
  array: Array<number>,
  values?: Array<number>
};


export const useAvroTrosStore = defineStore('avrotros', {

  state: (): TStoreState => {
    return {
      array: DEFAULTS,
      values: undefined,
    }
  },

  actions: {

    setArray(data?: Array<number>) {
      if (!data) {
        data = DEFAULTS
      }

      this.$state.array = data

      console.info(
        `✔ Store array changed to ${this.$state.array}`
      )
    },
    setValues(data?: Array<number>) {

      this.$state.values = data

      console.info(
        `✔ Store values changed to ${this.$state.values}`
      )
    }
  },
})