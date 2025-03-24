<template>
  <div class="codeMirrorEditor-page" :style="{ height: height + 'px' }">
    <textarea ref="textarea" v-model="value"></textarea>
  </div>
</template>

<script>
import { JSHINT } from 'jshint'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/blackboard.css'
import 'codemirror/theme/eclipse.css'
// 代码语言
import 'codemirror/mode/javascript/javascript'
// 代码检查
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/javascript-lint'
import 'codemirror/addon/display/autorefresh'
import 'codemirror/addon/search/match-highlighter'
// 代码匹配
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/matchtags'
// 代码折叠
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/xml-fold'

export default {
  name: 'codeMirrorEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 350
    }
  },
  data() {
    return {
      code: '',
      coder: null,
      coderOptions: {
        mode: 'javascript', // 代码类型
        theme: 'blackboard', // 设置主题 记得引入对应主题才有显示 dracula default  import 'codemirror/theme/blackboard.css'
        tabSize: 2, // tab缩进
        indentUnit: 2, // 缩进为多少个空格
        lint: true, // 启用代码检查功能，可以帮助检测语法错误等。
        readOnly: false, // 设置只读不可编辑
        lineNumbers: true, // 显示行号
        cursorHeight: 1, // 光标高度，默认是1
        gutters: [
          // 定义编辑器左侧空白区域（称为沟槽）中的元素
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers'
        ],
        keyMap: 'default', // sublime编辑器效果
        foldGutter: true, // 启用行槽中的代码折叠
        autoCloseBrackets: true, // 自动闭合符号
        autoCloseTags: true, // 在编写 HTML/XML 等标记语言时自动闭合标签。
        matchTags: { bothTags: true }, // 当光标位于开始或结束标签附近时，同时高亮显示它们。
        matchBrackets: true, // 在光标点击紧挨{、]括号左、右侧时，自动突出显示匹配的括号 }、]
        styleActiveLine: true, // 高亮选中行
        lineWrapping: 'wrap', // 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
        showCursorWhenSelecting: true, // 文本选中时显示光标
        smartIndent: true, // 智能缩进
        htmlMode: true,
        dragDrop: true, // 是否启用拖放功能
        completeSingle: false, // 当匹配只有一项的时候是否自动补全
        hintOptions: {
          // 代码提示
          completeSingle: false,
          hint: CodeMirror.hint.javascript
        },
        highlightSelectionMatches: {
          // 配置如何在文档中高亮显示与当前选中文本相匹配的内容
          minChars: 2,
          trim: true,
          style: 'matchhighlight',
          showToken: false
        }
      }
    }
  },
  methods: {
    // 初始化
    initialize(coderConfig = {}) {
      window.JSHINT = JSHINT
      const config = {
        ...this.coderOptions,
        ...coderConfig
      }
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, config)
      this.coder.on('inputRead', () => {
        this.coder.showHint()
      })
      // 编辑器赋值
      if (this.value || this.code) {
        this.setCodeContent(this.value || this.code)
      } else {
        this.coder.setValue('')
      }
      // 支持双向绑定
      this.coder.on('change', (coder) => {
        this.code = coder.getValue()
        this.$emit('input', this.code)
      })
      this.coder.on('blur', () => {
        this.$emit('blur') // 新增blur事件
      })
    },
    setCodeContent(val) {
      setTimeout(() => {
        if (!val) {
          this.coder.setValue('')
        } else {
          this.coder.setValue(val)
        }
      }, 300)
    }
  }
}
</script>
<style lang="less">
.codeMirrorEditor-page {
  width: 100%;
  height: 100%;
  .CodeMirror {
    direction: ltr;
    line-height: 20px;
    width: 100%;
    height: 100%;
  }
  .CodeMirror-hints {
    z-index: 9999 !important;
  }
  .custom-class .CodeMirror {
    width: 100%;
  }
}
.CodeMirror-hints {
  z-index: 1000;
}
</style>
