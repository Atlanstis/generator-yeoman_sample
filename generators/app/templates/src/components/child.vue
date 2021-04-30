<template>
  <div class="child">
    <p>props: {{ val }}</p>
    <p>counter: {{ counter }}<button @click="counterAdd">counter ++</button></p>
    <p>double counter: {{ doubleCounter }}</p>
  </div>
</template>

<script>
import { ref, onMounted, watch, toRefs, computed } from 'vue'

export default {
  props: {
    val: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const counter = ref(0)
    const counterAdd = () => {
      counter.value++
    }
    watch(counter, (newVal, oldVal) => {
      console.log(`counter is changed from ${oldVal} to ${newVal}`)
    })
    onMounted(counterAdd)

    const doubleCounter = computed(() => {
      return counter.value * 2
    })

    const { val } = toRefs(props)

    watch(val, (newVal, oldVal) => {
      console.log(`props: val is changed from ${oldVal} to ${newVal}`)
    })

    return {
      counter,
      counterAdd,
      doubleCounter,
    }
  },
}
</script>

<style lang="scss" scoped></style>
