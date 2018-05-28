<template>
  <el-dialog  :title=" '详情'" :close-on-click-modal="false" :visible.sync="visible" >
    <span v-html="dataForm.content"></span>
  </el-dialog>
</template>

<script>
import API from '@/api'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        content: ''
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          API.knowledgeContent.info(this.dataForm.id).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.content = data.knowledgeContent.content
            }
          })
        }
      })
    }
  }
}
</script>