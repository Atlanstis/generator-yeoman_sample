<template>
  <div class="home">
    <child :val="val"></child>
    <button @click="change">change</button>
  </div>
</template>

<script>
import Child from '@/components/child'
import { ref } from 'vue'

export default {
  name: 'Home',
  components: {
    Child,
  },

  setup() {
    const val = ref(0)

    return {
      val,
    }
  },

  methods: {
    change() {
      this.val = Math.floor(Math.random() * 1000)
    },
  },
}
</script>
