<template>
    <div class="el-card__body">
        <el-form :inline="true" :model="dataForm">
            <el-form-item>
                <el-select v-model="dataForm.key" filterable remote reserve-keyword allow-create default-first-option
                placeholder="关键字" clearable :remote-method="remoteMethod" :loading="loading">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataListForButton()">查询</el-button>
            </el-form-item>
            <el-form-item>
                <a href="http://localhost:8001/#/knowledgeUserSearch" target="_blank">更多</a>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" v-loading="dataListLoading" style="width: 100%;" height="300">
            <el-table-column prop="typeName" header-align="center" align="center" width="80"  label="类型"></el-table-column>
            <el-table-column prop="title" header-align="center" align="center"   label="标题" @click="detailHandle(scope.row.id)">
              <template slot-scope="scope">
                <a href="#" @click="detailHandle(scope.row.id)">{{ scope.row.title }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="brief" header-align="center" align="center"   label="简要描述">
                <template slot-scope="scope">
                <a href="#" @click="detailHandle(scope.row.id)">{{ scope.row.brief }}</a>
              </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <span v-html="detailInfo"></span>
    <detail-show v-if="detailVisible" ref="DetailShow" @refreshDataList="getDataList"></detail-show>
    </div>
</template>

<script>
import API from '@/api'
import AddOrUpdate from './add-or-update'
import DetailShow from './search-detail'
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
      detailVisible: false,
      detailInfo: '',
      options: [],
      loading: false
    }
  },
  components: {
    AddOrUpdate,
    DetailShow
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
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 详情
    detailHandle (id) {
      API.knowledgeContent.searchDetail(id).then(({ data }) => {
        if (data && data.code === 0) {
          this.detailInfo = data.knowledgeContent.content
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

