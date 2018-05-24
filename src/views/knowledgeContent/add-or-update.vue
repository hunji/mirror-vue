<template>
  <el-dialog  :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form class="rform" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="类型" prop="typeId">
        <el-input v-model="dataForm.typeId" placeholder="类型名称"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="简要描述" prop="brief">
        <el-input v-model="dataForm.brief" placeholder="简要描述"></el-input>
      </el-form-item>
      <el-form-item label="详情" prop="content">
        <!-- <el-input v-model="dataForm.content" placeholder="详情"></el-input> -->
        <quill-editor  class="quill-editor"
                        v-model="dataForm.content"
                        ref="QuillEditor">
        </quill-editor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import API from '@/api'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        typeId: 0,
        title: '',
        brief: '',
        content: ''
      },
      dataRule: {
        typeId: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          API.knowledgeContent.info(this.dataForm.id).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.typeId = data.knowledgeContent.typeId
              this.dataForm.title = data.knowledgeContent.title
              this.dataForm.brief = data.knowledgeContent.brief
              this.dataForm.content = data.knowledgeContent.content
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            'id': this.dataForm.id || undefined,
            'typeName': this.dataForm.typeName,
            'description': this.dataForm.description
          }
          var tick = !this.dataForm.id ? API.knowledgeType.add(params) : API.knowledgeType.update(params)
          tick.then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style>
.quill-editor {
  height: 345px;
}
</style>