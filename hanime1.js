/**
 * Hanime1.me 视频源 for Venera-v
 * 基于可正常显示的 v1.0.1 结构，补充分类与搜索筛选
 * H漫画 已拆到独立源 hanime1_comics.js
 * 需要 venera-v ≥ 2.0.0
 *
 * v2.0.0
 */

class Hanime1Source extends ComicSource {
    name = "Hanime1.me"
    key = "hanime1"
    version = "2.4.0"
    minAppVersion = "2.0.0"
    url = ""
    mediaType = "video"

    baseUrl = "https://hanime1.me"

    headers = {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
        "Referer": "https://hanime1.me/",
    }

    attr(el, name) {
        if (!el) return ""
        let a = el.attributes
        if (!a) return ""
        return a[name] || a[name.toLowerCase()] || ""
    }

    text(el) {
        if (!el) return ""
        return (el.text || "").trim()
    }

    absUrl(u) {
        if (!u) return ""
        u = (u + "").trim()
        if (!u || u.indexOf("data:") === 0) return ""
        if (u.indexOf("//") === 0) return "https:" + u
        if (u.indexOf("http://") === 0 || u.indexOf("https://") === 0) return u
        if (u.charAt(0) === "/") return this.baseUrl + u
        return ""
    }

    async getHtml(url) {
        let res = await Network.get(url, this.headers)
        if (res.status !== 200) {
            throw "请求失败: " + res.status
        }
        if (res.body.indexOf("Just a moment...") >= 0 || res.body.indexOf("cf-browser-verification") >= 0) {
            throw "遇到 Cloudflare 验证，请稍后再试或更换网络/代理"
        }
        return new HtmlDocument(res.body)
    }

