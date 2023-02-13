'use strict'; 

const qno_left = "t001";
const qno_right = "t002";
const qno_sum = "t003";

const qno_compare = 'a0031s00'
const qno_sum_compare1 = 'a0031s001t003'
const qno_sum_compare2 = 'a0031s002t003'

const obj = [];

//画面READYイベント
$(function() {

  errSetting();

  //自動０挿入イベント追加
  const cate_left = $("input[name$=" + qno_left + "]"); // a0031s001t001, a0031s002t001

  for(let i=0; i < cate_left.length; i++){
    cate_left[i].addEventListener('input',function(){
      autoChanged(this);
    });
  }

});

//自動０挿入
function autoChanged(obj){
  if(obj){
      if(obj.value != "0"){
          return false;
      }
      const obj_name = obj.name.substr(0,obj.name.indexOf("t")+1); // a○○○s○○○t
      const obj_right = $("input[type=text][name^=" + obj_name + "]")[1];  // [a0031s001t001, a0031s001t002, a0031s001t003]
      if(obj_right){
        obj_right.value = 0;
        obj_right.focus();    // keyup blur対応に必要(self.check)
        obj.focus();
      }
  }
}

//エラー設定
function errSetting(){

  const settings = {
    top:0,
    left:300,
    errormes:"5桁までの半角数字で入力してください。",
    errormes2:"この行の新患の患者数（【××】人/月）が、最近1か月間の患者数（【△△】人/月）を超えています。",
    errormes3:"最近1か月間の薬物療法実施患者数（【××】人/月） が、総診療患者数（【△△】人/月）を超えています。",
    errormes4:"新患の薬物療法実施患者数【××】人/月 が、総診療患者数（【△△】人/月）を超えています。",
    errormes5:"既存の薬物療法実施患者数が、既存の総診療患者数を超えています。",
    re_key:"^$|^[0-9]$|^[1-9][0-9]{1,4}$",
    re_out:"^[0-9]$|^[1-9][0-9]{1,4}$"
  };

  const max_cate_left = $("input[name$=" + qno_left + "]");     // [a0031s001t001, a0031s002t001]
  const max_cate_right = $("input[name$=" + qno_right + "]");   // [a0031s001t002, a0031s002t002]
  const max_cate_sum = $("input[name$=" + qno_sum + "]");       // [a0031s001t003, a0031s002t003]

  for(let i = 0; i < max_cate_left.length; i++){

    if(max_cate_left[i] && max_cate_right[i]){  // 数値チェック
        obj.push( new errorcheck(max_cate_left[i], settings, max_cate_right[i] ));
    }

    if(max_cate_right[i]){  // 数値チェック
        obj.push( new errorcheck(max_cate_right[i], settings, max_cate_right[i] ));
    }

    if(max_cate_left[i] && max_cate_right[i] && max_cate_sum[i]){ // 大小チェック
        obj.push( new errorcheck2(max_cate_left[i], settings, max_cate_right[i], max_cate_sum[i] ));
    }

    //disabled
    if(max_cate_sum[i]){
        max_cate_sum[i].disabled = true;
    }

  }
}


//数値チェック用
const errorcheck = function(){this.initialize.apply(this,arguments);}   // クラスのコンストラクタ

errorcheck.prototype = {
  initialize : function (elem, settings, elem2) {

    this.top = settings.top || 0;
    this.left = settings.left || 300;
    this.errormes = settings.errormes || "";
    this.re_key = settings.re_key || "";
    this.re_out = settings.re_out || "";

    this.elem = elem;
    this.elem2 = elem2;

    this.elemTop = $(this.elem).offset().top;
    this.elemLeft = $(this.elem2).offset().left;

    this.divobj = document.createElement("div");
    this.divobj.className = "error-mes";
    this.divobj.style.position = "absolute";
    this.divobj.style.display = "none";
    this.divobj.innerHTML = settings.errormes;
    document.getElementsByTagName("body")[0].appendChild(this.divobj);  
    // 末尾にノードを追加( <div class="error-mes" style="position: absolute; display: none;">5桁までの半角数字で入力してください。</div> )

    const self = this;

    self.elem.addEventListener('keyup',function(){
      self.check(settings.re_key);
    });

    self.elem.addEventListener('blur',function(){
      self.check(settings.re_out);
    });

    window.addEventListener('resize',function(){
      self.reposition();
    });

    if(self.elem.value != ""){
      self.check(settings.re_out);
    }
  },
  
  check:function(re){
    if(this.elem.value.match(re)){
      this.elem.style.backgroundColor = "#FFFFFF";
      this.elem.style.color = "#000000";
      this.divobj.style.display = "none";
    }else{
      this.elem.style.backgroundColor = "#FFCCCC";
      this.elem.style.color = "#FF0000";
      this.reposition();
      this.divobj.style.display = "block";
    }
  },
  
  reposition:function(){
    this.elemTop = $(this.elem).offset().top;
    this.elemLeft = $(this.elem2).offset().left;
    this.divobj.style.top = (this.elemTop + this.top) + "px";
    this.divobj.style.left = (this.elemLeft + this.left) +  "px";
  },

  errorMes:function(){
    const self = this;
    if(self.elem.value.match(self.re_out)){
      return true;
    }else{
      setTimeout(function(){
        alert(self.errormes);
      ;},20);
      return false;
    }
  }

};


