// pages/page_photo/page_photo.js
import { GetToken1, GetToken3, NLP_Result, SR_Result } from "../../apis/BaiduAI"

var localData = require("../selectLanContent.js");
const recorder = wx.getRecorderManager();
var devpidlan;
var pastdata = require('./image_content.js');
var Golbal_index = 0;
var flag = 0; //flagE = 1;

Page({
  data:{
    PhotoSRC:'../../images/images1/img_02.jpg',
    phobtntext:'按下说话',
    RecognizeResult_photo:'请选择使用语言，\n说出图片中展示的内容…… \n（点击图片可切换）',
    selectArray: localData.dataList3,
    JudgeResult:''
  },

  ImgSwitch(){
    var randint = Math.ceil(Math.random()*11);
    this.setData({PhotoSRC: '../../images/images1/img_0' + randint.toString() + '.jpg'});
    Golbal_index = randint;
  },

  GetphoSrcl: function(e){
    //console.log(e.detail.lan);
    flag = 1;
    for (var i in localData.dataList3){
      if (e.detail.lan == localData.dataList3[i].text){
        devpidlan = localData.dataList3[i].lcode;
        //console.log(devpidlan);
        break;
      }
    }
  },

  onLoad(){
    flag = 0;
    GetToken1();
    GetToken3();
    wx.setNavigationBarTitle({
      title: '语音识别小程序-看图说话'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项【该字体颜色仅支持 #ffffff 和 #000000 】
      backgroundColor: '#B1C8DD', // 传递的颜色值【仅支持有效值为十六进制颜色】
    })
  },

  SoundRecognize(){
    SR_Result(this.audio_data,devpidlan).then(res=>{
      console.log(res);
      this.setData({
        RecognizeResult_photo: '识别结果为：' + res
      });
      NLP_Result(res).then(res=>{
        //console.log(res);
        var Nset=new Array();
        var i;
        for(i=0;i<res.items.length;i++)
        {
            if(res.items[i].pos="n"){
                Nset.push(res.items[i].item)
            }
        };
        var Newdata=pastdata.postdata.lists[Golbal_index-1].value;
        //console.log("依据值:"+Newdata);
        wx.hideLoading();
        //flagE = 0;
        for(i=0;i<Nset.length;i++)
        {
            if(Newdata==Nset[i]){
            this.setData({
                JudgeResult:'判断结果: √ 符合图片内容'
            });
            break;
            }
        }
        if(i==Nset.length)
        {
            this.setData({
                JudgeResult:'判断结果: × 不符合图片内容'
            });
        }
        }
    )});
  },

  //录音键按下函数
  BtnStart(){ 
    if (flag == 0){
      wx.showToast({
        title: '请选择使用语言!',
        icon:'error',
        duration: 2000
      });
    }
    else{
      this.setData({phobtntext:'倾听中，松手结束'});
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
    if (flag == 1){
      wx.showLoading({
        title: '识别判断中',
        duration: 10000
      });
      this.setData({phobtntext:'按下说话'});
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
      url: 'page_photo'
    })
  }
})
