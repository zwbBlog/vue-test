/**
 *  Created by zlgb on 2020-09-14 11:35:47
 *  ------------------修改记录-------------------
 *  修改人      修改日期                 修改目的
 *  zlgb        2020-09-14               创建
 **/


class Vue {
    constructor(opts) {
        this.init(opts);
    }

    init(opts) {
        this.initState(opts);
        new Compile(opts.el, this);
    }

    initState(opts) {
        if (opts.data)
            new Observer(opts.data(), this);
        if (opts.methods)
            this.initMethods(opts.methods);
        if (opts.created)
            opts.created.call(this);
    }

    initMethods(methods) {
        for (var key in methods) {
            this[key] = methods[key];
        }
    }

    getValueForKey(k,data){
        for(let key in data){
            if(Object.prototype.toString.call(data[key]) === '[object Object]'){
                this.getValueForKey(k,data[key])
            }
            if(key === k){
                return data[k]
            }
        }
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
        for (let k in this.$data) {
            if (Object.prototype.toString.call(this.$data[k]) === '[object Object]') {
                set(this.$data[k]);
            } else if (k === key) {
                this.$data[k] = value;
            }
        }
    }

    get(k,data){
        let val=''
        const recursion = (data) =>{
            Object.keys(data).forEach(key=>{
                if(key === k){
                    val = data[key]
                    return;
                }
                if(Object.prototype.toString.call(data[key]) === '[object Object]'){
                    recursion(data[key])
                }
            })
        };
        recursion(data)
        return val
    }

    getValue(k) {
        return this.get(k,this.$data)
    }

    setData(obj) {
        for (let k in obj) {
            if(Object.prototype.toString.call(obj[k]) === '[object Object]'){
                this.setData(obj[k])
            }else{
                const value = this.getValueForKey(k,obj)
                this.setValue(k,value)
            }
        }
    }

}