//大小チェック用
const errorcheck2 = function(){this.initialize.apply(this,arguments);}

errorcheck2.prototype = {
  initialize : function (elem, settings, elem2, elem3) {

    this.top = settings.top || 0;
    this.left = settings.left || 300;
    this.errormes = settings.errormes || "";
    this.errormes2 = settings.errormes2 || "";
    this.errormes3 = settings.errormes3 || "";
    this.errormes4 = settings.errormes4 || "";
    this.errormes5 = settings.errormes5 || "";

    this.re_key = settings.re_key || "";
    this.re_out = settings.re_out || "";

    this.elem = elem;
    this.elem2 = elem2;
    this.elem3 = elem3;

    this.elemTop = $(this.elem).offset().top;
    this.elemLeft = $(this.elem2).offset().left;

    this.divobj = document.createElement("div");
    this.divobj.className = "error-mes";
    this.divobj.style.position = "absolute";
    this.divobj.style.display = "none";
    this.divobj.innerHTML = settings.errormes;
    document.getElementsByTagName("body")[0].appendChild(this.divobj);

    const self = this;

    self.elem.addEventListener('keyup',function(){
      self.check();
    });

    self.elem.addEventListener('blur', function(){
      self.check();
    });
    
    self.elem2.addEventListener('keyup',function(){
      self.check();
    });

    self.elem2.addEventListener('blur', function(){
      self.check();
    });

    window.addEventListener('resize',function(){
      self.reposition();
    });

    if(this.elem.value != "" && this.elem2.value != ""){
      self.check();
    }
  },

  check:function(){
    if(this.elem.value.match(this.re_out) && this.elem2.value.match(this.re_out)){  //数字かつ空文字でない

      let index = parseInt(this.elem.name.substr(8,1), 10); // [a0031s001t001, a0031s002t001]
      if(index == 2){
          index--;
      }else{
          index++;
      }

      const left_obj = $("input[name^=" + qno_compare + index + "]")[0];
      const right_obj = $("input[name^=" + qno_compare + index + "]")[1];

      let flg = false;

      if(parseInt(this.elem.value,10) < parseInt(this.elem2.value,10)){
        this.elem.style.backgroundColor = "#FFCCCC";
        this.elem.style.color = "#FF0000";
        this.elem2.style.backgroundColor = "#FFCCCC";
        this.elem2.style.color = "#FF0000";
        this.divobj.innerHTML = this.errormes2.replace(/【××】/g, this.elem2.value).replace(/【△△】/g, this.elem.value);
        this.reposition();
        this.divobj.style.display = "block";

        flg = true;

      } else {
        this.elem.style.backgroundColor = "#FFFFFF";
        this.elem.style.color = "#000000";
        this.elem2.style.backgroundColor = "#FFFFFF";
        this.elem2.style.color = "#000000";
        this.divobj.style.display = "none";
      }


      if(left_obj && right_obj){
        if(index == 1){
          if( parseInt(left_obj.value,10) < parseInt(this.elem.value,10) ){
              this.elem.style.backgroundColor = "#FFCCCC";
              this.elem.style.color = "#FF0000";

              if(this.divobj.style.display == "none"){
                  this.divobj.innerHTML = this.errormes3.replace(/【××】/g, this.elem.value).replace(/【△△】/g, left_obj.value);
                  this.reposition();
                  this.divobj.style.display = "block";
              }

              flg = true;
          }
          if( parseInt(right_obj.value,10) < parseInt(this.elem2.value,10) ){
              this.elem2.style.backgroundColor = "#FFCCCC";
              this.elem2.style.color = "#FF0000";

              if(this.divobj.style.display == "none"){
                  this.divobj.innerHTML = this.errormes4.replace(/【××】/g, this.elem2.value).replace(/【△△】/g, right_obj.value);
                  this.reposition();
                  this.divobj.style.display = "block";
              }

              flg = true;
          }

          if( (parseInt(left_obj.value,10) < parseInt(right_obj.value,10) ) || (!left_obj.value.match(this.re_out)) || (!right_obj.value.match(this.re_out)) ){
              flg = true;
          }

        }else{
          if( parseInt(this.elem.value,10) < parseInt(left_obj.value,10) ){
              this.elem.style.backgroundColor = "#FFCCCC";
              this.elem.style.color = "#FF0000";

              if(this.divobj.style.display == "none"){
                  this.divobj.innerHTML = this.errormes3.replace(/【××】/g, left_obj.value).replace(/【△△】/g, this.elem.value);
                  this.reposition();
                  this.divobj.style.display = "block";
              }

              flg = true;
          }
          if( parseInt(this.elem2.value,10) < parseInt(right_obj.value,10) ){
              this.elem2.style.backgroundColor = "#FFCCCC";
              this.elem2.style.color = "#FF0000";

              if(this.divobj.style.display == "none"){
                  this.divobj.innerHTML = this.errormes4.replace(/【××】/g, right_obj.value).replace(/【△△】/g, this.elem2.value);
                  this.reposition();
                  this.divobj.style.display = "block";
              }

              flg = true;
          }

          if( (parseInt(left_obj.value,10) < parseInt(right_obj.value,10) ) || (!left_obj.value.match(this.re_out)) || (!right_obj.value.match(this.re_out)) ){
              flg = true;
          }

        }
      }

      //合計値計算
      this.elem3.value = parseInt(this.elem.value,10) - parseInt(this.elem2.value,10);

      //合計値比較
      const sum_obj1 = $("input[type=text][name=" + qno_sum_compare1 + "]")[0];
      const sum_obj2 = $("input[type=text][name=" + qno_sum_compare2 + "]")[0];
      if(sum_obj1 && sum_obj2){
          if(parseInt(sum_obj2.value, 10) > parseInt(sum_obj1.value, 10)){
              sum_obj1.style.backgroundColor = "#FFCCCC";
              sum_obj1.style.color = "#FF0000";
              sum_obj2.style.backgroundColor = "#FFCCCC";
              sum_obj2.style.color = "#FF0000";
              if(this.divobj.style.display == "none"){
                  this.divobj.innerHTML = this.errormes5;
                  this.reposition();
                  this.divobj.style.display = "block";
              }
              flg = true;
          }else{
              sum_obj1.style.backgroundColor = "";
              sum_obj1.style.color = "#000000";
              sum_obj2.style.backgroundColor = "";
              sum_obj2.style.color = "#000000";
          }
      }

      if(flg == false){
        this.elem.style.backgroundColor = "#FFFFFF";
        this.elem.style.color = "#000000";
        this.elem2.style.backgroundColor = "#FFFFFF";
        this.elem2.style.color = "#000000";
        if(left_obj && right_obj){
            left_obj.style.backgroundColor = "#FFFFFF";
            left_obj.style.color = "#000000";
            right_obj.style.backgroundColor = "#FFFFFF";
            right_obj.style.color = "#000000";
        }
        const err_div = $(".error-mes");
            if(err_div){
                for(let i = 0; i < err_div.length; i++){
                    if(err_div[i].style.display == "block"){
                        err_div[i].style.display = "none";
                    }
                }
            }

      }

    } else {
      //数字ではないので、大小エラー文言は消す
      this.divobj.style.display = "none";
            this.elem3.value = "";
            const sum_obj1 = $("input[type=text][name=" + qno_sum_compare1 + "]")[0];
            const sum_obj2 = $("input[type=text][name=" + qno_sum_compare2 + "]")[0];
            if(sum_obj1 && sum_obj2){
                sum_obj1.style.backgroundColor = "";
                sum_obj1.style.color = "#000000";
                sum_obj2.style.backgroundColor = "";
                sum_obj2.style.color = "#000000";
            }
    }

  },

  reposition:function(){
    this.elemTop = $(this.elem).offset().top;
    this.elemLeft = $(this.elem2).offset().left;
    this.divobj.style.top = (this.elemTop + this.top) + "px";
    this.divobj.style.left = (this.elemLeft + this.left) +  "px";
  },

  errorMes:function(){

    const self = this;
    if(parseInt(self.elem.value,10) >= parseInt(self.elem2.value,10)){
      return true;
    }else{
      setTimeout(function(){  
        alert(self.errormes2);
      ;},20);
      return false;
    }
  }

};



document.getElementById('check-button').addEventListener('click', () => {
  //エラーポップアップ
  const err_div = $(".error-mes");
  if(err_div){
      for(let i = 0; i < err_div.length; i++){
          if(err_div[i].style.display == "block"){
              alert(err_div[i].innerText);
              return false;
          }
      }
  }

});


