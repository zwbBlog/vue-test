/**
 *  Created by zlgb on 2020-09-14 11:37:11
 *  ------------------修改记录-------------------
 *  修改人      修改日期                 修改目的
 *  zlgb        2020-09-14               创建
 **/

class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        const fragment = this.node2Fragment(this.$el);
        this.compile(fragment);
        this.$el.appendChild(fragment);
    }

    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        let child;
        while (child = el.firstChild) {
            fragment.append(child);
        }
        return fragment;
    }

    compile(node) {
        const nodes = node.childNodes;
        nodes.forEach(node => {
            node.childNodes.length && this.compile(node);
            if (this.isElement(node)) {
                this.compileElement(node);
            }
            if (this.isInterpolation(node)) {
                this.compileText(node);
            }
        });
    }

    isElement(node) {
        return node.nodeType === 1;
    }

    //文本节点
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent) && node.nodeValue;
    }

    compileElement(node) {
        const nodeAttrs = node.attributes;
        const regModel = /v-/;
        const regMethod = /@/;
        Array.from(nodeAttrs).forEach(attr => {
            if (regModel.test(attr.name)) {
                this[`${attr.name.substring(2)}`](node, attr.value);
            } else if (regMethod.test(attr.name)) {
                this.eventHandle(node, attr.name.substring(1), attr.value);
            }
        });
    }


    compileText(node) {
        const reg = /\{\{(.*)\}\}/g;
        const string = node.textContent.match(reg);
        this.text(node, RegExp.$1);
    }

    getValue(key) {
        let value = this.$vm.$data;
        key.split('.').forEach(b => {
            value = value[b];
        });
        return value;
    }

    setValue(key, value) {
        key = key.split('.').pop();
        const set = (obj) => {
            for (let k in obj) {
                if (k === key) {
                    obj[k] = value;
                }
            }
        };
        for (let k in this.$vm.$data) {
            if (Object.prototype.toString.call(this.$vm.$data[k]) === '[object Object]') {
                set(this.$vm.$data[k]);
            } else if (k === key) {
                this.$vm.$data[k] = value;
            }
        }
    }

    if(node, key) {
        let value = this.getValue(key);
        node.style.display = value ? '' : 'none';
        new Watcher(this.$vm, key, () => {
            value = this.getValue(key);
            node.style.display = value ? '' : 'none';
        });
    }

    text(node, key) {
        let value = this.getValue(key);
        node.textContent = value;
        new Watcher(this.$vm, key, () => {
            value = this.getValue(key);
            node.textContent = value;
        });
    }

    html(node, key) {
        new Watcher(this.$vm, key, () => {
            node.innerHTML = this.$vm.$data[key];
        });
        node.innerHTML = this.$vm.$data[key];
    }

    eventHandle(node, eventName, methodName) {
        node.addEventListener(eventName, () => {
            this.$vm[methodName].call(this.$vm);
        });
    }

    model(node, key) {
        let value = this.getValue(key);
        node.value = value;
        new Watcher(this.$vm, key, () => {
            value = this.getValue(key);
            node.value = value;
        });
        node.addEventListener('input', (e) => {
            this.setValue(key, e.target.value);
        });

    }
}
