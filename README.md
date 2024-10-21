## 技术栈

前端
- React
- Antd

后端（拆分多个微服务，微服务间使用TCP通信）
- Nest.js
- Prisma

数据库
- MySQL
- Redis

OSS
- Minio

注册中心、配置中心
- Nacos

消息队列
- RabbitMQ（微服务间的异步通信）

部署
- Docker Compose
- pm2

网关
- nginx

 功能

## 模板

问卷星

## 需求分析

用户
- 登录
- 注册
- 修改密码

考试
- 考试列表
- 创建考试
- 删除试题
- 编辑试题
- 发布试题

判题
- 自动判题
- 试题数据
- 成绩导出（excel）

排行榜

## 微服务模块

同步通信使用TCP || grpc，异步通信使用rabbitmq

本系统微服务模块：
- 用户
- 考试
- 判题
- 排行榜


## 数据库设计

用户(1) vs 答卷(n)
用户(1) vs 考试(n)

考试(1) vs 答卷(n)

答卷(1) vs 用户(1)
答卷(1) vs 考试(1)

数据表：
- 用户
- 考试
- 答卷

## 接口设计

用户模块:
| 接口路径 | 请求方式 | 描述 |
| --- | --- | --- |
| /user/login | POST | 用户登录 |
| /user/register | POST | 用户注册 |
| /user/update_password | POST | 用户修改密码 |

考试模块:
| 接口路径 | 请求方式 | 描述 |
| --- | --- | --- |
| /exam | POST | 创建考试 |
| /exam | DELETE | 删除考试 |
| /exam/list | GET | 考试列表 |
| /exam/save | POST | 保存考试内容 |
| /exam/publish | GET | 发布考试 |

试题模块:
| 接口路径 | 请求方式 | 描述 |
| --- | --- | --- |
| /answer | POST | 添加试题 |
| /answer/list | GET | 试题列表 |
| /answer/export | GET | 试题导出为excel |

排行榜模块：
| 接口路径 | 请求方式 | 描述 |
| --- | --- | --- |
| /rank | GET | 成绩排行榜 |