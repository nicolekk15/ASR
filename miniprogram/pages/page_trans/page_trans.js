// pages/page_trans/page_trans.js
import { GetToken1,  GetToken2, SR_Result, TRANSLATION_Result } from "../../apis/BaiduAI"

var localData = require("../selectLanContent.js");
const recorder = wx.getRecorderManager();
var src_lan, dst_lan, src_devpidlan;
var flag1 = 0, flag2 = 0;

Page({
  data:{
    transbtntext:'按下说话',
    RecognizeResult_trans:'请选择待译语言和目标语言，完成翻译设置\n说出需要翻译的内容……',
    TranslationResult_trans:'暂无内容……',
    selectArray1:localData.dataList1,
    selectArray2:localData.dataList2,
  },

  onLoad(){
    flag1 = 0;
    flag2 = 0;
    GetToken1();
    GetToken2();
    wx.setNavigationBarTitle({
      title: '语音识别小程序-即时翻译'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项【该字体颜色仅支持 #ffffff 和 #000000 】
      backgroundColor: '#999', // 传递的颜色值【仅支持有效值为十六进制颜色】
    })
  },

  GetSrcl: function(e){
    flag1 = 1;
    for (var i in localData.dataList2){
      if (e.detail.lan == localData.dataList2[i].text){
        src_devpidlan = localData.dataList2[i].lcode;
        break;
      }
    };
    for (var i in localData.dataList1){
      if (e.detail.lan == localData.dataList1[i].text){
        //console.log(localData.dataList1[i].lcode);
        src_lan = localData.dataList1[i].lcode;
        break;
      }
    }
  },
  GetDstl: function(e){
    flag2 = 1;
    for (var i in localData.dataList1){
      if (e.detail.lan == localData.dataList1[i].text){
        //console.log(localData.dataList1[i].lcode);
        dst_lan = localData.dataList1[i].lcode;
        break;
      }
    }
  },

  SoundRecognize(){
    SR_Result(this.audio_data,src_devpidlan).then(res=>{
      console.log(res);
      this.setData({
        RecognizeResult_trans: '识别结果为：' + res
      });
      TRANSLATION_Result(res,src_lan,dst_lan).then(res=>{
        wx.hideLoading();
        console.log(res);
        this.setData({
          TranslationResult_trans: '翻译结果为：' + res
        })
      })
    });
  },

  //录音键按下函数
  BtnStart(){ 
    if (flag1 == 0 || flag2 == 0){
      wx.showToast({
        title: '请完成翻译设置!',
        icon:'error',
        duration: 2000
      });
    }
    else{
      this.setData({transbtntext:'倾听中，松手结束'});
      const options = {
        sampleRate: 16000,
        numberOfChannels: 1,
        format: "PCM"
      };
      recorder.start(options);
      recorder.onStart(()=>{
        console.log("Recording Start!");
      });
      recorder.onError(err=>{
        console.log(err);
      });
    }
  },

  //录音键松开函数
  BtnStop(){
    if (flag1 == 1 && flag2 == 1){
      wx.showLoading({
        title: '识别翻译中',
        duration: 10000
      });
      this.setData({transbtntext:'按下说话'});
      recorder.stop();
      recorder.onStop(res=>{
        console.log(res);
        this.audio_path = res.tempFilePath;
        const fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: this.audio_path,
          success: (res)=>{
            this.audio_data = res.data;
            this.SoundRecognize();
          }
        });
      });
    }
  },

  RefreshPage(){
    wx.reLaunch({
      url: 'page_trans'
    })
  }
})


