
<template>
    <div>
      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column type="index" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="typeName" header-align="center" align="center"  label="类型"></el-table-column>
        <el-table-column prop="title" header-align="center" align="center"  label="标题"></el-table-column>
        <el-table-column prop="brief" header-align="center" align="center"  label="简要描述"></el-table-column>
        <el-table-column prop="userName" header-align="center" align="center"  label="提交人"></el-table-column>
        <el-table-column prop="createDate" header-align="center" align="center"  label="创建时间"></el-table-column>
        <el-table-column prop="rank" header-align="center" align="center"  label="重要程度"></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center"  label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="detailHandle(scope.row.id)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <detail v-if="detailVisible" ref="detail"  @refreshDataList="getDataList"></detail>
    </div>
</template>

<script>
import API from '@/api'
import detail from './detail'
export default {
  data () {
    return {
      dataForm: {
        typeName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      detailVisible: false
    }
  },
  components: {
    detail
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      var params = {
        page: this.pageIndex,
        limit: this.pageSize
      }
      API.knowledgeContent.common(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalPage
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
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
    // 新增和修改
    detailHandle (id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id)
      })
    }
  }
}
</script>
