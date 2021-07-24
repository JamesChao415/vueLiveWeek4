import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from '../component/pagination.js';
let productModal = {};
let delProductModal = {};
const app = createApp({
  components:{
    pagination,
  },
  data(){
    return{
      apiUrl: 'https://vue3-course-api.hexschool.io',
      apiPath: 'james23',
      products: [],
      isNew: false,
      tempProduct:{
        imagesUrl: [],
      },
      pagination:{},
    };
  },
  mounted(){

    //取的BS modal 實體
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    //取得token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if(token === ''){
      alert('您尚未登入請重新登入');
      window.location = 'login.html';
    }
    //存入token 到 cookie裡面
    axios.defaults.headers.common['Authorization'] = token;
    
    this.getProducts();
  },
  methods:{
    //取得產品資料
    getProducts(page=1){
      const url = `${ this.apiUrl }/api/${ this.apiPath }/admin/products?page=${ page }`;
      axios.get(url)
        .then((res) => {
          if(res.data.success){
            console.log(res);
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }else{
            alert(res.data.messages);
          }         
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //新增編輯產品
    updateProduct(tempProduct){
      console.log('123');
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = 'post';
      
      if(!this.isNew){
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${tempProduct.id}`;
        method = 'put';
      }

      axios[method](url,{data: tempProduct})
        .then((res) => {
          console.log(res);
          if(res.data.success){
            alert(res.data.message);
            productModal.hide();
            this.getProducts();
          }

        }).catch((err) => {
          console.log(err);
        })
    },
    //判斷開啟新增編輯刪除 openModal
    openModal(isNew, item){
      if(isNew === 'new'){
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      }else if(isNew === 'edit'){
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
        
      }else if(isNew === 'delete'){
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    //刪除產品
    delProduct(){
      const url = `${ this.apiUrl }/api/${ this.apiPath }/admin/product/${ this.tempProduct.id }`;
      axios.delete(url)
      .then((res) => {
        if(res.data.success){
          alert(res.data.message);
          delProductModal.hide();
          this.getProducts();
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
    // 新增多個圖片 
    // createImages() {
    //   this.tempProduct.imagesUrl = [];
    //   this.tempProduct.imagesUrl.push('');
    // }
  }
});

app.component('productModal',{
  props:['tempProduct'],
  template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
      aria-hidden="true">
    <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span v-if="isNew">新增產品</span>
          <span v-else>編輯產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-1">
              <div class="form-group">
                <label for="imageUrl">輸入圖片網址</label>
                <input type="text" v-model="tempProduct.imageUrl" class="form-control"
                        placeholder="請輸入圖片連結">
              </div>
              <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
            </div>
            <div>
              <button class="btn btn-outline-primary btn-sm d-block w-100" @click="createImages">
                新增圖片
              </button>
            </div>
            <div v-else>
              <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                刪除圖片
              </button>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input id="title" type="text" v-model="tempProduct.title" class="form-control" placeholder="請輸入標題">
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input id="category" type="text" v-model="tempProduct.category" class="form-control"
                        placeholder="請輸入分類">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input id="unit" type="text" v-model="tempProduct.unit" class="form-control" placeholder="請輸入單位">
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <input id="origin_price" type="number" v-model.number="tempProduct.origin_price" min="0" class="form-control" placeholder="請輸入原價">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input id="price" type="number" v-model.number="tempProduct.price" min="0" class="form-control"
                        placeholder="請輸入售價">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea id="description" type="text" class="form-control" v-model="tempProduct.description"
                        placeholder="請輸入產品描述">
              </textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea id="description" type="text" class="form-control" v-model="tempProduct.content"
                        placeholder="請輸入說明內容">
              </textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input id="is_enabled" class="form-check-input" type="checkbox" v-model="tempProduct.is_enabled"
                        :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="$emit('update-product',tempProduct)">
          確認
        </button>
      </div>
    </div>
    </div>
    </div>
    <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
      aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 id="delProductModalLabel" class="modal-title">
          <span>刪除產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        是否刪除
        <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-danger" @click="$emit('del-product')">
          確認刪除
        </button>
      </div>
    </div>
    </div>
    </div>`,
  methods:{
    // 新增多個圖片 
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
});

// app.component('pagination',{
//   props:['page'],
//   template: `
//     <nav aria-label="Page navigation example">
//     <ul class="pagination">
//       <li class="page-item" :class="{ disabled: !page.has_pre }">
//         <a class="page-link" href="#" aria-label="Previous"
//           @click="$emit('get-product',page.current_page -1)">
//           <span aria-hidden="true">&laquo;</span>
//         </a>
//       </li>
//       <li class="page-item" v-for="item in page.total_pages" 
//         :key="item" :class= "{'active': item == page.current_page }">
//         <a class="page-link" href="#" @click="$emit('get-product',item)">{{ item }}</a>
//       </li>
//       <li class="page-item" :class="{ disabled: !page.has_next }">
//         <a class="page-link" href="#" aria-label="Next"
//           @click="$emit('get-product',page.current_page +1)">
//           <span aria-hidden="true">&raquo;</span>
//         </a>
//       </li>
//     </ul>
//   </nav>`,

// })

app.mount('#app');