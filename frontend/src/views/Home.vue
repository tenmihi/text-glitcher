<template>
  <div class="home">
    <a href="/debug-shrine/us-central1/fetch_ogp">fetch_ogp</a><br>
    <a href="/debug-shrine/us-central1/generate_image">generate_image</a><br>
    <Editor></Editor>
  </div>
</template>

<script>
import Editor from '@/components/Editor.vue'

export default {
  components: {
    Editor
  }
}
</script>