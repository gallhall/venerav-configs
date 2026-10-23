class PixivToken extends ComicSource {
    name = "Pixiv"
    key = "pixiv_token"
    version = "0.3.35"
    minAppVersion = "2.0.0"
    url = ""

    get oauthUrl() {
        return "https://oauth.secure.pixiv.net/auth/token"
    }

    get apiUrl() {
        return "https://app-api.pixiv.net"
    }

    get clientId() {
        return String(this.loadSetting("clientId") || "").trim()
    }

    get clientSecret() {
        return String(this.loadSetting("clientSecret") || "").trim()
    }

    get hashSalt() {
        return String(this.loadSetting("hashSalt") || "").trim()
    }

    get userAgent() {
        return "PixivAndroidApp/5.0.234 (Android 11; Venera)"
    }

    get imageUserAgent() {
        return "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"
    }

    get imageHeaders() {
        return {
            "Referer": "https://www.pixiv.net/",
            "User-Agent": this.imageUserAgent,
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        }
    }

    get defaultHeaders() {
        return {
            "User-Agent": this.userAgent,
            "Accept-Language": "zh-CN",
            "App-OS": "android",
            "App-OS-Version": "11",
            "App-Version": "5.0.234",
            "Referer": "https://app-api.pixiv.net/",
        }
    }

    mergeHeaders(headers) {
        return Object.assign({}, this.defaultHeaders, headers || {})
    }

    md5(input) {
        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t))
            return add32((a << s) | (a >>> (32 - s)), b)
        }
        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t)
        }
        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t)
        }
        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t)
        }
        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t)
        }
        function md5cycle(x, k) {
            let a = x[0], b = x[1], c = x[2], d = x[3]

            a = ff(a, b, c, d, k[0], 7, -680876936)
            d = ff(d, a, b, c, k[1], 12, -389564586)
            c = ff(c, d, a, b, k[2], 17, 606105819)
            b = ff(b, c, d, a, k[3], 22, -1044525330)
            a = ff(a, b, c, d, k[4], 7, -176418897)
            d = ff(d, a, b, c, k[5], 12, 1200080426)
            c = ff(c, d, a, b, k[6], 17, -1473231341)
            b = ff(b, c, d, a, k[7], 22, -45705983)
            a = ff(a, b, c, d, k[8], 7, 1770035416)
            d = ff(d, a, b, c, k[9], 12, -1958414417)
            c = ff(c, d, a, b, k[10], 17, -42063)
            b = ff(b, c, d, a, k[11], 22, -1990404162)
            a = ff(a, b, c, d, k[12], 7, 1804603682)
            d = ff(d, a, b, c, k[13], 12, -40341101)
            c = ff(c, d, a, b, k[14], 17, -1502002290)
            b = ff(b, c, d, a, k[15], 22, 1236535329)

            a = gg(a, b, c, d, k[1], 5, -165796510)
            d = gg(d, a, b, c, k[6], 9, -1069501632)
            c = gg(c, d, a, b, k[11], 14, 643717713)
            b = gg(b, c, d, a, k[0], 20, -373897302)
            a = gg(a, b, c, d, k[5], 5, -701558691)
            d = gg(d, a, b, c, k[10], 9, 38016083)
            c = gg(c, d, a, b, k[15], 14, -660478335)
            b = gg(b, c, d, a, k[4], 20, -405537848)
            a = gg(a, b, c, d, k[9], 5, 568446438)
            d = gg(d, a, b, c, k[14], 9, -1019803690)
            c = gg(c, d, a, b, k[3], 14, -187363961)
            b = gg(b, c, d, a, k[8], 20, 1163531501)
            a = gg(a, b, c, d, k[13], 5, -1444681467)
            d = gg(d, a, b, c, k[2], 9, -51403784)
            c = gg(c, d, a, b, k[7], 14, 1735328473)
            b = gg(b, c, d, a, k[12], 20, -1926607734)

            a = hh(a, b, c, d, k[5], 4, -378558)
            d = hh(d, a, b, c, k[8], 11, -2022574463)
            c = hh(c, d, a, b, k[11], 16, 1839030562)
            b = hh(b, c, d, a, k[14], 23, -35309556)
            a = hh(a, b, c, d, k[1], 4, -1530992060)
            d = hh(d, a, b, c, k[4], 11, 1272893353)
            c = hh(c, d, a, b, k[7], 16, -155497632)
            b = hh(b, c, d, a, k[10], 23, -1094730640)
            a = hh(a, b, c, d, k[13], 4, 681279174)
            d = hh(d, a, b, c, k[0], 11, -358537222)
            c = hh(c, d, a, b, k[3], 16, -722521979)
            b = hh(b, c, d, a, k[6], 23, 76029189)
            a = hh(a, b, c, d, k[9], 4, -640364487)
            d = hh(d, a, b, c, k[12], 11, -421815835)
            c = hh(c, d, a, b, k[15], 16, 530742520)
            b = hh(b, c, d, a, k[2], 23, -995338651)

            a = ii(a, b, c, d, k[0], 6, -198630844)
            d = ii(d, a, b, c, k[7], 10, 1126891415)
            c = ii(c, d, a, b, k[14], 15, -1416354905)
            b = ii(b, c, d, a, k[5], 21, -57434055)
            a = ii(a, b, c, d, k[12], 6, 1700485571)
            d = ii(d, a, b, c, k[3], 10, -1894986606)
            c = ii(c, d, a, b, k[10], 15, -1051523)
            b = ii(b, c, d, a, k[1], 21, -2054922799)
            a = ii(a, b, c, d, k[8], 6, 1873313359)
            d = ii(d, a, b, c, k[15], 10, -30611744)
            c = ii(c, d, a, b, k[6], 15, -1560198380)
            b = ii(b, c, d, a, k[13], 21, 1309151649)
            a = ii(a, b, c, d, k[4], 6, -145523070)
            d = ii(d, a, b, c, k[11], 10, -1120210379)
            c = ii(c, d, a, b, k[2], 15, 718787259)
            b = ii(b, c, d, a, k[9], 21, -343485551)

            x[0] = add32(a, x[0])
            x[1] = add32(b, x[1])
            x[2] = add32(c, x[2])
            x[3] = add32(d, x[3])
        }
        function md5blk(s) {
            let md5blks = []
            for (let i = 0; i < 64; i += 4) {
                md5blks[i >> 2] =
                    s.charCodeAt(i) +
                    (s.charCodeAt(i + 1) << 8) +
                    (s.charCodeAt(i + 2) << 16) +
                    (s.charCodeAt(i + 3) << 24)
            }
            return md5blks
        }
        function md51(s) {
            let n = s.length
            let state = [1732584193, -271733879, -1732584194, 271733878]
            let i
            for (i = 64; i <= n; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)))
            }
            s = s.substring(i - 64)
            let tail = new Array(16).fill(0)
            for (i = 0; i < s.length; i++) {
                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3)
            }
            tail[i >> 2] |= 0x80 << ((i % 4) << 3)
            if (i > 55) {
                md5cycle(state, tail)
                tail = new Array(16).fill(0)
            }
            tail[14] = n * 8
            md5cycle(state, tail)
            return state
        }
        function rhex(n) {
            let s = ""
            for (let j = 0; j < 4; j++) {
                s += ("0" + ((n >> (j * 8 + 4)) & 0x0f).toString(16)).slice(-1) +
                     ("0" + ((n >> (j * 8)) & 0x0f).toString(16)).slice(-1)
            }
            return s
        }
        function hex(x) {
            return x.map(rhex).join("")
        }
        function add32(a, b) {
            return (a + b) & 0xffffffff
        }
        return hex(md51(unescape(encodeURIComponent(input))))
    }

    nowIso() {
        return new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00")
    }

    createClientHash(time) {
        return this.md5(time + this.hashSalt)
    }

    buildAuthHeaders() {
        let time = this.nowIso()
        return this.mergeHeaders({
            "X-Client-Time": time,
            "X-Client-Hash": this.createClientHash(time),
        })
    }

    buildApiHeaders(accessToken) {
        let time = this.nowIso()
        let headers = this.mergeHeaders({
            "X-Client-Time": time,
            "X-Client-Hash": this.createClientHash(time),
        })
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`
        }
        return headers
    }

    get settingAccessToken() {
        return String(this.loadSetting("accessToken") || "").trim()
    }

    get settingRefreshToken() {
        return String(this.loadSetting("refreshToken") || "").trim()
    }

    get accessToken() {
        return this.loadData("access_token") || this.settingAccessToken || ""
    }

    get refreshToken() {
        return this.loadData("refresh_token") || this.settingRefreshToken || ""
    }

    get isLogged() {
        return !!(this.accessToken || this.refreshToken)
    }

    // 兼容：loadFollow 等处用了 isLoggedIn
    get isLoggedIn() {
        return this.isLogged
    }

    saveTokens(data) {
        this.saveData("access_token", data.access_token || "")
        if (data.refresh_token) this.saveData("refresh_token", data.refresh_token)
        this.saveData("user_id", String(data.user?.id || ""))
        this.saveData("user_name", data.user?.name || "")
        this.saveData("token_time", String(Date.now()))
    }

    async postForm(url, headers, form) {
        let body = Object.keys(form)
            .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(form[k])}`)
            .join("&")

        let res = await Network.post(
            url,
            Object.assign({}, headers, {
                "Content-Type": "application/x-www-form-urlencoded",
            }),
            body
        )

        if (res.status !== 200) {
            throw `Invalid Status Code ${res.status}: ${res.body || ""}`
        }
        return res
    }

    async refreshAccessToken() {
        let rt = this.refreshToken
        if (!rt) {
            let at = this.accessToken
            if (at) return at
            throw "Not logged in: refresh_token is empty"
        }
        if (!this.clientId || !this.clientSecret || !this.hashSalt) {
            throw "请先在源设置填写 clientId、clientSecret、hashSalt"
        }

        let res = await this.postForm(
            this.oauthUrl,
            this.buildAuthHeaders(),
            {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "refresh_token",
                refresh_token: rt,
                include_policy: "true",
            }
        )

        let json = JSON.parse(res.body)
        if (!json.access_token) {
            throw "Failed to refresh token"
        }

        this.saveTokens(json)
        return json.access_token
    }

    async manualRefreshAccessToken() {
        try {
            let token = await this.refreshAccessToken()
            if (!token) {
                UI.showMessage("刷新失败：没有拿到 access_token")
                return false
            }

            UI.showMessage("access_token 已刷新")
            return true
        } catch (e) {
            UI.showDialog(
                "刷新 access_token 失败",
                "refresh_token 刷新 access_token 失败。\n\n请检查 refresh_token 是否正确。\n\n原始错误：\n" + String(e),
                [{ text: "OK", callback: () => {} }]
            )
            return false
        }
    }

    async ensureAccessToken() {
        let token = this.accessToken
        // access_token 约 1 小时有效；超过 50 分钟主动刷新，减少 401
        if (token) {
            let t = Number(this.loadData("token_time") || 0)
            if (t > 0 && Date.now() - t < 50 * 60 * 1000) {
                return token
            }
            if (this.refreshToken) {
                try {
                    return await this.refreshAccessToken()
                } catch (_) {
                    return token
                }
            }
            return token
        }
        return await this.refreshAccessToken()
    }

    async apiGet(path, query) {
        let qs = ""
        if (query) {
            let arr = []
            for (let k in query) {
                if (query[k] !== undefined && query[k] !== null && query[k] !== "") {
                    arr.push(`${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
                }
            }
            if (arr.length > 0) qs = "?" + arr.join("&")
        }

        let url = `${this.apiUrl}${path}${qs}`
        return await this.apiGetByUrl(url)
    }

    async apiGetByUrl(url) {
        let token = await this.ensureAccessToken()
        let res = await Network.get(url, this.buildApiHeaders(token))

        if (
            res.status === 400 &&
            String(res.body || "").indexOf("invalid_grant") >= 0
        ) {
            token = await this.refreshAccessToken()
            res = await Network.get(url, this.buildApiHeaders(token))
        }

        if (res.status === 401) {
            token = await this.refreshAccessToken()
            res = await Network.get(url, this.buildApiHeaders(token))
        }

        if (res.status !== 200) {
            throw `Invalid Status Code ${res.status}: ${res.body || ""}`
        }

        return JSON.parse(res.body)
    }

    async apiPost(path, form) {
        let token = await this.ensureAccessToken()
        let url = `${this.apiUrl}${path}`
        let res = await this.postForm(url, this.buildApiHeaders(token), form || {})

        if (
            res.status === 400 &&
            String(res.body || "").indexOf("invalid_grant") >= 0
        ) {
            token = await this.refreshAccessToken()
            res = await this.postForm(url, this.buildApiHeaders(token), form || {})
        }
        if (res.status === 401) {
            token = await this.refreshAccessToken()
            res = await this.postForm(url, this.buildApiHeaders(token), form || {})
        }
        if (res.status !== 200 && res.status !== 204) {
            throw `Invalid Status Code ${res.status}: ${res.body || ""}`
        }
        if (!res.body) return {}
        try {
            return JSON.parse(res.body)
        } catch (_) {
            return {}
        }
    }

    async getSelfUserId() {
        let uid = String(this.loadData("user_id") || "").trim()
        if (uid) return uid
        // 没有缓存时强制刷一次 token，saveTokens 会写入 user_id
        await this.refreshAccessToken()
        uid = String(this.loadData("user_id") || "").trim()
        if (!uid) throw "无法获取当前用户 ID，请重新配置 Token"
        return uid
    }

    normalizeImageUrl(url) {
        if (!url) return ""
        return String(url).replace(/\\/g, "")
    }

    /**
     * ugoira 静态预览（缩略图 / 官方协议失败时回退）
     */
    collectUgoiraStaticUrls(illust) {
        let urls = []
        let push = (u) => {
            u = this.normalizeImageUrl(u)
            if (u && urls.indexOf(u) < 0) urls.push(u)
        }
        push(illust.image_urls?.large)
        push(illust.image_urls?.medium)
        push(illust.meta_single_page?.original_image_url)
        push(illust.image_urls?.square_medium)
        return urls
    }

    /**
     * Pixiv App API ugoira 元数据
     * 返回 { zipUrl, frames: [{file, delay}, ...] }
     */
    async getUgoiraMeta(illustId) {
        let data = await this.apiGet("/v1/ugoira/metadata", {
            illust_id: String(illustId),
        })
        let ug = data.ugoira_metadata || data
        let zipUrls = ug.zip_urls || {}
        let zipUrl =
            this.normalizeImageUrl(zipUrls.medium) ||
            this.normalizeImageUrl(zipUrls.original) ||
            this.normalizeImageUrl(zipUrls["ugoira1920x1080"]) ||
            this.normalizeImageUrl(zipUrls["ugoira600x600"]) ||
            ""
        let frames = ug.frames || []
        if (!zipUrl) throw "无法获取 ugoira zip 地址"
        if (!frames.length) throw "ugoira 没有帧信息"
        return { zipUrl, frames }
    }

    async searchUser(word) {
        let data = await this.apiGet("/v1/search/user", {
            word: word,
            filter: "for_android",
        })
        return data.user_previews || []
    }

    artworkToComic(item) {
        let id = String(item.id || "")
        let title = item.title || "Untitled"
        let userName = item.user?.name || ""
        let userId = String(item.user?.id || "")
        let pageCount = Number(item.page_count || 1)

        let cover =
            this.normalizeImageUrl(item.image_urls?.large) ||
            this.normalizeImageUrl(item.image_urls?.medium) ||
            this.normalizeImageUrl(item.image_urls?.square_medium)

        return new Comic({
            id: id,
            title: title,
            subtitle: pageCount > 1 ? `${pageCount}P` : "",
            subTitle: userName,
            cover: cover,
            description: userId ? `作者：${userName} / ${userId}` : `作者：${userName}`,
        })
    }

    /**
     * 将 Pixiv 评论转为 Venera Comment。
     * 贴纸评论 comment 文本为空，需用 stamp.stamp_url 显示。
     */
    mapPixivComment(c) {
        let text = String(c.comment || "").trim()
        let stampUrl =
            c.stamp?.stamp_url ||
            c.stamp?.url ||
            ""
        let content = text
        if (!content && stampUrl) {
            content = `<img src="${stampUrl}"/>`
        } else if (content && stampUrl) {
            content = `${content}<br/><img src="${stampUrl}"/>`
        }
        if (!content) {
            content = "[表情]"
        }

        let time = c.date || c.commentDate || ""
        if (typeof time === "string" && time.indexOf("+") >= 0) {
            time = time.replace(/\+\d{2}:\d{2}$/, "").replace("T", " ")
        }

        return {
            userName: c.user?.name || c.userName || "anonymous",
            avatar:
                c.user?.profile_image_urls?.medium ||
                c.img ||
                "",
            content: content,
            time: time,
            id: String(c.id || ""),
            replyCount: c.has_replies || c.hasReplies ? 1 : 0,
        }
    }

    /**
     * Pixiv caption 常带 HTML（br/a/strong 等），Venera 描述区按纯文本显示，
     * 这里转成可读纯文本：换行、链接保留文字与 URL。
     */
    htmlToPlainText(html) {
        if (!html) return ""
        let s = String(html)
        // 统一换行
        s = s.replace(/<\s*br\s*\/?\s*>/gi, "\n")
        s = s.replace(/<\/\s*p\s*>/gi, "\n")
        s = s.replace(/<\s*p[^>]*>/gi, "")
        // <a href="url">text</a> → text (url) 或仅 url
        s = s.replace(/<\s*a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\s*\/\s*a\s*>/gi, (m, href, text) => {
            let t = String(text || "").replace(/<[^>]+>/g, "").trim()
            let h = String(href || "").trim()
            if (t && h && t !== h) return `${t} (${h})`
            return t || h
        })
        // 去掉其余标签
        s = s.replace(/<[^>]+>/g, "")
        // HTML 实体（含 &#44; 这类数字实体）
        s = s
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'")
            .replace(/&apos;/gi, "'")
            .replace(/&#(\d+);/g, (m, code) => {
                try {
                    return String.fromCharCode(Number(code))
                } catch (_) {
                    return m
                }
            })
            .replace(/&#x([0-9a-fA-F]+);/g, (m, code) => {
                try {
                    return String.fromCharCode(parseInt(code, 16))
                } catch (_) {
                    return m
                }
            })
        // 多余空行压成最多两个换行
        s = s.replace(/\n{3,}/g, "\n\n")
        return s.trim()
    }

    // 网络收藏要求「已登录」。本源用 Token，必须在账号里点一次登录。
    account = {
        login: async (account, pwd) => {
            // 密码框可直接粘贴 refresh_token
            let pasted = String(pwd || "").trim()
            if (pasted.length > 20) {
                this.saveData("refresh_token", pasted)
            }
            // 账号框若像 token 也接受
            let acc = String(account || "").trim()
            if (acc.length > 20 && !this.loadData("refresh_token")) {
                this.saveData("refresh_token", acc)
            }
            // 同步源设置里的 token
            let setAt = this.settingAccessToken
            let setRt = this.settingRefreshToken
            if (setAt) this.saveData("access_token", setAt)
            if (setRt) this.saveData("refresh_token", setRt)

            if (!this.refreshToken && !this.accessToken) {
                throw "请先在源设置填写 refresh_token，或在登录密码框粘贴 refresh_token"
            }

            await this.ensureAccessToken()
            return "ok"
        },
        logout: async () => {
            this.saveData("access_token", "")
            this.saveData("refresh_token", "")
            this.saveData("user_id", "")
        },
        registerWebsite: null,
    }

    async init() {
        let at = this.settingAccessToken
        if (at && !this.loadData("access_token")) {
            this.saveData("access_token", at)
        }

        let rt = this.settingRefreshToken
        if (rt && !this.loadData("refresh_token")) {
            this.saveData("refresh_token", rt)
        }
    }

    explainToken() {
        UI.showDialog(
            "Pixiv Token 说明",
            "填写 refresh_token 后可以点击刷新 access_token。\n\n也可以同时填写 access_token 和 refresh_token。",
            [{ text: "OK", callback: () => {} }]
        )
    }

    explore = [
        {
            title: "Pixiv 推荐",
            type: "multiPageComicList",
            load: async (page) => {
                let data = await this.apiGet("/v1/illust/recommended", {
                    include_ranking_illusts: "true",
                    filter: "for_android",
                    offset: (page || 0) * 30,
                })

                let illusts = data.illusts || []
                let hasNext = !!(data.next_url) && illusts.length > 0
                return {
                    comics: illusts.map(e => this.artworkToComic(e)),
                    maxPage: hasNext ? (Number(page || 0) + 2) : Math.max(1, Number(page || 0) + 1),
                }
            }
        },
        {
            title: "Pixiv R18 日榜",
            type: "multiPageComicList",
            load: async (page) => {
                return await this.loadRanking("day_r18", page)
            }
        },
        {
            title: "Pixiv R18 周榜",
            type: "multiPageComicList",
            load: async (page) => {
                return await this.loadRanking("week_r18", page)
            }
        }
    ]

    getRankingPage(mode, page) {
    let lastMode = this.loadData("ranking_last_mode") || ""
    let savedPage = Number(this.loadData("ranking_page") || 0)
    let appPage = Number(page || 0)

    if (lastMode !== mode) {
        this.saveData("ranking_last_mode", mode)
        this.saveData("ranking_page", "0")
        return 0
    }

    if (appPage <= 0) {
        this.saveData("ranking_page", "0")
        return 0
    }

    if (appPage > savedPage + 1) {
        this.saveData("ranking_page", String(savedPage + 1))
        return savedPage + 1
    }

    this.saveData("ranking_page", String(appPage))
    return appPage
}

    async loadRanking(mode, page) {
        let fixedPage = this.getRankingPage(mode, page)

        let data = await this.apiGet("/v1/illust/ranking", {
            mode: mode,
            filter: "for_android",
            offset: fixedPage * 30,
        })

        let illusts = data.illusts || []
        let hasNext = !!(data.next_url) && illusts.length > 0
        // 不再写死 999999，避免排行榜无限空翻页
        return {
            comics: illusts.map(e => this.artworkToComic(e)),
            maxPage: hasNext ? fixedPage + 2 : Math.max(1, fixedPage + 1),
        }
    }

    /**
     * 加载指定用户的全部作品（插画 + 漫画）。
     * 不传 type，接口会返回 illust / manga。
     * 分页跟随 Pixiv 返回的 next_url，避免固定 offset 漏页/重复。
     */
    async loadUserIllusts(userId, page) {
        userId = String(userId || "")
        if (!userId) {
            return { comics: [], maxPage: 0 }
        }

        let reqPage = Number(page || 0)
        let lastUserId = this.loadData("user_illusts_last_id") || ""
        let savedPage = Number(this.loadData("user_illusts_page") || 0)
        let nextUrl = this.loadData("user_illusts_next") || ""

        // Venera 的 page 可能是 0 基或 1 基：
        // - 换作者
        // - page 为 0
        // - page 为 1 且当前没有 next_url（重新搜索/回到列表开头）
        // 以上都当作第一页重新拉取
        let isFirst =
            lastUserId !== userId ||
            reqPage <= 0 ||
            (reqPage === 1 && !nextUrl)

        if (isFirst) {
            this.saveData("user_illusts_last_id", userId)
            this.saveData("user_illusts_page", "0")
            this.saveData("user_illusts_next", "")
            nextUrl = ""
            reqPage = 0
        } else if (reqPage > savedPage + 1) {
            // 强制顺序翻页，防止跳页导致 next_url 对不上
            reqPage = savedPage + 1
        }

        // 非首页且没有 next_url：已经翻完，返回空，绝不回退请求第一页
        if (reqPage > 0 && !nextUrl) {
            return {
                comics: [],
                maxPage: Math.max(1, savedPage + 1),
            }
        }

        let data
        if (reqPage === 0 || !nextUrl) {
            // 不传 type：同时拿插画和漫画
            data = await this.apiGet("/v1/user/illusts", {
                user_id: userId,
                filter: "for_android",
            })
        } else {
            data = await this.apiGetByUrl(nextUrl)
        }

        let illusts = data.illusts || []
        let newNext = data.next_url || ""

        // 本页没有作品，视为真正结束
        if (illusts.length === 0) {
            this.saveData("user_illusts_next", "")
            this.saveData("user_illusts_page", String(Math.max(0, reqPage > 0 ? reqPage - 1 : 0)))
            return {
                comics: [],
                maxPage: Math.max(1, reqPage),
            }
        }

        let hasMore = !!newNext
        this.saveData("user_illusts_next", hasMore ? newNext : "")
        this.saveData("user_illusts_page", String(reqPage === 0 ? 0 : savedPage + 1))

        // maxPage 兼容 0/1 基：有下一页时多开放一页
        let currentIndex = reqPage === 0 ? 0 : savedPage + 1
        return {
            comics: illusts.map(e => this.artworkToComic(e)),
            maxPage: hasMore ? currentIndex + 2 : currentIndex + 1,
        }
    }

    category = {
        title: "Pixiv",
        parts: [
            {
                name: "快捷搜索",
                type: "fixed",
                categories: ["插画", "漫画", "风景", "原创", "角色设计"],
                itemType: "search",
            },
            {
                name: "排行榜",
                type: "fixed",
                categories: [
                    "day-日榜",
                    "week-周榜",
                    "month-月榜",
                    "day_manga-漫画日榜",
                    "week_manga-漫画周榜",
                    "month_manga-漫画月榜",
                    "day_r18-R18日榜",
                    "week_r18-R18周榜",
                    "week_r18g-R18G周榜",
                ],
                itemType: "category",
            }
        ],
        enableRankingPage: true,
    }

    categoryComics = {
        load: async (category, param, options, page) => {
            if (param === "author") {
                return await this.loadUserIllusts(category, page)
            }

            // 点「作者」名字：先搜用户再进作品列表
            if (param === "author_name") {
                let name = String(category || "").trim()
                if (!name) return { comics: [], maxPage: 0 }
                let previews = []
                try {
                    previews = await this.searchUser(name)
                } catch (e) {
                    throw "搜索作者失败：" + String(e)
                }
                let userId = ""
                if (previews.length) {
                    let exact = previews.find(p => {
                        let n = String(p.user?.name || "")
                        let a = String(p.user?.account || "")
                        return n === name || a === name ||
                            n.toLowerCase() === name.toLowerCase() ||
                            a.toLowerCase() === name.toLowerCase()
                    })
                    userId = String((exact || previews[0]).user.id)
                } else if (/^\d+$/.test(name)) {
                    userId = name
                } else {
                    throw "未找到作者：" + name
                }
                // 新作者时重置分页缓存
                this.saveData("user_illusts_next", "")
                this.saveData("user_illusts_page", "0")
                this.saveData("user_illusts_last_id", "")
                return await this.loadUserIllusts(userId, page)
            }

            // 点「关注」标签：切换关注状态
            if (param === "follow_toggle") {
                let uid = String(category || "").trim()
                if (!uid || !/^\d+$/.test(uid)) {
                    throw "无效的作者 ID"
                }
                let followed = false
                try {
                    let detail = await this.apiGet("/v1/user/detail", {
                        user_id: uid,
                        filter: "for_android",
                    })
                    followed = !!(detail.user?.is_followed)
                } catch (_) {}
                if (followed) {
                    await this.apiPost("/v1/user/follow/delete", {
                        user_id: uid,
                    })
                    try { UI.showMessage("已取消关注") } catch (_) {}
                } else {
                    await this.apiPost("/v1/user/follow/add", {
                        user_id: uid,
                        restrict: "public",
                    })
                    try { UI.showMessage("已关注") } catch (_) {}
                }
                // 清空关注夹缓存（若有）
                this.saveData("following_folders_cache", "")
                this.saveData("following_folders_cache_time", "0")
                return { comics: [], maxPage: 0 }
            }

            let rankingModes = [
                "day",
                "week",
                "month",
                "day_manga",
                "week_manga",
                "month_manga",
                "day_r18",
                "week_r18",
                "week_r18g",
            ]

            if (rankingModes.indexOf(category) >= 0) {
                return await this.loadRanking(category, page)
            }

            return await this.search.load(category, options, page)
        },

        ranking: {
            options: [
                "day-日榜",
                "week-周榜",
                "month-月榜",
                "day_manga-漫画日榜",
                "week_manga-漫画周榜",
                "month_manga-漫画月榜",
                "day_r18-R18日榜",
                "week_r18-R18周榜",
                "week_r18g-R18G周榜",
            ],
            load: async (option, page) => {
                return await this.loadRanking(option, page)
            }
        }
    }

    search = {
        optionList: [
            {
                options: [
                    "illust-作品搜索",
                    "user-按用户名搜索",
                ],
                label: "搜索类型",
                default: "illust",
            }
        ],
        load: async (keyword, options, page) => {
            // 选项可能是 "user" 或 "user-按用户名搜索"，统一取 - 前面一段
            let rawMode = String((options && options[0]) || "illust")
            let mode = rawMode.split("-")[0] || "illust"
            keyword = String(keyword || "").trim()

            if (mode === "user") {
                if (!keyword) {
                    return { comics: [], maxPage: 0 }
                }

                let appPage = Number(page || 0)
                let cachedKeyword = this.loadData("search_user_keyword") || ""
                let cachedUserId = this.loadData("search_user_id") || ""
                let hasNext = !!(this.loadData("user_illusts_next") || "")
                let userId = ""

                // 只有明确在翻后续页时才复用缓存的 user_id
                // 首页（page 0/1 且无 next_url）每次都重新解析，避免二次搜索失败
                let isPaging = appPage > 1 || (appPage > 0 && hasNext)
                if (isPaging && cachedKeyword === keyword && cachedUserId) {
                    userId = cachedUserId
                } else {
                    let previews = []
                    try {
                        previews = await this.searchUser(keyword)
                    } catch (e) {
                        throw "搜索作者失败：" + String(e)
                    }

                    if (previews.length) {
                        // 优先精确匹配用户名 / account，否则取第一个
                        let exact = previews.find(p => {
                            let name = String(p.user?.name || "")
                            let account = String(p.user?.account || "")
                            return name === keyword || account === keyword ||
                                name.toLowerCase() === keyword.toLowerCase() ||
                                account.toLowerCase() === keyword.toLowerCase()
                        })
                        userId = String((exact || previews[0]).user.id)
                    } else if (/^\d+$/.test(keyword)) {
                        // 搜不到人时，若输入的是纯数字，按作者 ID 直接查
                        userId = keyword
                    } else {
                        this.saveData("search_user_keyword", "")
                        this.saveData("search_user_id", "")
                        return { comics: [], maxPage: 0 }
                    }

                    this.saveData("search_user_keyword", keyword)
                    this.saveData("search_user_id", userId)
                    // 新一次搜索时清掉旧的分页状态，强制从第一页开始
                    this.saveData("user_illusts_next", "")
                    this.saveData("user_illusts_page", "0")
                    this.saveData("user_illusts_last_id", "")
                }

                return await this.loadUserIllusts(userId, appPage)
            }

            let data = await this.apiGet("/v1/search/illust", {
                word: keyword,
                search_target: "partial_match_for_tags",
                sort: "date_desc",
                filter: "for_android",
                offset: (page || 0) * 30,
            })

            return {
                comics: (data.illusts || []).map(e => this.artworkToComic(e)),
                maxPage: 999999,
            }
        }
    }

    /**
     * 关注作者列表（显示作者名，点进去看作品）
     * Pixiv: /v1/user/following
     */
    async loadFollowingUsers(page) {
        if (!this.isLoggedIn) {
            throw "请先在漫画源设置里填写 refresh_token / access_token"
        }
        let appPage = Number(page || 1)
        if (appPage <= 0) appPage = 1
        let offset = (appPage - 1) * 30
        let selfId = await this.getSelfUserId()
        let data = await this.apiGet("/v1/user/following", {
            user_id: selfId,
            restrict: "public",
            offset: offset,
        })
        // user_previews: [{ user, illusts, novels }, ...]
        let previews = data.user_previews || []
        let comics = previews.map(p => {
            let u = p.user || {}
            let uid = String(u.id || "")
            let name = u.name || u.account || uid
            let cover =
                this.normalizeImageUrl(u.profile_image_urls?.medium) ||
                this.normalizeImageUrl(p.illusts?.[0]?.image_urls?.square_medium) ||
                this.normalizeImageUrl(p.illusts?.[0]?.image_urls?.medium) ||
                ""
            return new Comic({
                id: `u:${uid}`,
                title: name,
                subTitle: u.account ? `@${u.account}` : `ID ${uid}`,
                cover: cover,
                description: `关注的作者 · ID ${uid}`,
                tags: ["作者"],
            })
        })
        let hasNext = !!(data.next_url)
        return {
            comics: comics,
            maxPage: hasNext ? appPage + 1 : Math.max(1, appPage),
        }
    }

    /**
     * 关注作者的最新作品（备用）
     */
    async loadFollowIllusts(page) {
        if (!this.isLoggedIn) {
            throw "请先在漫画源设置里填写 refresh_token / access_token"
        }
        let appPage = Number(page || 1)
        if (appPage <= 0) appPage = 1
        let offset = (appPage - 1) * 30
        let data = await this.apiGet("/v2/illust/follow", {
            restrict: "public",
            offset: offset,
        })
        let illusts = data.illusts || []
        let hasNext = !!(data.next_url)
        return {
            comics: illusts.map(e => this.artworkToComic(e)),
            maxPage: hasNext ? appPage + 1 : Math.max(1, appPage),
        }
    }

    /**
     * 我的收藏（public / private）
     */
    async loadBookmarkIllusts(page, restrict) {
        if (!this.isLoggedIn) {
            throw "请先在漫画源设置里填写 refresh_token / access_token"
        }
        let appPage = Number(page || 1)
        if (appPage <= 0) appPage = 1
        let offset = (appPage - 1) * 30
        let userId = await this.getSelfUserId()
        let data = await this.apiGet("/v1/user/bookmarks/illust", {
            user_id: userId,
            restrict: restrict === "private" ? "private" : "public",
            filter: "for_android",
            offset: offset,
        })
        let illusts = data.illusts || []
        let hasNext = !!(data.next_url) && illusts.length > 0
        return {
            comics: illusts.map(e => this.artworkToComic(e)),
            maxPage: hasNext ? appPage + 1 : Math.max(1, appPage),
        }
    }

    favorites = {
        // 多文件夹：每个关注作者一个夹 + 我的收藏
        // 点作者名 → 直接出该作者作品列表
        multiFolder: true,

        loadFolders: async (comicId) => {
            if (!this.isLoggedIn) {
                throw "Login expired"
            }
            // 固定夹放最前：关注动态、收藏；后面是关注的作者
            // 每次进入都重新拉取，关注/取关后立刻生效
            let folders = {
                follow: "关注动态",
                bookmark: "我的收藏(公开)",
                bookmark_private: "我的收藏(非公开)",
            }

            try {
                let selfId = await this.getSelfUserId()
                let offset = 0
                let guard = 0
                while (guard < 15) {
                    guard++
                    let data = await this.apiGet("/v1/user/following", {
                        user_id: selfId,
                        restrict: "public",
                        offset: offset,
                    })
                    let previews = data.user_previews || []
                    for (let p of previews) {
                        let u = p.user || {}
                        let uid = String(u.id || "")
                        if (!uid) continue
                        folders[uid] = u.name || u.account || uid
                    }
                    if (!data.next_url || previews.length === 0) break
                    offset += previews.length
                }
            } catch (e) {
                let msg = String(e || "")
                if (msg.indexOf("401") >= 0 || msg.indexOf("Login") >= 0) {
                    throw "Login expired"
                }
            }

            let favorited = []
            if (comicId && !String(comicId).startsWith("u:")) {
                try {
                    let data = await this.apiGet("/v1/illust/detail", {
                        illust_id: comicId,
                    })
                    if (data.illust?.is_bookmarked) {
                        favorited.push("bookmark")
                    }
                } catch (_) {}
            }
            return {
                folders: folders,
                favorited: favorited,
            }
        },

        addOrDelFavorite: async (comicId, folderId, isAdding) => {
            if (!this.isLoggedIn) {
                throw "Login expired"
            }
            if (String(comicId).startsWith("u:")) {
                throw "请打开具体作品后再收藏"
            }
            if (isAdding) {
                await this.apiPost("/v2/illust/bookmark/add", {
                    illust_id: String(comicId),
                    restrict: "public",
                })
            } else {
                await this.apiPost("/v1/illust/bookmark/delete", {
                    illust_id: String(comicId),
                })
            }
            return "ok"
        },

        /**
         * folder:
         *   follow = 关注动态（作品流）
         *   bookmark / bookmark_private = 收藏
         *   其它数字 = 作者 user_id → 作品列表
         */
        loadComics: async (page, folder) => {
            let folderId = folder == null ? "follow" : String(folder)
            if (folderId === "follow") {
                return await this.loadFollowIllusts(page)
            }
            if (folderId === "bookmark") {
                return await this.loadBookmarkIllusts(page, "public")
            }
            if (folderId === "bookmark_private") {
                return await this.loadBookmarkIllusts(page, "private")
            }
            return await this.loadUserIllusts(folderId, page)
        },
    }

    comic = {
        loadInfo: async (id) => {
            let sid = String(id || "")

            // 作者页：id 形如 u:123456，章节列表 = 该作者作品
            if (sid.startsWith("u:")) {
                let uid = sid.slice(2)
                let data = await this.apiGet("/v1/user/illusts", {
                    user_id: uid,
                    filter: "for_android",
                })
                let illusts = data.illusts || []
                let userName =
                    illusts[0]?.user?.name ||
                    illusts[0]?.user?.account ||
                    uid
                let cover =
                    this.normalizeImageUrl(illusts[0]?.user?.profile_image_urls?.medium) ||
                    this.normalizeImageUrl(illusts[0]?.image_urls?.square_medium) ||
                    this.normalizeImageUrl(illusts[0]?.image_urls?.medium) ||
                    ""

                // 尽量多拉几页作品进章节列表
                let all = illusts.slice()
                let nextUrl = data.next_url || ""
                let guard = 0
                while (nextUrl && guard < 5) {
                    guard++
                    let more = await this.apiGetByUrl(nextUrl)
                    let batch = more.illusts || []
                    if (!batch.length) break
                    all = all.concat(batch)
                    nextUrl = more.next_url || ""
                }

                let eps = new Map()
                for (let ill of all) {
                    let title = ill.title || String(ill.id)
                    let pc = Number(ill.page_count || 1)
                    if (pc > 1) title = `${title} (${pc}P)`
                    eps.set(String(ill.id), title)
                }
                let chapters = new Map()
                chapters.set("作品", eps)

                let tags = new Map()
                tags.set("作者ID", [uid])
                tags.set("作品数", [String(eps.size)])

                return new ComicDetails({
                    id: sid,
                    title: userName,
                    cover: cover,
                    description: `作者主页 · 共 ${eps.size} 个作品（可点章节阅读）`,
                    tags: tags,
                    chapters: chapters,
                    pages: eps.size || 1,
                    uploader: userName,
                })
            }

            let data = await this.apiGet("/v1/illust/detail", {
                illust_id: id
            })

            let illust = data.illust
            if (!illust) throw "Invalid illust data"

            let tags = new Map()
            let tagList = (illust.tags || []).map(t => t.name).filter(Boolean)
            if (tagList.length) tags.set("标签", tagList)
            if (illust.user?.name) tags.set("作者", [illust.user.name])
            if (illust.user?.id) tags.set("作者ID", [String(illust.user.id)])
            // 关注：点标签即可关注/取关（详情页无法在「继续」下加原生按钮）
            // 格式：文案#userId，点击时解析出 ID
            if (illust.user?.id) {
                let followed = !!illust.user.is_followed
                let uid = String(illust.user.id)
                let label = followed ? "已关注·点按取关" : "未关注·点按关注"
                tags.set("关注", [`${label}#${uid}`])
            }
            if (illust.type) tags.set("类型", [illust.type])
            if (illust.page_count) tags.set("页数", [String(illust.page_count)])

            let cover =
                this.normalizeImageUrl(illust.image_urls?.large) ||
                this.normalizeImageUrl(illust.image_urls?.medium) ||
                this.normalizeImageUrl(illust.image_urls?.square_medium)

            let pixivUrl = `https://www.pixiv.net/artworks/${illust.id}`
            let desc = this.htmlToPlainText(illust.caption || "")
            if (illust.type === "ugoira") {
                let tip =
                    "【动图 ugoira】App 内循环播放（需 Venera ≥ 2.0）。\n" +
                    "作品页：" + pixivUrl
                desc = desc ? (desc + "\n\n" + tip) : tip
            }

            return new ComicDetails({
                id: String(illust.id),
                title: illust.title || "Untitled",
                cover: cover,
                description: desc,
                tags: tags,
                pages: illust.page_count || 1,
                uploader: illust.user?.name || "",
                // 提供官网链接后，详情页右上角 ··· 会出现「在浏览器中打开」
                url: pixivUrl,
                // 仅详情页底部按钮显示喜欢数 / 评论数
                likesCount: Number(illust.total_bookmarks || 0),
                isLiked: !!illust.is_bookmarked,
                isFavorite: !!illust.is_bookmarked,
                commentCount: Number(illust.total_comments || 0),
                commentsCount: Number(illust.total_comments || 0),
            })
        },

        /**
         * 加载作品评论（有此函数后详情页才会显示评论按钮和数量）
         * 根评论：/v3/illust/comments
         * 回复：优先 /v2/illust/comment/replies，失败再试 /v1
         */
        loadComments: async (comicId, subId, page, replyTo) => {
            // 作者页本身没有评论
            if (String(comicId).startsWith("u:")) {
                return { comments: [], maxPage: 1 }
            }
            let offset = Math.max(0, (Number(page || 1) - 1) * 30)
            let pageNum = Number(page || 1)

            // 楼中楼回复
            if (replyTo) {
                let data = null
                let lastErr = null
                // 两个版本接口都试一下，避免 404
                for (let path of [
                    "/v2/illust/comment/replies",
                    "/v1/illust/comment/replies",
                ]) {
                    try {
                        data = await this.apiGet(path, {
                            comment_id: replyTo,
                            offset: offset,
                        })
                        break
                    } catch (e) {
                        lastErr = e
                    }
                }
                if (!data) {
                    // 不抛致命错误，返回空列表，避免整个评论页挂掉
                    return { comments: [], maxPage: pageNum }
                }
                let list = data.comments || []
                return {
                    comments: list.map(c => this.mapPixivComment(c)),
                    maxPage: data.next_url ? pageNum + 1 : pageNum,
                }
            }

            let data = await this.apiGet("/v3/illust/comments", {
                illust_id: comicId,
                offset: offset,
            })
            let list = data.comments || []
            return {
                comments: list.map(c => this.mapPixivComment(c)),
                maxPage: data.next_url ? pageNum + 1 : pageNum,
            }
        },

        loadThumbnails: async (id, next) => {
            if (next) return { thumbnails: [], next: null }
            // 作者页没有统一缩略图列表
            if (String(id).startsWith("u:")) {
                return { thumbnails: [], next: null }
            }

            let data = await this.apiGet("/v1/illust/detail", {
                illust_id: id
            })

            let illust = data.illust
            if (!illust) throw "Invalid illust data"

            // ugoira：预览用静态图（动图帧在 zip 里，阅读器无法直接播放）
            if (illust.type === "ugoira") {
                let thumbs = this.collectUgoiraStaticUrls(illust)
                return { thumbnails: thumbs, next: null }
            }

            let thumbnails = []

            if (Number(illust.page_count || 1) <= 1) {
                let one =
                    this.normalizeImageUrl(illust.image_urls?.large) ||
                    this.normalizeImageUrl(illust.image_urls?.medium)
                if (one) thumbnails.push(one)
            } else {
                let metaPages = illust.meta_pages || []
                thumbnails = metaPages.map(p =>
                    this.normalizeImageUrl(p.image_urls?.large) ||
                    this.normalizeImageUrl(p.image_urls?.medium) ||
                    this.normalizeImageUrl(p.image_urls?.square_medium)
                ).filter(Boolean)
            }

            return {
                thumbnails: thumbnails,
                next: null,
            }
        },

        loadEp: async (comicId, epId) => {
            // 作者页：章节 epId 才是真正的作品 ID
            let illustId = String(comicId).startsWith("u:") ? epId : comicId
            let data = await this.apiGet("/v1/illust/detail", {
                illust_id: illustId
            })

            let illust = data.illust
            if (!illust) throw "Invalid illust data"

            // ugoira：loadEp 只返回特殊 key，真正 zip + frames 在 onImageLoad 按官方协议返回
            if (illust.type === "ugoira") {
                return { images: [`ugoira:${illustId}`] }
            }

            // 默认 large（约 1200px）更流畅；需要原图在源设置改「阅读画质」
            let quality = String(this.loadSetting("imageQuality") || "large")
            let preferOriginal = quality === "original"

            let pickPageUrl = (pageUrls, singleOriginal) => {
                if (preferOriginal) {
                    return this.normalizeImageUrl(singleOriginal) ||
                        this.normalizeImageUrl(pageUrls?.original) ||
                        this.normalizeImageUrl(pageUrls?.large) ||
                        this.normalizeImageUrl(pageUrls?.medium)
                }
                return this.normalizeImageUrl(pageUrls?.large) ||
                    this.normalizeImageUrl(pageUrls?.medium) ||
                    this.normalizeImageUrl(pageUrls?.original) ||
                    this.normalizeImageUrl(singleOriginal)
            }

            let images = []

            if (Number(illust.page_count || 1) <= 1) {
                let one = pickPageUrl(
                    illust.image_urls,
                    illust.meta_single_page?.original_image_url
                )
                if (one) images.push(one)
            } else {
                let metaPages = illust.meta_pages || []
                images = metaPages
                    .map(p => pickPageUrl(p.image_urls, p.image_urls?.original))
                    .filter(Boolean)
            }

            return {
                images: images
            }
        },

        /**
         * Venera ≥ 2.0 官方 ugoira 协议：
         * return { url: zip地址, headers, ugoira: { frames: [{file, delay}] } }
         * App 负责下载 zip、按帧延时循环播放，并可离线缓存。
         */
        onImageLoad: async (url, comicId, epId) => {
            if (String(url).startsWith("ugoira:")) {
                let illustId = String(url).slice("ugoira:".length)
                let meta = await this.getUgoiraMeta(illustId)
                return {
                    url: meta.zipUrl,
                    method: "GET",
                    headers: this.imageHeaders,
                    // 直接把帧列表交给阅读器
                    ugoira: { frames: meta.frames },
                }
            }
            return {
                method: "GET",
                headers: this.imageHeaders,
            }
        },

        onThumbnailLoad: (url) => {
            return {
                method: "GET",
                headers: this.imageHeaders,
            }
        },

        onClickTag: (namespace, tag) => {
            if (namespace === "作者ID") {
                return {
                    action: "category",
                    keyword: tag,
                    param: "author",
                }
            }
            // 点作者名 → 按用户名找作者并列出作品
            if (namespace === "作者") {
                return {
                    action: "category",
                    keyword: tag,
                    param: "author_name",
                }
            }
            // 点「关注」：tag 为「文案#userId」
            if (namespace === "关注") {
                let uid = String(tag || "")
                let idx = uid.lastIndexOf("#")
                if (idx >= 0) uid = uid.slice(idx + 1)
                return {
                    action: "category",
                    keyword: uid,
                    param: "follow_toggle",
                }
            }

            return {
                action: "search",
                keyword: tag,
            }
        }
    }

    settings = {
        tokenHelp: {
            title: "Pixiv Token 说明",
            type: "callback",
            buttonText: "打开",
            callback: () => this.explainToken(),
        },
        refreshAccessTokenButton: {
            title: "刷新 access_token",
            type: "callback",
            buttonText: "刷新",
            callback: async () => {
                return await this.manualRefreshAccessToken()
            },
        },
        accessToken: {
            title: "access_token",
            type: "input",
            default: "",
        },
        refreshToken: {
            title: "refresh_token",
            type: "input",
            default: "",
        },
        clientId: {
            title: "clientId",
            type: "input",
            default: "",
        },
        clientSecret: {
            title: "clientSecret",
            type: "input",
            default: "",
        },
        hashSalt: {
            title: "hashSalt",
            type: "input",
            default: "",
        },
        imageQuality: {
            title: "阅读画质",
            type: "select",
            options: [
                {
                    value: "large",
                    text: "标准(更流畅，推荐)",
                },
                {
                    value: "original",
                    text: "原图(更清晰，更卡)",
                },
            ],
            default: "large",
        },
    }

    translation = {
        "zh_CN": {
            "Pixiv 推荐": "Pixiv 推荐",
            "Pixiv 日榜": "Pixiv 日榜",
            "Pixiv 周榜": "Pixiv 周榜",
            "Pixiv 月榜": "Pixiv 月榜",
            "Pixiv 漫画日榜": "Pixiv 漫画日榜",
            "Pixiv 漫画周榜": "Pixiv 漫画周榜",
            "Pixiv R18 日榜": "Pixiv R18 日榜",
            "Pixiv R18 周榜": "Pixiv R18 周榜",
            "Pixiv R18G 周榜": "Pixiv R18G 周榜",
            "快捷搜索": "快捷搜索",
            "排行榜": "排行榜",
            "日榜": "日榜",
            "周榜": "周榜",
            "月榜": "月榜",
            "漫画日榜": "漫画日榜",
            "漫画周榜": "漫画周榜",
            "漫画月榜": "漫画月榜",
            "R18日榜": "R18日榜",
            "R18周榜": "R18周榜",
            "R18G周榜": "R18G周榜",
            "Pixiv Token 说明": "Pixiv Token 说明",
            "打开": "打开",
            "刷新 access_token": "刷新 access_token",
            "刷新": "刷新",
            "作者ID": "作者ID",
            "搜索类型": "搜索类型",
            "作品搜索": "作品搜索",
            "按用户名搜索": "按用户名搜索",
        },
        "zh_TW": {
            "Pixiv 推荐": "Pixiv 推薦",
            "Pixiv 日榜": "Pixiv 日榜",
            "Pixiv 周榜": "Pixiv 週榜",
            "Pixiv 月榜": "Pixiv 月榜",
            "Pixiv 漫画日榜": "Pixiv 漫畫日榜",
            "Pixiv 漫画周榜": "Pixiv 漫畫週榜",
            "Pixiv R18 日榜": "Pixiv R18 日榜",
            "Pixiv R18 周榜": "Pixiv R18 週榜",
            "Pixiv R18G 周榜": "Pixiv R18G 週榜",
            "快捷搜索": "快捷搜尋",
            "排行榜": "排行榜",
            "日榜": "日榜",
            "周榜": "週榜",
            "月榜": "月榜",
            "漫画日榜": "漫畫日榜",
            "漫画周榜": "漫畫週榜",
            "漫画月榜": "漫畫月榜",
            "R18日榜": "R18日榜",
            "R18周榜": "R18週榜",
            "R18G周榜": "R18G週榜",
            "Pixiv Token 说明": "Pixiv Token 說明",
            "打开": "打開",
            "刷新 access_token": "刷新 access_token",
            "刷新": "刷新",
            "作者ID": "作者ID",
            "搜索类型": "搜索類型",
            "作品搜索": "作品搜尋",
            "按用户名搜索": "按用戶名搜尋",
        }
    }
}