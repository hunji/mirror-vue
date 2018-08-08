<template>
    <div >
      <div style="display:table;margin:20px auto">
        <el-form :inline="true" :model="dataForm" >
            <el-form-item>
               <img style="width:80%" src="~@/assets/img/title.png">
            </el-form-item>
            <el-form-item style="margin-top:20px;">
                <el-select style="width:500px;" v-model="dataForm.key" filterable remote reserve-keyword allow-create default-first-option
                placeholder="关键字" clearable :remote-method="remoteMethod" :loading="loading" @change="getDataListForButton()">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  style="margin-top:20px;">
                <el-button @click="getDataListForButton()">查询</el-button>
            </el-form-item>
        </el-form>
        <transition :name="transition">
          <div class="news-list">
            <transition-group tag="ul" name="item">
              <div v-for="item in dataList" :key="item.id" :item="item" class="item-view" v-if="item">
                <div class="news-item">
                    <span class="score">{{ item.likeNum }}</span>
                    <div class="title">
                        <a @click="detailHandle(item.id)">{{ item.title }}</a>
                        <span class="host">({{ item.userName }})</span>
                    </div>
                    <div>
                        <a @click="detailHandle(item.id)">{{ item.brief }}</a>
                    </div>
                    <span class="meta">
                        <span class="time">
                            {{ item.reviewDate }} 发布
                        </span>
                    </span> 
                </div>
              </div>
            </transition-group>
          </div>
        </transition>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <detail-show v-if="detailVisible" ref="DetailShow" @refreshDataList="getDataList"></detail-show>
    </div>
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
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      detailVisible: false,
      options: [],
      loading: false,
      transition: 'slide-right'
    }
  },
  components: {
    AddOrUpdate,
    DetailShow
  },
  mounted () {
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
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.DetailShow.init(id)
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

<style>
.news-list{
    background-color:#fff;
    border-radius: 2px;
    position: absolute;
    margin: 30px 0;
    transition: all .5s cubic-bezier(.55,0,.1,1);
}
.news-list ul{
    list-style-type: none;
    padding: 0;
    margin: 0;
}
.news-item{
    background-color: #fff;
    padding: 10px 30px 10px 80px;
    border-bottom: 1px solid #eee;
    position: relative;
    line-height: 20px;
    min-width: 700px;
}
.score{
    color:#ff6600;
    font-size: 1.1em;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 0;
    width: 80px;
    text-align: center;
    margin-top: -10px;
}
.meta{
    font-size: .85em;
    color: #828282;
}
.host{
    font-size: .85em;
    color: #828282;
}
.news-item a{
    cursor: pointer;
}
</style>
