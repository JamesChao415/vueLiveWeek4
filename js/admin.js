import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
let productModal = {};
let delProductModal = {};
const app = createApp({
  data(){
    return{
      apiUrl: 'https://vue3-course-api.hexschool.io',
      apiPath: 'james23',
      products: [],
      isNew: false,
      tempProduct:{
        imagesUrl: [],
      },
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
    getProducts(){
      const url = `${ this.apiUrl }/api/${ this.apiPath }/admin/products`;
      axios.get(url)
        .then((res) => {
          if(res.data.success){
            console.log(res);
            this.products = res.data.products;
          }else{
            alert(res.data.messages);
          }         
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //新增編輯產品
    updateProduct(){
      console.log('123');
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = 'post';
      
      if(!this.isNew){
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }

      axios[method](url,{data: this.tempProduct})
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
      const url = `${ this.apiUrl }/api/${ this.apiPath }/admin/product/${ this.tempProduct.id}`;
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
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  }
});

app.mount('#app');