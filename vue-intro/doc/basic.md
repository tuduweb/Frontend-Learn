## Vue入门 学习
### 介绍章节：基础部分
#### 声明式渲染
也就是基础性的渲染`{{ message }}`使用这样的方式接受变量。从而实现文本插值。

#### 处理用户输入

1. 使用`v-on`，如`v-on:click`等实现事件监听器
2. 使用`v-model`实现双向绑定：表单输入和应用状态之间的双向绑定

#### 条件与循环
1. `v-if` 此外，Vue 也提供一个强大的过渡效果系统，可以在 Vue 插入/更新/移除元素时自动应用过渡效果。
2. `v-for` 用`v-for="item in items"`实现对数据数组实现渲染

#### 组件化应用
组件系统是 Vue 的另一个重要概念，因为它是一种抽象，允许我们使用小型、独立和通常可复用的组件构建大型应用。仔细想想，几乎任意类型的应用界面都可以抽象为一个组件树：
```javascript
app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})
```

```html
<div id="todo-list-app">
  <ol>
     <!--
      现在我们为每个 todo-item 提供 todo 对象
      todo 对象是变量，即其内容可以是动态的。
      我们也需要为每个组件提供一个“key”，稍后再
      作详细解释。
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```

### 模板语法
#### 插值
1. 文本`{{ msg }}`
2. 原始HTML：不同于输出文本，html输出应该使用`v-html`，如：

   ```html
   <p>Using mustaches: {{ rawHtml }}</p>
   <p>Using v-html directive: <span v-html="rawHtml"></span></p>
   ```

   ```js
   const RenderHtmlApp = {
       data() {
           return {
               rawHtml: '<span style="color: red">This should be red.</span>'
               }
            }
        }
    ```
3. Attribute使用`v-bind`可以绑定属性。对于bool值的属性，如果参数值为`null`或者`undefined`，那么这个属性甚至可能不会包含在渲染出来的元素中。
4. 使用JavaScript表达式：数据绑定支持js表达式语法，但注意，每个绑定只能包含<b>单个表达式</b>

#### 指令
##### 参数

一些指令能接受参数，比如`v-bind:href='url'`。这里的`href`就是参数。

另一个例子是`v-on:click="doSomething"`,用于监听DOM事件。

##### 动态参数
也可以在指令参数中使用JavaScript表达式，方法是用方括号括起来：
```js
<a v-bind:[attributeName]="url">...</a>
```
这里的`attributeName`会被作为一个JavaScript表达式进行动态求值，求得的值将会作为最终的参数来使用。

同样的，这种方法也可以运用于动态事件名绑定处理函数：
```js
<a v-on:[eventName]="doSomething">...</a>
```

##### 修饰符
修饰符 (modifier) 是以半角句号.指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，.prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()：

<b>暂时无法理解</b>

#### 缩写
Vue为`v-bind`和`v-on`两个最常用的指令，提供了缩写。
1. `v-bind:`变成`:`
2. `v-on:`变成`@`

##### 注意事项
###### 对动态参数值的约定
动态参数值预期是求出一个字符串，异常情况下值为`null`。这个特殊的`null`值可以被显示性的用于移除绑定。任何其他非字符串类型的值都将会出发一个警告。

###### 对动态参数表达式约定
动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 HTML attribute 名里是无效的。例如：
```javascript
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```
变通的办法是使用没有空格或引号的表达式，或用计算属性替代这种复杂表达式。

在 DOM 中使用模板时 (直接在一个 HTML 文件里撰写模板)，还需要避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写：
```js
<!--
在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
-->
<a v-bind:[someAttr]="value"> ... </a>
```

###### JavaScript表达式
模板表达式都被放在沙盒中，只能访问<b>全部变量的一个白名单</b>。不应该在模板表达式中，试图访问用户定义的全局变量。