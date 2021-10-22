/*
10.18

软件：  爱企查
收益：  每天250左右爱豆
注意事项 ： 运行js时不要打开软件app

获取ck：  打开软件点击右上角签到即可获取

重写：
QX重写：https://aiqicha.baidu.com/zxcenter url script-request-header live.js

主机名：hostname = aiqicha.baidu.com

*/

const $ = new Env('爱企查');
let status;

status = (status = ($.getval("aiqicstatus") || "1")) > 1 ? `${status}` : "";

const aiqichdArr = [], aiqiccount = ''

let aiqichd = $.getdata('aiqichd')

let aqctz = 0;

let rw = {
    CX10002: "每日签到", CX10001: "每日登陆", CX11001: "查询企业", CX11002: "查询老板", CX11003: "查询老赖",
    CX11004: "查询商标", CX11005: "查询地图", CX11006: "浏览新闻", CX11007: "浏览监控日报", CX11009: "查询关系",
    CX12001: "添加监控", CX12002: "添加关注", CX12005: "分享任务", CX12007: "高级搜索"
  };

const headers = {
"User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36",
referer:
    "https://aiqicha.baidu.com/m/s?t=3&q=%E5%B0%8F%E7%B1%B3&VNK=e73b55ef",
"X-Requested-With": "XMLHttpRequest",
Host: "aiqicha.baidu.com",
cookie: "",
};

function rand() {
    let key = ["苹果", "华为", "百度", "一个", "暴风", "王者", "联想", "小米", "华润", "人人乐","SONY", "李宁","加多宝"];
    let i = Math.floor(Math.random() * key.length);
    return key[i];
}



!(async () => {
    if (typeof $request !== "undefined") {

        aqcck()

    } else {

        aiqichdArr.push($.getdata('aiqichd'))


        let aiqiccount = ($.getval('aiqiccount') || '1');

        for (let i = 2; i <= aiqiccount; i++) {

            aiqichdArr.push($.getdata(`aiqichd${i}`))


        }

        console.log(
            `\n========== 脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() +
                new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000
            ).toLocaleString()} ==========\n`);
            console.log(`共${aiqichdArr.length}个账号`);
        for (let i = 0; i < aiqichdArr.length; i++) {
            
            if (aiqichdArr[i]) {
                
                aiqichd = aiqichdArr[i];
                headers.cookie = aiqichd;
                alltaskList = [];
                ytaskList = [];
                taskList = [];
                claimList = [];
                $.index = i + 1;
                console.log(`\n查询第${$.index}个账号可执行任务`);
                await aqccxrw()
                await $.wait(3000)
                console.log(`第${$.index}个账号开始任务`); 
                await aqczrw()
                await kzrw()
                await $.wait(3000)
                await lqad()
                await $.wait(3000)
                console.log(`查询第${$.index}个账号现有爱豆`);
                await cxad()
            }
            alltaskList = [];
            ytaskList = [];
            taskList = [];
            claimList = [];
        }
    }
})()

    .catch((e) => $.logErr(e))
    .finally(() => $.done())



//获取ck

function aqcck() {
    if ($request.url.indexOf("cumulativeSignInAjax") > -1) {

        const aiqichd = $request.headers['Cookie']
        if (aiqichd) $.setdata(aiqichd, `aiqichd${status}`)
        $.log(aiqichd)
        $.msg($.name, "", `爱企查${status}获取header成功`)

    }
}


//查询任务

async function aqccxrw(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `https://aiqicha.baidu.com/usercenter/checkTaskStatusAjax`,
            headers: headers,
        }
        $.get(url, async (err, resp, data) => {
            try {
                
                cxfh = JSON.parse(data)
                let obj = cxfh.data;
                if(cxfh.status == 0){

                    Object.keys(obj).forEach(function (key) {
                        if (rw[key]) {
                          let task = obj[key];
                          task.title = key;
                          alltaskList.push(task);
                          if (task.count == task.totalcount) ytaskList.push(task);
                          if (task.canClaim != 0) claimList.push(key);
                          if (task.count != task.totalcount) taskList.push(task);
                        }
                      });
                }
                console.log(
    `共 ${alltaskList.length}任务 已完成 ${ytaskList.length} 任务 可做 ${taskList.length}任务 ${claimList.length}任务可领取奖励`)
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)
    })
}

