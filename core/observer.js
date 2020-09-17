/**
 *  Created by zlgb on 2020-09-14 11:36:57
 *  ------------------修改记录-------------------
 *  修改人      修改日期                 修改目的
 *  zlgb        2020-09-14               创建
 **/

class Observer {
    constructor(data, vm) {
        this.$vm = vm;
        this.init(data);
    }

    init(data) {
        if (Object.prototype.toString.call(data) === '[object Object]') {
            this.observer(data);
        }
    }

    observer(data) {
        const dep = new Dep();
        this.deepProxy(null,data, dep);
    }

    proxyData(data, dep) {
        const self = this;
        return new Proxy(data, {
            get(target, key, receiver) {
                // 订阅数据变化时，往Dep中添加观察者
                Dep.target && dep.addDep(Dep.target);
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value, receiver) {
                Reflect.set(target, key, value, receiver);
                dep.notifies();
                console.log('set');
                return Reflect.set(target, key, value, receiver);
            }
        });
    }

    deepProxy(k = null, data, dep) {
        if (Object.prototype.toString.call(data) === '[object Object]') {
            if (k)
                this.$vm.$data[k] = this.proxyData(data, dep);
            else
                this.$vm.$data = this.proxyData(data, dep);
            for (let k in data) {
                this.deepProxy(k, data[k], dep);
            }
        }
    }
}

