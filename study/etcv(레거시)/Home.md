---
date: 2026-01-22
tags: [Algorithm]
---

# 🚀 Knowledge Control Center

## 📥 Inbox Zero (To Process)
> **Goal:** `Unprocessed` 태그가 붙은 문서를 읽고, 요약하고, 태그를 지우세요.

```dataview
TABLE WITHOUT ID
	link(file.link, title) AS "Title",
	link(source, "🔗 Link") AS "Source",
	dateformat(date, "yyyy-MM-dd") AS "Date"
FROM #Unprocessed
SORT date ASC
```

---

## 💻 Algorithmic Growth (Recent Solved)
> **Status:** 최근 푼 백준/프로그래머스 문제 (Latest 5)

```dataview
TABLE WITHOUT ID
	file.link AS "Problem",
	file.folder AS "Difficulty",
	dateformat(file.ctime, "yy-MM-dd HH:mm") AS "Solved"
FROM "백준" OR "프로그래머스"
SORT file.ctime DESC
LIMIT 5
```

---

## 🧠 Recent Insights (Recently Modified)
> **Activity:** 최근 수정한 지식 노트 (Inbox 제외)

```dataview
TABLE WITHOUT ID
	file.link AS "Note",
	dateformat(file.mtime, "yy-MM-dd HH:mm") AS "Last Updated"
FROM -"Inbox" AND -"백준" AND -"프로그래머스" AND -"Templates"
WHERE file.name != this.file.name
SORT file.mtime DESC
LIMIT 5
```