async function lqad(){
    console.log(`开始领取爱豆`);
    if(claimList.length> 0){
        for(i=0; i<alltaskList.length; i++){

            kljl = alltaskList[i]
            await aqclad(`zxcenter/claimUserTaskAjax?taskCode=${kljl.title}`);
            await $.wait(1000)        
        }
    }else{
        console.log("没有可领取的奖励");
    }
}

//做任务
async function kzrw(){
    if(taskList.length> 0){
        for(i=0; i<taskList.length; i++){
            dqrw = taskList[i]
            if(dqrw.title == "CX10002"){
                console.log("开始签到");
                await aqczrw(`usercenter/userSignAjax`);
            }else  if(dqrw.title == "CX10001"){
                console.log("开始每日登陆");
            }else  if(dqrw.title == "CX11001"){
                console.log("开始查询企业");
                await aqczrw(`s/getHeadBrandAndPersonAjax?q=${encodeURI(rand())}`);
                await aqczrw(`search/advanceFilterAjax?o=0&p=1&q=${encodeURI(rand())}&t=111`);
            }else  if(dqrw.title == "CX11002"){
                console.log("开始查询老板");
                await aqczrw(`person/relevantPersonalAjax?page=1&q=${encodeURI(rand())}&size=10`);
            }else  if(dqrw.title == "CX11003"){
                console.log("开始查询老赖");
                await aqczrw(`c/dishonestAjax?q=${encodeURI(rand())}&t=8&s=10&p=1&f=%7B%22type%22:%221%22%7D`);
            }else  if(dqrw.title == "CX11004"){
                console.log("开始查询商标");
                await aqczrw(`c/markproAjax?q=${encodeURI(rand())}&p=1&s=10&f=%7B%7D&o=%7B%7D`);
            }else  if(dqrw.title == "CX11005"){
                console.log("开始查询地图");
                await aqczrw(`map/getAdvanceFilterListAjax?longitude=113.76343399&latitude=23.04302382&distance=2&page=1`);
            }else  if(dqrw.title == "CX11006"){
                console.log("开始浏览新闻");
                await aqczrw("m/getYuqingDetailAjax?yuqingId=993090dcb7574be014599996098459e3");
            }else  if(dqrw.title == "CX11007"){
                console.log("开始浏览监控日报");
                await await jkrb();
            }else  if(dqrw.title == "CX11009"){
                console.log("开始查询关系");
                await aqczrw(`relations/findrelationsAjax?from=8ec1f3a262ebe1ad407352af2236573d&to=8d4ba86a2bf31782a4b52d9748bdcfdb&pathNum=5`);
            }else  /*if(dqrw.title == "CX11010"){
                console.log("开始批量查询");
                await aqczrw(`batchquery/show?exportkey=xlTM-TogKuTwFXlQeIXL0-Z9C*YO4vCwtkRdM7XV9*7FpZRZtSR8*2qgItOy*xqmSxZSsju-YgmZmd`);
            }else  */if(dqrw.title == "CX12001"){
                console.log("开始添加监控");
                for(id of [29829264524016, 28696417032417, 31370200772422, 31242153386614,]){                    
                    await aqczrw(`zxcenter/addMonitorAjax?pid=${id}`);
                }
                await aqczrw(`zxcenter/addMonitorAjax?pid=29710155220353`);
                await aqczrw(`zxcenter/cancelMonitorAjax?pid=29710155220353`);                
            }else  if(dqrw.title == "CX12002"){
                console.log("开始添加关注");
                await aqczrw(`my/addCollectAjax?pid=31610236813812`);
                await aqczrw(`my/addCollectAjax?pid=11260803240695`);
            }else  if(dqrw.title == "CX12005"){
                console.log("开始分享好友");
                await fxhy();
            }else  if(dqrw.title == "CX12007"){
                console.log("开始高级搜索");
                await aqczrw(`search/advanceSearchAjax?q=${encodeURI(rand())}&t=11&p=1&s=10&o=0&f=%7B%22searchtype%22:[%221%22]%7D`);
                await $.wait(5000) 
            }/*else  if(dqrw.title == "CX12008"){
                console.log("开始高级筛选");
                await aqczrw(`search/advanceFilterAjax?q=%E7%A6%8F%E5%B7%9E%E6%AF%8F%E6%97%A5&t=0&p=1&s=10&o=0`);
            }
            await $.wait(5000)*/         
        }
    }else{
        console.log("没有可做的任务");
    }
}
//领爱豆
        
