
# 找卡小包程序文档

## 目录

* [基础说明](#基础说明)  
* [业务定义](#业务定义)
* [部分业务说明](#部分业务说明)（前端+后台）
    * [用户的登陆态保持方式](#用户的登陆态保持方式)  
    * [用户上传图片的存储](#用户上传图片的存储)
* [开发人员](#开发人员)

### 基础说明

- 项目说明

    为拾卡者发布信息上传信息、丢卡者寻卡找卡领卡提供方便的平台，提升广工大学子诚信互助氛围，为弘扬新时期雷锋精神作贡献。
- 功能描述
    
    拾卡者可以将拾到的卡上传至小程序，若是丢卡人已上传其卡的信息到小程序，则将匹配成功，并告知拾卡人关于丢卡人的信息。
    当然这个方式是双向的，丢卡人也可以将丢卡信息上传至小程序进行匹配，若匹配成功则可获得拾卡人信息。
- 开发环境

    项目前端开发工具： 微信web开发者工具
    
    前端语言为WXML+WXSS+JS+JSON
    
    项目后台服务器：CentOS 7
    
    后台语言为java,使用myeclipse进行开发
    
    数据库为mysql
- 项目结构简介

    前端使用小程序提供的小程序的框架、组件、API；

    后台使用了Spring MVC - Spring - mybatis 的框架;
    
    在维持登陆态方式上用了redis;
    
    项目为maven项目
    
- 参考文献

    腾讯云SDK：https://cloud.tencent.com/document/product/436/10199
    
    小程序：https://developers.weixin.qq.com/miniprogram/dev/
 
### 业务定义

```
graph TD
    A[用户登陆] -->B(用户界面)
    B --> |One| C[上传丢卡信息] 
    B --> |Two| D[上传拾卡信息]
    B --> |Three| E[查看自己的丢卡-拾卡记录]
    C --> F[发现恶意上传可以举报]
    D --> F
    F --> G[后台管理员查看数据确认是否为恶意上传]
```

## 部分业务说明


#### 用户的登陆态保持方式：


1. 小程序端将请求微信接口给与临时登陆凭证code，并将其发到后台，后台发起请求获取openid
2. 后台将该openid存入用户数据表，并生成一个UUID与之形成key-value,将这对key-value存入redis，有效时间为60分钟，并将次UUID命名u_id放在相应头中返回给小程序端
3. 此后小程序对服务端的请求皆需要在请求头中加u_id，每次请求都会重置u_id对应的key-value在redis的时限。


- #### 前端



- #### 后台

 
* 以下为拦截器代码

```
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String requested_U_id = request.getHeader("u_id");
        Validate.isTrue(ObjectUtils.anyNotNull(requested_U_id), "请求头缺少必要参数，请确认后重试");
        return true;
    }
```
* 以下为登陆接口

```

    @ResponseBody
    @RequestMapping(value="/login",method = RequestMethod.POST)
    public ResponseJson getOpenId(HttpServletRequest request,HttpServletResponse response){
    	ResponseJson json = new ResponseJson();
        String code = request.getParameter("code");
        Map<String, Object> result = CommonUtil.getOpenId(code);
        if(result.get("status").equals("0")) {
        	json.setCode(201);
        	json.setMsg("获取openid失败");
        	return json;
        }
        String openid=(String) result.get("openid");
        String u_id = request.getHeader("u_id");
        if(u_id.equals("login")) {
        	User u = userService.getByOpenid(openid);
			if(null==u) {
				User user = new User(openid,0);
				userService.addUser(user);
			}
			if(userService.findUserStatus(openid)==3) {
				json.setCode(201);
				json.setMsg("该用户已被关小黑屋");
				return json;
			}
			String login_u_id = UUIDUtil.get();
			RedisUtil.set(login_u_id, openid);
			json.setCode(200);
			json.setValue("u_id", login_u_id);
			json.setMsg("登陆成功");
			response.setHeader("u_id", login_u_id);
			return json;
        }else {
			if (Objects.isNull(RedisUtil.get(u_id))) {
				json.setCode(202);
				json.setMsg("需要重新登陆");
				return json;
			}else {
				RedisUtil.setTime(u_id);
				json.setCode(200);
				json.setMsg("已登陆");
				response.setHeader("u_id", u_id);
				return json;
			}
		}
    }

```

#### 用户上传图片的存储

考虑到用户可能会多次上传图片，统一用户图片的辨识逻辑麻烦，而且文件夹中能存放的文件有限，所以上传的图片存储在腾讯云COS对象存储中

- #### 前端

使用<image>组件，src绑定数据

```
<view class='img'>
    <image src='{{img}}' bindtap='AddImg'></image>
</view>
      
```
使用小程序提供的API选择图片并传给后台，且改变绑定的src的路径以显示图片

```
AddImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://yangyi.obstacle.cn/system/findController/uploadPic',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "content-type": "multipart",
            "u_id": app.globalData.uId
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            if(data.code == 200) {
              that.setData({
                img: data.data.imgurl
              })
            }else {
              wx.showToast({
                title: '图片格式只能为jpg',
                icon: 'none'
              })
            }
          }
        })
      }
    })
  }
  
```


- #### 后台


* maven依赖：

```

<dependency>
        <groupId>com.qcloud</groupId>
        <artifactId>cos_api</artifactId>
        <version>5.2.4</version>
</dependency>

```

* COS工具类：

```
public class CosUtils {

	static final String bucketName = "zj-1254133551";
	
	public static COSClient getCOSClient() {
		// 初始化秘钥信息
		long appId = .....;
		String secretId = "......";
		String secretKey = ".....";

		// 1 初始化用户身份信息(secretId, secretKey)
		COSCredentials cred = new BasicCOSCredentials(secretId, secretKey);
		// 2 设置bucket的区域, COS地域的简称请参照 https://cloud.tencent.com/document/product/436/6224
		ClientConfig clientConfig = new ClientConfig(new Region("ap-guangzhou"));
		// 3 生成cos客户端
		COSClient cosclient = new COSClient(cred, clientConfig);
		// bucket的命名规则为{name}-{appid} ，此处填写的存储桶名称必须为此格式
		return cosclient;
	}
	
	public static void closeCOSClient(COSClient cosClient) {
		cosClient.shutdown();
	}
	
	public static void uploadFile(File localFile,String openid,String ext){
		COSClient cosClient = getCOSClient();
		
		// 简单文件上传, 最大支持 5 GB, 适用于小文件上传, 建议 20 M 以下的文件使用该接口
		
		
		// 指定要上传到 COS 上的路径
		String key = "/"+openid+"."+ext;
		PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, localFile);
		PutObjectResult putObjectResult = cosClient.putObject(putObjectRequest);
		closeCOSClient(cosClient);
	}
}


```


### 开发人员
需求：赖星锦

设计：黄浩格

前端：杨艺，王馨玮

后台：洪崇伟




