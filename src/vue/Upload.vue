<template>
  <div id="app">
    <file-pond
      name="filePondArea"
      ref="pond"
      label-idle="Drop files here..."
      allow-multiple="true"
      :server="server"
      :files="myFiles"
      v-on:init="handleFilePondInit"
    />
  </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond from "vue-filepond";
import * as qiniu from "qiniu-js";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export default {
  name: "app",
  data: function() {
    return {
      myFiles: [],
      server: {
        process: async (
          fieldName,
          file,
          metadata,
          load,
          error,
          progress,
          abort
        ) => {
          console.log(file);
          var QJ = await this.$AV.Cloud.run("getQiniuJSON", {
            fileNameArr: [file.name]
          });

          console.log(QJ);

          var observer = {
            next(res) {
              var e = res.total;
              console.log(e);
              progress(true, e.loaded, e.size);
            },
            error(err) {
              console.error(err);
              error(err);
            },
            complete(res) {
              console.log(res);
              load(res); //完成后，应该用文件对象或blob调用load方法 load方法接受字符串(id)或对象
            }
          };

          var putExtra = {
            fname: "", //fname: string，文件原文件名
            params: {}, //params: object，用来放置自定义变量
            mimeType: null //mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里：["image/png", "image/jpeg", "image/gif"]
          };

          var config = {
            // useCdnDomain: true,//表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。（感觉开启了之后，上传的速度更慢了）
            concurrentRequestLimit: 9 //分片上传的并发请求量，number，默认为3；因为浏览器本身也会限制最大并发量，所以最大并发量与浏览器有关。
          };

          var observable = qiniu.upload(
            file,
            QJ[0].key,
            QJ[0].token,
            putExtra,
            config
          );
          var subscription = observable.subscribe(observer); // 上传开始
          // or
          //   var subscription = observable.subscribe(next, error, complete); // 这样传参形式也可以

          return {
            abort: () => {
              // 如果用户点击了取消按钮，则进入该功能
              subscription.unsubscribe(); // 上传取消

              //让filepond知道请求已被取消
              abort();
            }
          };
        }
      }
    };
  },
  methods: {
    handleFilePondInit: function() {
      console.log("FilePond has initialized");
      // FilePond instance methods are available on `this.$refs.pond`
    }
  },
  components: {
    FilePond
  }
};
</script>