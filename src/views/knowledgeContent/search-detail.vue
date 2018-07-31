<template>
  <el-dialog width="70%" :title=" '内容详情'" :close-on-click-modal="false" :visible.sync="visible" >
    <div style="display:table;margin:0 auto;width:85%">
      <div ><h2>{{dataForm.title}}</h2></div>
      <div class="meta">
        <span>类型：{{ dataForm.typeId}} |</span>
        <span>创建时间 {{ dataForm.createDate | formatDate}}</span>
        <span>发布时间 {{ dataForm.reviewDate | formatDate}}</span>
        <span style="margin-left:300px;">点赞数 {{ dataForm.likeNum }}</span>
        <a style="margin-left:20px;"  href="#" @click="open(dataForm.id)"><icon-svg name="dianzan"></icon-svg></a>
      </div>
      <div class="content">  简要描述：{{ dataForm.brief }} </div>
      <span v-html="dataForm.content"></span>
    </div>
  </el-dialog>
</template>

<script>
import API from '@/api'
import { formatDate } from '@/utils/validate'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        content: '',
        title: '',
        typeId: '',
        createDate: '',
        reviewDate: '',
        state: '',
        brief: ''
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          API.knowledgeContent.searchDetail(this.dataForm.id).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.knowledgeContent
            }
          })
        }
      })
    },
    open (id) {
      API.knowledgeContent.addLikeSum(id).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '点赞成功',
            type: 'success',
            duration: 1000
          })
          this.init(id)
        }
      })
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  }
}
</script>

<style>
.meta{
  margin: -5px 5px 20px 10px;
  font-size: .85em;
  color: #828282;
}
.content{
  margin: 10px;
}
</style>
