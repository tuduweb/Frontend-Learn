# 移动终端编程
## 视频对话例子

采用WebRTC的方式，进行视频通话。

### 架构
#### nginx
做反向代理：
代理web服务，提供https访问，以达到WebRTC的可信要求。
代理socket服务，提供同域（名）访问，这样不用解决跨域问题和本地IP变化的问题。

#### Node.js
Node.js 后端服务器：
提供页面渲染和socket服务

##### Express
动态网页后端采用Express，版本4.16.1

##### socketIO
WebSocket采用socketIO，版本3.0.3，跟网络上绝大多数例子存在大版本差异，最终翻手册和外网解决问题。