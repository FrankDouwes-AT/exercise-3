<template>
  <div class="container">
    <div class="avrotros">
      <p v-for="(word, wordIndex) in CONFIG" :key="`word_${wordIndex}`" class="word">
        <span v-for="(letter, letterIndex) in word"
              :key="`letter_${(wordIndex * chunkSize) + letterIndex}`"
              :class="dynamicClasses(wordIndex, letterIndex)"
              :style="letter.style"
              class="letter"
        >
          {{letter.content}}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

/*
  I wrote this without internal state, by directly referencing the store,
  probably not how I'd prefer to do it, but considering this component doesn't
  need additional state it's ok.
 */
import {useAvroTrosStore} from "~/store/avrotros";
import {CONFIG} from "./constants"

const avrotrosStore = useAvroTrosStore()
const chunkSize = 4;

const getLetterSize = (word: number, letter: number) => {
  return avrotrosStore.$state.array[(word * chunkSize) + letter]
}

const dynamicClasses = (wordIndex: number, letterIndex: number) => {

  const _letterSize = getLetterSize(wordIndex, letterIndex)
  let _classes = `letter--size-${(_letterSize)} `

  if (avrotrosStore.$state.values) {

    const _index = avrotrosStore.$state.values.indexOf(_letterSize)

    // attempt some styling variations based on the result / distance
    _classes += (_index === -1) ? `letter--tint-8` : `letter--tint-${_index}`
  }
  return _classes
}

</script>

<style lang="scss" scoped>

.container {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.avrotros {

  @include heading();

  display: flex;
  flex-direction: column;
  align-items: center;

  line-height: 0.8;
}

.word {

  display: block;
  margin: 0 2px 0 0;

  /* AVRO */
  &:first-child {

    > span {
      vertical-align: baseline;
    }
  }

  /* TROS */
  &:last-child {

    // since vertical-align: top (ot text-top) didn't give the expected result I'm using transforms here.
    transform: scaleY(-1);
    transition-delay: 125ms;

    > span {
      vertical-align: baseline;
      transform: scaleY(-1);
    }
  }
}

.letter {

  display: inline-block;

  transition: all 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: hsl(var(--color-cyan));

  /*
    showing some scss tricks:
    for loops, to generate the needed classes,
    yes you could do this with css vars (less css code)
  */
  @for $i from 0 through 10 {
    &--size-#{$i} {
      font-size: 32px + (8px * $i);
    }
  }

  @for $i from 0 through 8 {
    &--tint-#{$i} {
      filter: brightness(1 + ($i * 0.05));
    }
  }
}

</style>