const ONE_DAY_MS = 1000 * 60 * 60 * 24

export const getDailyActivityData = async () => {
  const data = new Array(400)
    .fill(1)
    .map((item, index) => {
      const date = new Date().getTime() - index * ONE_DAY_MS
      return {
        date,
        blogCount: Math.floor(Math.random() * 50),
        day: new Date(date).getDay(),
      }
    })
    .reverse()
  let week = 0
  data.forEach((item) => {
    item.week = week
    if (item.day === 6) {
      week++
    }
  })
  return data
}

export const getTagData = async () => {
  return [
    { id: 0, name: "前端", count: 15 },
    { id: 1, name: "后端", count: 22 },
    { id: 2, name: "生活", count: 25 },
    { id: 3, name: "算法", count: 21 },
    { id: 4, name: "AI", count: 10 },
  ]
}
