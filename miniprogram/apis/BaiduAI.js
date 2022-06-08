//百度智能云中创建语音识别应用sr_baidu_1，获取APIKey1和SecretKey1
const ACCESS_KEY1 = "4A64Tc2LbFFZnnlzQGI9jImx";
const ACCESS_SECRET1 = "CPrelm1DZxkitvxnLKvb0ULk1Q6bpvHy";
//百度智能云中创建文本翻译应用sr_baidu_2，获取APIKey2和SecretKey2
const ACCESS_KEY2 = "GNdY9nQEkiChsjoYbkMavyb1";
const ACCESS_SECRET2 = "tqolhx3y7kFSpb5MchLK0YPBduYKvwbd";
//百度智能云中创建NLP应用sr_baidu_3，获取APIKey3和SecretKey3
const ACCESS_KEY3 = "pqyHCqugGfZvouhQdvvbpE6Z";
const ACCESS_SECRET3 = "WT1uxmCZM6LIpluC006qcdPytYBMdPU4";

//获得百度AI语音识别的Token
export function GetToken1(){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${ACCESS_KEY1}&client_secret=${ACCESS_SECRET1}`,
      method: "POST",
      success: (res)=>{
        wx.setStorage({
          data: res.data.refresh_token,
          key: "user-token1",
        })
      }
    });
  });
}

//获得百度//获得百度AI文本翻译的Token
export function GetToken2(){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${ACCESS_KEY2}&client_secret=${ACCESS_SECRET2}`,
      method: "POST",
      success: (res)=>{
        wx.setStorage({
          data: res.data.access_token,
          key: "user-token2",
        })
      }
    });
  });
}

export function GetToken3(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${ACCESS_KEY3}&client_secret=${ACCESS_SECRET3}`,
        method: "POST",
        success: (res)=>{
          // console.log("token!");
          wx.setStorage({
            data: res.data.access_token,
            key: "user-token3",
          })
        }
      });
    });
  }

//调用百度AI语音识别接口，获得语音识别结果
export function SR_Result(data,devpidlan){
  let token = wx.getStorageSync("user-token1");
  if(!token){
    console.log("reget token");
    GetToken1();
  }
  return new Promise((resolve, regest)=>{
    wx.request({
      url: `https://vop.baidu.com/server_api?dev_pid=${devpidlan}&cuid=155236miniapp&token=${token}`,
      method: "POST",
      data: data,
      header: {"Content-Type": "audio/pcm;rate=16000"},
      success: (res)=>{
        resolve(res.data.result[0]);
      },
      fail: regest
      //fail: resolve('1ERROR1')
    })
  });
}

//调用百度AI文本翻译接口，获得翻译结果
export function TRANSLATION_Result(data,srclan,dstlan){
  let token = wx.getStorageSync("user-token2");
  if(!token){
    console.log("reget token");
    GetToken2();
  }
  return new Promise((resolve, regest)=>{
    wx.request({
      url: `https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1?access_token=${token}&q=${data}&from=${srclan}&to=${dstlan}`,
      method: "POST",
      header: {"Content-Type": "application/json"},
      success: (res)=>{
        console.log(res);
        if (res.data && res.data.result.trans_result) {
          resolve(res.data.result.trans_result[0].dst);
        }
      },
      fail: regest
      //fail: resolve('1ERROR1')
    })
  });
}

  //调用百度NLP接口，获得翻译结果
  export function NLP_Result(data){
    let token = wx.getStorageSync("user-token3");
    if(!token){
      console.log("reget token");
      GetToken3();
    }
    return new Promise((resolve, regest)=>{
      wx.request({
        url: `https://aip.baidubce.com/rpc/2.0/nlp/v1/lexer?charset=UTF-8&access_token=${token}`,
        method: "POST",
        data:{
            "text": data
        },
        header: {"Content-Type": "application/json"},
        success: (res)=>{
          console.log(res.data);
          resolve(res.data);
        },
        fail: regest
        //fail: resolve('1ERROR1') 
      })
    });
  }
