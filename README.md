# jw7-cli
集成本地工具，远端拉取项目模板快速开发的脚手架工具

### 功能
| 指令                                     | 功能描述                                               | 参数说明                                               |
| ---------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| `jw create`                              | 快速拉取项目模板                                       | -                                                      |
| `jw zy <chineseStr...>`                  | 将中文翻译为英文                                       | 要翻译的中文字符串，支持空格连接                       |
| `jw yz <englishStr...>`                  | 将英文翻译为中文                                       | 要翻译的英文字符串，支持空格连接                       |
| `jw gflow <demandName> [-s <separator>]` | 基于远端主干拉取dev_userName_demandName_YYYYMMDD的分支 | demandName需求名称，separator为指定的分隔符，默认为`_` |
### 开发

**调试**

- 使用 `npm test [Commands]` 代替 `jw [Commands]`
- 执行 `npm run dev`，执行 `jw [Commands]` 调试

### 发布
`npm run build`
