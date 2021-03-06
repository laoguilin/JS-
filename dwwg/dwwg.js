/*
2021.09.28完成

软件名称：  动物王国
注册登录链接：http://fapp.jnxy.shop/member/reg.php?t=17376208117
微信二维码：https://raw.githubusercontent.com/laoguilin/JS-/main/img/Screenshot_20210930-212634.png
收益：  每天签到2毛，其它收益未知
注意事项 ： 运行js时不要打开软件app

获取ck：  扫码登陆即可获取ck 

支持QX,v2p自动获取ck
QX重写
[rewrite_local]
http://fapp.jnxy.shop/member/bin.php? url script-request-header https://raw.githubusercontent.com/laoguilin/JS-/main/dwwg/dwwg.js

v2p重写
匹配链接（正则表达式）：http://fapp.jnxy.shop/member/bin.php?
对应重写目标：https://raw.githubusercontent.com/laoguilin/JS-/main/dwwg/dwwg.js

MITM添加域名
hostname = fapp.jnxy.shop

[task_local]
自行设定时间，每天运行一次即可

支持多账号：多账号设置请到boxjs里设置好需要抓取第几个账号后，微信扫码登陆即可获取ck
boxjs订阅地址：https://raw.githubusercontent.com/laoguilin/JS-/main/chyu/lgl.boxjs.json

*/

const $ = new Env('动物王国');
let status;

status = (status = ($.getval("dwwgstatus") || "1")) > 1 ? `${status}` : "";

const dwwgurlArr = [], dwwghdArr = [], dwwgcount = ''

let dwwgurl = $.getdata('dwwgurl')
let dwwghd = $.getdata('dwwghd')
let dwwgtz = ($.getval('dwwgtz') || '1'); //通知
$.message = ''
!(async () => {
    if (typeof $request !== "undefined") {

        dwwgck()

    } else {
        dwwgurlArr.push($.getdata('dwwgurl'))
        dwwghdArr.push($.getdata('dwwghd'))

        let dwwgcount = ($.getval('dwwgcount') || '1');

        for (let i = 2; i <= dwwgcount; i++) {

            dwwgurlArr.push($.getdata(`dwwgurl${i}`))
            dwwghdArr.push($.getdata(`dwwghd${i}`))

        }

        console.log(
            `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() +
                new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000
            ).toLocaleString()} ===============================================\n`);
        console.log(`共检测到${dwwgurlArr.length}个账号`);

        for (let i = 0; i < dwwgurlArr.length; i++) {

            if (dwwgurlArr[i]) {

                dwwgurl = dwwgurlArr[i];
                dwwghd = dwwghdArr[i];

                $.index = i + 1;
                console.log(`\n开始【动物王国第${$.index}个账号签到】`)

                    await dwwgqd()
                    await $.wait(5000)

            }
        }
    }
})()

    .catch((e) => $.logErr(e))
    .finally(() => $.done())

function dwwgck() {
    if ($request.url.indexOf("login") > -1 && $request.url.indexOf("username=") > -1 && JSON.stringify($request.headers).indexOf("Cookie") >= 1) {
        const dwwgurl = $request.url
        if (dwwgurl) $.setdata(dwwgurl, `dwwgurl${status}`)
        $.log(dwwgurl)

        const dwwghd = JSON.stringify($request.headers)
        if(dwwghd)    $.setdata(dwwghd,`dwwghd${status}`)
        $.log(dwwghd)

        $.msg($.name, "", `动物王国${status}Cookie获取成功`)

    }
}

function dwwgqd(timeout = 0) {
    return new Promise((resolve) => {

        username = dwwgurl.split('username=')[1].split('&')[0]
        ck = JSON.stringify(dwwghd.split('Cookie":"')[1].split('"')[0])

        let url = {
            url: `http://fapp.jnxy.shop/member/bin.php?act=setSign&h_username=${username}&h_point1=0`,
            headers: {"Cookie":`${ck}`},
        }

        $.get(url, async (err, resp, data) => {
            try {

                data = JSON.stringify(resp)
                data = data.split('body":"')[1].split(`"`)[0]
                //console.log(`【签到】：${data} \n`)
                $.message = `【第${$.index}个号】签到：${data} \n`
                message()
                await $.wait(3000)
                console.log(`开始检测金币余额\n`);
                await dwwgye()
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}

function dwwgye(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `http://fapp.jnxy.shop/member/tuiguang1.php`,
            headers: {"Cookie":`${ck}`},
        }

        $.get(url, async (err, resp, data) => {
            try {

                data = JSON.stringify(resp)
            
                data = data.split('<span>金币余额(元)<small>')[1].split(`</small>`)[0]
                console.log(`【金币余额】： ${data} 元 \n`)
                if(data >= 1.1){
                    await $.wait(3000)
                    console.log(`检测【第${$.index}个号】：达到最低提现额度，开始自动提现\n`);
                    $.message = `检测【第${$.index}个号】：达到最低提现额度，开始自动提现\n`
                    message()
                    dwwgtx()
                }else{

                    console.log(`检测【第${$.index}个号】：余额不足，不进行自动提现\n`);
                    $.message = `检测【第${$.index}个号】：余额不足，不进行自动提现`
                    message()
                }


            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}

function dwwgtx(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `http://fapp.jnxy.shop/member/bin.php?act=point2_withdraw&num=1.1&alipayUserName=undefined&alipayFullName=undefined`,
            headers: {"Cookie":`${ck}`},
        }

        $.get(url, async (err, resp, data) => {
            try {

                data = JSON.stringify(resp)
                data = data.split('body":"')[1].split(`"`)[0]
                console.log(data)
                $.message = (`【第${$.index}个号提现】：${data}`)
                message()
            } catch (e) {

            } finally {

                resolve()
            }
        }, timeout)
    })
}


function message() {
    if(dwwgtz == 1){
        $.msg($.name,``,$.message)}
    }




//env模块    不要动  
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