    parseVideoList(doc) {
        let comics = []
        let items = doc.querySelectorAll(".video-item-container")
        if (!items || items.length === 0) {
            items = doc.querySelectorAll(".home-rows-videos-wrapper > a")
        }
        if (!items || items.length === 0) {
            items = doc.querySelectorAll(".search-doujin-videos")
        }
        if (!items) items = []

        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            let linkEl = item.querySelector(".video-link") || item.querySelector("a") || item
            let href = this.attr(linkEl, "href")
            if (!href) continue

            if (href.charAt(0) === "/") {
                href = this.baseUrl + href
            }

            // 只收带 watch?v= 的条目
            let m = href.match(/[?&]v=(\d+)/)
            if (!m) {
                m = href.match(/\/watch\/(\d+)/)
            }
            if (!m) continue
            let id = m[1]

            // 与可正常显示的版本一致：优先用 .title 文本
            let titleEl = item.querySelector(".title") ||
                          item.querySelector(".home-rows-videos-title") ||
                          item.querySelector(".card-mobile-title")
            let title = this.text(titleEl)
            if (!title) {
                title = this.attr(item, "title")
            }
            if (!title) continue

            let coverEl = item.querySelector(".main-thumb") || item.querySelector("img")
            let cover = this.attr(coverEl, "src")
            if (!cover || cover.indexOf("data:") === 0) {
                cover = this.attr(coverEl, "data-src") || cover
            }
            if (!cover || cover.indexOf("data:") === 0) {
                let srcset = this.attr(coverEl, "data-srcset") || this.attr(coverEl, "srcset")
                if (srcset) cover = srcset.split(",")[0].trim().split(" ")[0]
            }
            cover = this.absUrl(cover)

            let duration = this.text(item.querySelector(".duration"))
            let subtitleEl = item.querySelector(".subtitle a") || item.querySelector(".subtitle")
            let subtitle = this.text(subtitleEl)

            let stats = []
            let statItems = item.querySelectorAll(".stat-item")
            if (statItems) {
                for (let j = 0; j < statItems.length; j++) {
                    let t = this.text(statItems[j]).replace("thumb_up", "").trim()
                    if (t) stats.push(t)
                }
            }

            comics.push(new Comic({
                id: id,
                title: title,
                subtitle: subtitle || duration,
                cover: cover || undefined,
                tags: stats.length > 0 ? stats : undefined,
                description: duration,
            }))
        }
        return comics
    }

    /**
     * 解析最大页码。
     * 单页时「下一頁」的 href 是 "#"，不能当成有下一页。
     * 只认真实的 page=N 链接（N > 当前页）。
     */
    parseMaxPage(doc, page, itemCount) {
        let maxPage = page
        let links = doc.querySelectorAll("a")
        if (links) {
            for (let i = 0; i < links.length; i++) {
                let href = this.attr(links[i], "href") || ""
                href = href.trim()
                // 忽略 #、空、javascript
                if (!href || href === "#" || href.indexOf("javascript:") === 0) continue
                let m = href.match(/[?&]page=(\d+)/)
                if (!m) continue
                let p = parseInt(m[1])
                if (p > maxPage) maxPage = p
            }
        }
        // 本页没有结果：回退一页
        if (!itemCount || itemCount === 0) {
            return page > 1 ? page - 1 : 1
        }
        // 没有更大的真实页码链接，当前页就是最后一页
        return maxPage
    }

    explore = [
        {
            title: "Hanimel 最新",
            type: "multiPageComicList",
            load: async (page) => {
                let url = page === 1 ? this.baseUrl : (this.baseUrl + "/?page=" + page)
                let doc = await this.getHtml(url)
                let comics = this.parseVideoList(doc)
                return { comics: comics, maxPage: this.parseMaxPage(doc, page, comics.length) }
            },
        },
        {
            title: "里番",
            type: "multiPageComicList",
            load: async (page) => {
                let url = this.baseUrl + "/search?genre=" + encodeURIComponent("裏番")
                if (page > 1) url += "&page=" + page
                let doc = await this.getHtml(url)
                let comics = this.parseVideoList(doc)
                return { comics: comics, maxPage: this.parseMaxPage(doc, page, comics.length) }
            },
        },
        {
            title: "泡面番",
            type: "multiPageComicList",
            load: async (page) => {
                let url = this.baseUrl + "/search?genre=" + encodeURIComponent("泡麵番")
                if (page > 1) url += "&page=" + page
                let doc = await this.getHtml(url)
                let comics = this.parseVideoList(doc)
                return { comics: comics, maxPage: this.parseMaxPage(doc, page, comics.length) }
            },
        },
        {
            title: "Motion Anime",
            type: "multiPageComicList",
            load: async (page) => {
                let url = this.baseUrl + "/search?genre=" + encodeURIComponent("Motion Anime")
                if (page > 1) url += "&page=" + page
                let doc = await this.getHtml(url)
                let comics = this.parseVideoList(doc)
                return { comics: comics, maxPage: this.parseMaxPage(doc, page, comics.length) }
            },
        },
    ]

    category = {
        title: "Hanime1",
        parts: [
            {
                name: "Hanime1",
                type: "fixed",
                categories: [
                    "里番", "泡面番", "Motion Anime", "3DCG", "2.5D",
                    "2D动画", "AI生成", "MMD", "Cosplay"
                ],
                categoryParams: [
                    "裏番", "泡麵番", "Motion Anime", "3DCG", "2.5D",
                    "2D動畫", "AI生成", "MMD", "Cosplay"
                ],
                itemType: "category",
            },
        ],
    }

    categoryComics = {
        load: async (category, param, options, page) => {
            let url = this.baseUrl + "/search?genre=" + encodeURIComponent(param)
            if (page > 1) url += "&page=" + page
            let doc = await this.getHtml(url)
            let comics = this.parseVideoList(doc)
            return { comics: comics, maxPage: this.parseMaxPage(doc, page, comics.length) }
        },
    }

    search = {
        load: async (keyword, options, page) => {
            // [0]排序 [1]时长 [2]年份 [3]月份 [4]标签
            // 网页实际 URL 示例：
            // /search?query=zzz&date=2026 年 1 月&duration=&sort=最新上市
            // 注意：日期是合并参数 date=，不是 year=&month=
            let raw = function (arr, i) {
                if (!arr || arr.length <= i || arr[i] === null || arr[i] === undefined) return ""
                return (arr[i] + "").trim()
            }
            // 去掉首尾引号，并取 "value-显示" 的 value
            let val = function (arr, i) {
                let v = raw(arr, i)
                if (v.length >= 2 && ((v.charAt(0) === '"' && v.charAt(v.length - 1) === '"') || (v.charAt(0) === "'" && v.charAt(v.length - 1) === "'"))) {
                    v = v.substring(1, v.length - 1)
                }
                let idx = v.indexOf("-")
                if (idx > 0) v = v.substring(0, idx)
                return v.trim()
            }

            let sort = val(options, 0) || "最新上市"
            let duration = val(options, 1)
            let year = val(options, 2)
            let month = val(options, 3)
            let tag = val(options, 4)

            // 年份数字
            if (year) {
                let ym = year.match(/(19|20)\d{2}/)
                year = ym ? ym[0] : ""
            }
            // 月份数字
            if (month) {
                let mm = parseInt(month, 10)
                if (isNaN(mm) || mm < 1 || mm > 12) month = ""
                else month = "" + mm
            }

            let url = this.baseUrl + "/search?query=" + encodeURIComponent((keyword || "").trim())
            url += "&broad=on"
            url += "&sort=" + encodeURIComponent(sort)
            // 网页用 date=2026 年 1 月
            if (year && month) {
                url += "&date=" + encodeURIComponent(year + " 年 " + month + " 月")
            } else if (year) {
                url += "&date=" + encodeURIComponent(year + " 年")
            } else if (month) {
                url += "&date=" + encodeURIComponent(month + " 月")
            }
            if (duration) url += "&duration=" + encodeURIComponent(duration)
            if (tag) url += "&tags[]=" + encodeURIComponent(tag)
            url += "&page=" + (page > 0 ? page : 1)

            let doc = await this.getHtml(url)
            let comics = this.parseVideoList(doc)
            return { comics: comics, maxPage: this.parseMaxPage(doc, page, comics.length) }
        },
        optionList: [
            {
                type: "select",
                label: "排序",
                default: "最新上市",
                options: [
                    "最新上市-最新上市",
                    "最新上傳-最新上传",
                    "本日排行-本日排行",
                    "本週排行-本周排行",
                    "本月排行-本月排行",
                    "觀看次數-观看次数",
                    "讚好比例-赞好比例",
                    "他們在看-他们在看",
                ],
            },
            {
                type: "select",
                label: "时长",
                default: null,
                options: [
                    "-全部时长",
                    "短片-短片（4分钟内）",
                    "中長片-中长片（4至20分钟）",
                    "長片-长片（20分钟以上）",
                ],
            },
            {
                type: "select",
                label: "年份",
                default: null,
                options: [
                    "-全部年份",
                    "2026-2026年",
                    "2025-2025年",
                    "2024-2024年",
                    "2023-2023年",
                    "2022-2022年",
                    "2021-2021年",
                    "2020-2020年",
                    "2019-2019年",
                    "2018-2018年",
                    "2017-2017年",
                    "2016-2016年",
                    "2015-2015年",
                    "2014-2014年",
                    "2013-2013年",
                    "2012-2012年",
                    "2011-2011年",
                    "2010-2010年",
                    "2009-2009年",
                    "2008-2008年",
                    "2007-2007年",
                    "2006-2006年",
                    "2005-2005年",
                    "2000-2000年",
                    "1995-1995年",
                    "1990-1990年",
                ],
            },
            {
                type: "select",
                label: "月份",
                default: null,
                options: [
                    "-全部月份",
                    "1-1月",
                    "2-2月",
                    "3-3月",
                    "4-4月",
                    "5-5月",
                    "6-6月",
                    "7-7月",
                    "8-8月",
                    "9-9月",
                    "10-10月",
                    "11-11月",
                    "12-12月",
                ],
            },
            {
                type: "select",
                label: "标签",
                default: null,
                options: [
                    "-不限标签",
                    "無碼-无码",
                    "AI解碼-AI解码",
                    "中文字幕-中文字幕",
                    "1080P-1080P",
                    "60FPS-60FPS",
                    "近親-近亲",
                    "姐-姐",
                    "妹-妹",
                    "母-母",
                    "女兒-女儿",
                    "師生-师生",
                    "情侶-情侣",
                    "青梅竹馬-青梅竹马",
                    "JK-JK",
                    "處女-处女",
                    "御姐-御姐",
                    "熟女-熟女",
                    "人妻-人妻",
                    "老師-老师",
                    "女醫護士-女医护士",
                    "OL-OL",
                    "大小姐-大小姐",
                    "偶像-偶像",
                    "女僕-女仆",
                    "巫女-巫女",
                    "修女-修女",
                    "風俗娘-风俗娘",
                    "公主-公主",
                    "女戰士-女战士",
                    "魔法少女-魔法少女",
                    "異種族-异种族",
                    "妖精-妖精",
                    "魔物娘-魔物娘",
                    "獸娘-兽娘",
                    "碧池-碧池",
                    "痴女-痴女",
                    "不良少女-不良少女",
                    "傲嬌-傲娇",
                    "病嬌-病娇",
                    "無口-无口",
                    "偽娘-伪娘",
                    "扶他-扶他",
                    "短髮-短发",
                    "馬尾-马尾",
                    "雙馬尾-双马尾",
                    "巨乳-巨乳",
                    "貧乳-贫乳",
                    "黑皮膚-黑皮肤",
                    "眼鏡娘-眼镜娘",
                    "獸耳-兽耳",
                    "美人痣-美人痣",
                    "肌肉女-肌肉女",
                    "白虎-白虎",
                    "大屌-大屌",
                    "水手服-水手服",
                    "體操服-体操服",
                    "泳裝-泳装",
                    "比基尼-比基尼",
                    "和服-和服",
                    "兔女郎-兔女郎",
                    "圍裙-围裙",
                    "啦啦隊-啦啦队",
                    "旗袍-旗袍",
                    "絲襪-丝袜",
                    "吊襪帶-吊袜带",
                    "熱褲-热裤",
                    "迷你裙-迷你裙",
                    "性感內衣-性感内衣",
                    "丁字褲-丁字裤",
                    "高跟鞋-高跟鞋",
                    "淫紋-淫纹",
                    "純愛-纯爱",
                    "戀愛喜劇-恋爱喜剧",
                    "後宮-后宫",
                    "開大車-开大车",
                    "公眾場合-公众场合",
                    "NTR-NTR",
                    "精神控制-精神控制",
                    "藥物-药物",
                    "痴漢-痴汉",
                    "阿嘿顏-阿嘿颜",
                    "精神崩潰-精神崩溃",
                    "獵奇-猎奇",
                    "BDSM-BDSM",
                    "綑綁-捆绑",
                    "眼罩-眼罩",
                    "項圈-项圈",
                    "調教-调教",
                    "異物插入-异物插入",
                    "肉便器-肉便器",
                    "胃凸-胃凸",
                    "強制-强制",
                    "逆強制-逆强制",
                    "女王樣-女王样",
                    "母女丼-母女丼",
                    "姐妹丼-姐妹丼",
                    "凌辱-凌辱",
                    "出軌-出轨",
                    "攝影-摄影",
                    "性轉換-性转换",
                    "百合-百合",
                    "耽美-耽美",
                    "異世界-异世界",
                    "怪獸-怪兽",
                    "世界末日-世界末日",
                    "手交-手交",
                    "指交-指交",
                    "乳交-乳交",
                    "肛交-肛交",
                    "腳交-脚交",
                    "拳交-拳交",
                    "3P-3P",
                    "群交-群交",
                    "口交-口交",
                    "口爆-口爆",
                    "吞精-吞精",
                    "舔蛋蛋-舔蛋蛋",
                    "舔穴-舔穴",
                    "69-69",
                    "自慰-自慰",
                    "腋毛-腋毛",
                    "腋交-腋交",
                    "舔腋下-舔腋下",
                    "內射-内射",
                    "顏射-颜射",
                    "雙洞齊下-双洞齐下",
                    "懷孕-怀孕",
                    "噴奶-喷奶",
                    "放尿-放尿",
                    "排便-排便",
                    "顏面騎乘-颜面骑乘",
                    "車震-车震",
                    "性玩具-性玩具",
                    "毒龍鑽-毒龙钻",
                    "觸手-触手",
                    "頸手枷-颈手枷"
                ],
            },
        ],
    }

    comic = {
        loadInfo: async (id) => {
            let url = (id + "").indexOf("http") === 0 ? id : (this.baseUrl + "/watch?v=" + id)
            let doc = await this.getHtml(url)

            let titleEl = doc.querySelector("h3") || doc.querySelector(".video-details-wrapper h3") || doc.querySelector("title")
            let title = this.text(titleEl)
            title = title.replace(/ - Hanime1\.me.*$/i, "").replace(/\u00a0/g, " ").trim()
            if (!title) title = "未知标题"

            let videoEl = doc.querySelector("video#player")
            let cover = this.absUrl(this.attr(videoEl, "poster"))
            if (!cover) {
                let meta = doc.querySelector("meta[property='og:image']")
                cover = this.absUrl(this.attr(meta, "content"))
            }

            // 描述：观看次数 + 日期 + 正文（保持换行）
            let description = ""
            let descPanel = doc.querySelector(".video-description-panel")
            if (descPanel) {
                let parts = []
                let children = descPanel.querySelectorAll("div")
                if (children) {
                    for (let i = 0; i < children.length; i++) {
                        let t = this.text(children[i])
                        if (t) parts.push(t)
                    }
                }
                if (parts.length === 0) {
                    description = this.text(descPanel)
                } else {
                    // 去重、过滤纯标签行
                    let seen = {}
                    let out = []
                    for (let i = 0; i < parts.length; i++) {
                        let p = parts[i].replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim()
                        if (!p || seen[p]) continue
                        // 跳过只有 (数字) 的标签计数
                        if (p.match(/^\(\d+\)$/)) continue
                        seen[p] = true
                        out.push(p)
                    }
                    description = out.join("\n")
                }
            }

            // 标签：只取 .single-video-tag 里带 tags[] 的链接，不要导航栏 genre
            let tags = {}
            let tagList = []
            let seenTag = {}
            let tagEls = doc.querySelectorAll(".single-video-tag a")
            if (!tagEls || tagEls.length === 0) {
                tagEls = doc.querySelectorAll("a[href*='tags']")
            }
            if (tagEls) {
                for (let i = 0; i < tagEls.length; i++) {
                    let href = this.attr(tagEls[i], "href")
                    if (href && href.indexOf("tags") < 0 && href.indexOf("tags%5B%5D") < 0 && href.indexOf("tags[]") < 0) {
                        continue
                    }
                    let t = this.text(tagEls[i])
                    // 去掉 (4) 计数
                    t = t.replace(/\(\d+\)\s*$/, "").replace(/\u00a0/g, " ").trim()
                    if (!t || seenTag[t]) continue
                    // 过滤按钮和无效项
                    let tl = t.toLowerCase()
                    if (tl === "add" || tl === "remove" || tl === "+" || tl === "-" || t === "添加" || t === "移除") continue
                    // 过滤导航大类误入
                    if (t === "2.5D" || t === "3DCG" || t === "裏番" || t === "泡麵番" || t === "MMD" || t === "Cosplay") {
                        // 若 href 不含 tags 则跳过；含 tags 则保留
                        if (!href || (href.indexOf("tags") < 0 && href.indexOf("tags%5B") < 0)) continue
                    }
                    seenTag[t] = true
                    tagList.push(t)
                }
            }
            if (tagList.length > 0) tags["标签"] = tagList

            // 作者：站点用 id="video-artist-name"（不是 class）
            let author = ""
            let authorEl = doc.querySelector("#video-artist-name")
            if (!authorEl) authorEl = doc.querySelector("a[id='video-artist-name']")
            if (!authorEl) authorEl = doc.querySelector(".video-artist a")
            if (authorEl) {
                author = this.text(authorEl).replace(/\u00a0/g, " ").trim()
                // 优先用链接里的 query 参数（和网站一致）
                let href = this.attr(authorEl, "href")
                if (href) {
                    let qm = href.match(/[?&]query=([^&]+)/)
                    if (qm) {
                        try { author = decodeURIComponent(qm[1].replace(/\+/g, " ")) } catch (e) {}
                    }
                }
            }
            if (author) tags["作者"] = [author]

            return new ComicDetails({
                title: title,
                cover: cover || undefined,
                description: description,
                tags: tags,
                chapters: null,
            })
        },

        /**
         * 点击标签 / 作者
         * 作者：用作者名搜索，查看该作者其他作品
         * 标签：用标签名搜索
         */
        onClickTag: (namespace, tag) => {
            return {
                action: "search",
                keyword: tag || "",
            }
        },

        /**
         * 加载评论
         * 接口：/loadComment?id={视频id}&type=video&content=comment-tablink
         * 返回 JSON：{ comments: "<html>" }
         */
        loadComments: async (comicId, subId, page, replyTo) => {
            let vid = (comicId + "")
            let m = vid.match(/watch\?v=(\d+)/)
            if (m) vid = m[1]
            else vid = vid.replace(/\D/g, "") || comicId

            let url = this.baseUrl + "/loadComment?id=" + encodeURIComponent(vid)
                + "&type=video&content=comment-tablink"
            let res = await Network.get(url, this.headers)
            if (res.status !== 200) {
                return { comments: [], maxPage: 1 }
            }

            let html = ""
            try {
                let data = JSON.parse(res.body)
                html = data.comments || ""
            } catch (e) {
                html = res.body || ""
            }
            if (!html) return { comments: [], maxPage: 1 }

            let comments = []
            // 匹配：头像、用户名、时间、内容、评论id
            let re = /<img class="img-circle"[^>]+src="([^"]+)"[\s\S]*?comment-index-text[^>]*>[\s\S]*?<a[^>]*>\s*([^<&]+?)(?:&nbsp;)*\s*<span[^>]*>([^<]+)<\/span>[\s\S]*?comment-index-text[^>]*>([^<]+)<\/div>[\s\S]*?data-reportable-id="(\d+)"/g
            let mm
            let seen = {}
            while ((mm = re.exec(html)) !== null) {
                let avatar = mm[1].replace(/\\/g, "")
                let user = (mm[2] || "").replace(/&nbsp;/g, " ").trim()
                let time = (mm[3] || "").trim()
                let content = (mm[4] || "").replace(/&nbsp;/g, " ").trim()
                let id = mm[5]
                if (!content || seen[id]) continue
                seen[id] = true
                comments.push({
                    userName: user || "匿名",
                    avatar: avatar || undefined,
                    content: content,
                    time: time,
                    id: id,
                    replyCount: 0,
                })
            }

            // 简单分页：每页 30 条
            let pageSize = 30
            let total = comments.length
            let maxPage = Math.max(1, Math.ceil(total / pageSize))
            let p = page > 0 ? page : 1
            let start = (p - 1) * pageSize
            let pageComments = comments.slice(start, start + pageSize)

            return { comments: pageComments, maxPage: maxPage }
        },
    }

    video = {
        loadPlayInfo: async (id, epId) => {
            let url = (id + "").indexOf("http") === 0 ? id : (this.baseUrl + "/watch?v=" + id)
            let doc = await this.getHtml(url)

            let videoEl = doc.querySelector("video#player")
            if (!videoEl) {
                return await Video.sniff(url, {
                    match: "\\.(mp4|m3u8)(\\?|$)",
                    headers: this.headers,
                })
            }

            let sources = []
            let seen = {}

            let mainSrc = this.attr(videoEl, "src")
            if (mainSrc) {
                seen[mainSrc] = true
                sources.push(new VideoPlaySource({
                    name: "默认",
                    url: mainSrc,
                    type: mainSrc.indexOf(".m3u8") >= 0 ? "hls" : "mp4",
                }))
            }

            let sourceEls = videoEl.querySelectorAll("source")
            if (sourceEls) {
                for (let i = 0; i < sourceEls.length; i++) {
                    let el = sourceEls[i]
                    let src = this.attr(el, "src")
                    if (!src || seen[src]) continue
                    seen[src] = true
                    let size = this.attr(el, "size")
                    let type = this.attr(el, "type")
                    let name = size ? (size + "P") : (type.indexOf("mp4") >= 0 ? "MP4" : "源")
                    sources.push(new VideoPlaySource({
                        name: name,
                        url: src,
                        type: src.indexOf(".m3u8") >= 0 ? "hls" : "mp4",
                    }))
                }
            }

            if (sources.length === 0) {
                return await Video.sniff(url, {
                    match: "\\.(mp4|m3u8)(\\?|$)",
                    headers: this.headers,
                })
            }

            sources.sort(function (a, b) {
                let na = parseInt(a.name) || 0
                let nb = parseInt(b.name) || 0
                return nb - na
            })

            return new VideoPlayInfo({
                sources: sources,
                headers: {
                    "Referer": this.baseUrl + "/",
                    "User-Agent": this.headers["User-Agent"],
                },
            })
        },
    }
}
