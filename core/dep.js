/**
 *  Created by zlgb on 2020-09-14 11:37:35
 *  ------------------修改记录-------------------
 *  修改人      修改日期                 修改目的
 *  zlgb        2020-09-14               创建
 **/
class Dep{
    constructor(){
        this.deps= []
    }
    addDep(watcher){
        Dep.target = null;
        this.deps.push(watcher)
    }

    notifies(){
        this.deps.forEach(watcher=>{
            watcher.update()
        })
    }
}
Dep.target = null;