function aqclad(api, timeout = 0) {
    return new Promise((resolve) => {                   
        let url = {
            url: `https://aiqicha.baidu.com/${api}`,
            headers: headers,
        }
        $.get(url, async (err, resp, data) => {
            try {
                jlad = JSON.parse(data)
                if (jlad.status == 0) {
                    console.log(`获得${jlad.data.totalScore}爱豆`);
                } else {                        
                    console.log(`${jlad.msg}`);
                }                            
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)       
    })
}

//任务函数
function aqczrw(api, timeout = 0) {
    return new Promise((resolve) => {                   
        let url = {
            url: `https://aiqicha.baidu.com/${api}`,
            headers: headers,
        }
        $.get(url, async (err, resp, data) => {
            try {
                rwdt = JSON.parse(data)
                if (rwdt.status == 0) {
                    console.log(`任务完成`);
                } else {                        
                    console.log(`${rwdt.msg}`);
                }                           
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)       
    })
}

//监控日报
async function jkrb(timeout = 0){
    return new Promise((resolve) => {                   
        let url = {
            url: `https://aiqicha.baidu.com/zxcenter/monitorDailyReportListAjax?page=1&size=10`,
            headers: headers,
        }
        $.get(url, async (err, resp, data) => {
            try {
                rwdt = JSON.parse(data)
                let list = rwdt.data.list
                if (list) {
                    for (p = 0; p < 2 && p < list.length; p++) {
                        await aqczrw(`zxcenter/monitorDailyReportDetailAjax?reportdate=${list[p].reportDate}`);
                      }
                }                         
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)       
    })

}


async function fxhy(timeout = 0) {
    return new Promise((resolve) => {                   
        let url = {
            url: `https://aiqicha.baidu.com/usercenter/getShareUrlAjax`,
            headers: headers,
        }
        $.get(url, async (err, resp, data) => {
            try {
                rwdt = JSON.parse(data)
                uid = rwdt.data.match(/uid=(.+)/);
                if (uid) {
                    uid = uid[1];
                    headers["cookie"] = "";
                    let time = Date.now();
                    headers["referer"] = "https://" + rwdt.data + "&VNK=" + time;
                    headers["Zx-Open-Url"] = "https://" + rwdt.data + "&VNK=" + time;
                    await aqczrw(`m/?uid=${uid}`);
                    await aqczrw(`m/getuserinfoAjax?uid=${uid}`);
                    headers.cookie = `${aiqichd}`;
                }                         
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)       
    })
}


//查询爱豆
async function cxad(timeout = 0) {
    return new Promise((resolve) => {                   
        let url = {
            url: `https://aiqicha.baidu.com/usercenter/getScoreRankListAjax?type=1`,
            headers: headers,
        }
        $.get(url, async (err, resp, data) => {
            try {
                rwdt = JSON.parse(data)
                console.log(`账号【${rwdt.data[3].userName}】:共有${rwdt.data[3].score}爱豆`);                         
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)       
    })
}



async function aqczhs(timeout = 0) {                 //最终执行的总函数
    return new Promise((resolve) => {                   
        let url = {
            url: `https://aiqicha.baidu.com/m/getuserinfoAjax`,
            headers: headers,
        }
        $.get(url, async (err, resp, data) => {
            try {
                zhsdata = JSON.parse(data)
                if(zhsdata.data.isLogin == 1){

                    await aqccxrw()
                    await $.wait(2000)
                    console.log(`第${$.index}个账号开始任务`);
                    await kzrw()
                    await kzrw()
                    await $.wait(3000)
                    ytaskList = [];
                    taskList = [];
                    claimList = [];
                    alltaskList = [];
                    await aqccxrw()
                    await $.wait(3000)
                    await lqad()
                    await $wait(3000)
                    console.log(`查询第${$.index}个账号现有爱豆`);
                    await cxad()
                    console.log(`账号【${zhsdata.data.userName}】:共有${zdzs.data.consume}爱豆`);
                }                        
            } catch (e) {
            } finally {
                resolve()
            }
        }, timeout)       
    })
}


function message() {
    if(aqctz == 1){
        $.msg($.name,``,$.message)}
    }


//env模块    不要动  
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
