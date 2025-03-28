<template>
  <div class="tiptapEditor-page">
    <div class="button-group">
      <el-button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        切换块引用
      </el-button>
      <el-button
        @click="editor.chain().focus().setBlockquote().run()"
        :disabled="!editor.can().setBlockquote()"
      >
        设置块引用
      </el-button>
      <el-button
        @click="editor.chain().focus().unsetBlockquote().run()"
        :disabled="!editor.can().unsetBlockquote()"
      >
        取消块引用
      </el-button>
      <div></div>
      <el-button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        切换子弹列表
      </el-button>
      <el-button
        @click="editor.chain().focus().splitListItem('listItem').run()"
        :disabled="!editor.can().splitListItem('listItem')"
      >
        分裂子弹列表
      </el-button>
      <el-button
        @click="editor.chain().focus().sinkListItem('listItem').run()"
        :disabled="!editor.can().sinkListItem('listItem')"
      >
        下一级子弹列表
      </el-button>
      <el-button
        @click="editor.chain().focus().liftListItem('listItem').run()"
        :disabled="!editor.can().liftListItem('listItem')"
      >
        上一级子弹列表
      </el-button>
      <div></div>
      <el-button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        转换代码块
      </el-button>
      <el-button
        @click="editor.chain().focus().setCodeBlock().run()"
        :disabled="editor.isActive('codeBlock')"
      >
        设置代码块
      </el-button>
      <div></div>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
// 块引用（渲染<blockquote></blockquote>）
import Blockquote from '@tiptap/extension-blockquote'
// 无序列表（渲染<ul></ul>和<li></li>）
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
// 代码块（渲染<pre></pre>和<code></code>）
import CodeBlock from '@tiptap/extension-code-block'

export default {
  name: 'tiptapEditor',
  components: {
    EditorContent
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new Editor({
      content: `
          <blockquote>
            Nothing is impossible, the word itself says “I’m possible!”
          </blockquote>
          <p>Audrey Hepburn</p>
          <p>分割线-------------------------------------------------</p>
          <ul>
            <li>A list item</li>
            <li>And another one</li>
          </ul>
          <p>分割线-------------------------------------------------</p>
          <p>That’s a boring paragraph followed by a fenced code block:</p>
          <pre>
            <code>
              for (var i=1; i <= 20; i++) {
                if (i % 15 == 0)
                  console.log("FizzBuzz");
                else if (i % 3 == 0)
                  console.log("Fizz");
                else if (i % 5 == 0)
                  console.log("Buzz");
                else {
                  console.log(i);
                }
              }
            </code>
          </pre>
          <p>Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.</p>
          <p>分割线-------------------------------------------------</p>
          `,
      extensions: [
        Document,
        Paragraph,
        Text,
        Blockquote,
        BulletList,
        ListItem,
        CodeBlock
      ]
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="less">
.tiptapEditor-page {
  border: 1px solid #000;
  padding: 20px;
  .ProseMirror {
    padding: 10px;
  }
  blockquote {
    border-left: 3px solid #455a64;
    margin: 15px 0;
    padding-left: 10px;
  }
  pre {
    background: #000;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    margin: 15px 0;
    padding: 8px 10px;
    code {
      background: none;
      color: inherit;
      font-size: 12px;
      padding: 0;
    }
  }
}
</style>
