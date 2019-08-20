<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('category.name')"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="$t('category.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="65"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.name')" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.fid')" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.fid }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.fname')" width="80px">
        <template slot-scope="scope">
          <span>{{ getFname(scope.row.fid) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.image')" width="120px" align="center">
        <template slot-scope="scope">
          <img style="width: 80px; height: 80px" :src="scope.row.icon" :fit="'contain'" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.no')" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.create_time')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.update_time')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{ $t('category.edit') }}</el-button>
          <el-button
            v-if="scope.row.status!='published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(scope.row,'published')"
          >{{ $t('category.publish') }}</el-button>
          <el-button
            v-if="scope.row.status!='hidden'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(scope.row,'hidden')"
          >{{ $t('category.hidden') }}</el-button>
          <el-button
            v-if="scope.row.status =='hidden'"
            size="mini"
            type="warning"
            @click="handleDelete(scope.row,'hidden')"
          >{{ $t('category.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      style="width: 100%;min-width:100%;"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('category.name')" prop="title">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('category.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('category.no')" prop="no">
          <el-input-number v-model="temp.no" />
        </el-form-item>
        <el-form-item :label="$t('category.fname')" prop="no">
          <el-select v-model="temp.fid" placeholder="无">
            <el-option v-for="item in fmap" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-upload
          ref="upload"
          action
          :http-request="fnUploadRequest"
          :show-file-list="true"
          :limit="1"
          :on-exceed="beyondFile"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">上传图片</el-button>
        </el-upload>
        <div>当前图片：{{temp.icon}}</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createCategory,
  updateCategory,
  deleteCategory,
  modifyStatus
} from "@/api/category";

import oss from "../../utils/aliOss";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { log } from "util";
import HashMap from "../../utils/HashMap";

export default {
  name: "CategoryList",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        hidden: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      fmap: [],
      listLoading: true,
      uploadUrl: "",
      listQuery: {
        name: undefined
      },
      deleteQuery: {
        id: undefined
      },
      importanceOptions: [1, 2],
      statusOptions: ["published", "hidden"],
      showReviewer: false,
      temp: {
        id: undefined,
        no: 1,
        fid: 0,
        name: "",
        status: "published",
        icon: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      pvData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 通过fid找fname
    getFname: function(fid) {
      if (!this.fmap) {
        return "";
      }
      // else {
      //   return this.fmap.get(fid);
      // }
      for (let i in this.fmap) {
        let obj = this.fmap[i];
        if (obj.id == fid) {
          return obj.name;
        }
      }
    },
    /**
     * @description [fnUploadRequest 覆盖默认的上传行为，实现自定义上传]
     * @param    {object}   option [上传选项]
     * @return   {null}   [没有返回]
     */
    async fnUploadRequest(option) {
      oss.ossUploadFile(option);
    },
    // 上传
    beforeUpload(file) {
      //todo
    },
    // 上传成功后
    handleSuccess(response, file, fileList) {
      //todo
      // var json = JSON.parse(response)
      // 上传png时会返回奇怪参数，影响请求
      var url = response.res.requestUrls[0];
      var index = url.indexOf("?");
      if (index > 0) {
        var iconUrl = url.substring(0, index);
      } else {
        var iconUrl = url;
      }
      this.temp.icon = iconUrl;
    },
    // 视频添加多个文件事件
    beyondFile(files, fileList) {
      //todo
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        let list = response.data.items;
        this.list = list;

        // 记录fid,用于后面找fname
        let defaultObj = {}
        defaultObj.id = 0
        defaultObj.name = "无"
        this.fmap.push(defaultObj);
        for (let i in list) {
          let obj = list[i];
          if (obj.fid == 0) {
            this.fmap.push(obj);
          }
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.getList();
    },
    handleModifyStatus(row, status) {
      var post_data = {};
      var id = row.id;
      post_data.id = id;
      post_data.status = status;
      this.listLoading = true;
      modifyStatus(post_data).then(res => {
        this.listLoading = false;
        if (res.data.success_code == 200) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
          row.status = status;
        } else {
          this.$notify({
            title: "失败",
            message: "删除失败",
            type: "info",
            duration: 2000
          });
        }
      });
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      // TODO 排序方式

      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        no: 1,
        fid: 0,
        name: "",
        status: "published",
        icon: "",
        url: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs["upload"].clearFiles();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          createCategory(this.temp).then(response => {
            if (response.data.success_code == 200) {
              this.temp.id = response.data.id;
              this.list.unshift(this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: "创建失败",
                type: "fail",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs["upload"].clearFiles();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateCategory(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },

    handleDelete(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var post_data = {};
          var id = row.id;
          post_data.id = id;
          deleteCategory(post_data).then(res => {
            if (res.data.success_code == 200) {
              this.$notify({
                title: "成功",
                message: res.data.message,
                type: "success",
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            } else {
              this.$notify({
                title: "失败",
                message: res.data.message,
                type: "info",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
