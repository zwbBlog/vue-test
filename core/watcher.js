/**
 *  Created by zlgb on 2020-09-14 11:37:22
 *  ------------------修改记录-------------------
 *  修改人      修改日期                 修改目的
 *  zlgb        2020-09-14               创建
 **/

class Watcher {
    constructor(vm, key, cb) {
        this.$vm = vm;
        this.$key = key;
        this.$cb = cb;
        Dep.target = this;
        //this.init();
    }

    update() {
        this.$cb.call(this.$vm, this.$vm.$data[this.$key]);
    }

    init() {
        this.setValue(this.$key, this.getValue(this.$key));
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
}
