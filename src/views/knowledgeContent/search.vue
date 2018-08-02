<template>
    <div class="el-card__body">
        <el-form style="margin-left:40px;">
          <el-form-item>
               <img style="width:190px;margin-left:120px  " src="~@/assets/img/maintitle.png">
            </el-form-item>
        </el-form>
        <el-form :inline="true" :model="dataForm"  style="margin-left:40px;">
            <el-form-item>
                <el-select  style="width:400px;" v-model="dataForm.key" filterable remote reserve-keyword allow-create default-first-option
                placeholder="请输入关键字并选择" clearable :remote-method="remoteMethod" :loading="loading" automatic-dropdown>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataListForButton()">查询</el-button>
            </el-form-item>  
        </el-form>
        <div v-for="item in dataList" :key="item.id" :item="item" style="width: 100%;" height="300" v-if="item">
          <div style="margin:10px 40px">
            <a href="#" @click="detailHandle(item.id)">{{ item.title }}</a>
          </div>
        </div>
        <div style=" margin-left: 430px;line-height: 0;width: 66px;"><a style="color:#a5c145;" href="http://10.1.9.46:8088/#/knowledgeUserSearch" target="_blank">更多...</a></div>
        <br>
        <span v-html="detailInfo"></span>
    </div>
</template>

<script>
import API from '@/api'
import AddOrUpdate from './add-or-update'
export default {
  data () {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      detailInfo: '',
      options: [],
      loading: false
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        key: this.dataForm.key
      }
      API.knowledgeContent.search(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    getDataListForButton () {
      this.pageIndex = 1
      this.getDataList()
      this.detailInfo = ''
    },

    // 详情
    detailHandle (id) {
      API.knowledgeContent.searchDetail(id).then(({ data }) => {
        if (data && data.code === 0) {
          let showContent = ''
          if (data.knowledgeContent.brie !== null) {
            showContent += data.knowledgeContent.brief
          }
          if (data.knowledgeContent.content !== null) {
            showContent += data.knowledgeContent.content
          }
          this.detailInfo = showContent
        } else {
          this.detailInfo = ''
        }
      })
    },
    // 去后台查找title；列表
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
      }
      setTimeout(() => {
        this.loading = false
        this.options = API.knowledgeContent.titleForRemote(query).then(({ data }) => {
          if (data && data.code === 0) {
            this.options = data.titleList.map(item => {
              return {value: item, label: item}
            })
          } else {
            console.log(query)
            this.options = [query]
          }
        })
      }, 200)
    }
  }
}
</script>

