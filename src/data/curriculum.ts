import type { DayPlan, PhaseId, PhaseInfo } from '../types'

export const TOTAL_DAYS = 30

export const PHASES: Record<PhaseId, PhaseInfo> = {
  lines: {
    id: 'lines',
    title: '第一階段 · 基礎線條與形狀觀察',
    goal: '培養「畫家之眼」，把複雜物體拆解成基礎幾何圖形，建立左右對稱與比例感。',
    range: [1, 7],
    accent: 'ink',
    emoji: '✏️',
  },
  pencil: {
    id: 'pencil',
    title: '第二階段 · 色鉛筆色彩與立體感',
    goal: '色彩均勻度、力道控制（深淺變化）以及雙色疊色嘗試。',
    range: [8, 15],
    accent: 'coral',
    emoji: '🎨',
  },
  watercolor: {
    id: 'watercolor',
    title: '第三階段 · 水彩控水與混色初體驗',
    goal: '適應水彩不確定性，掌握水份與顏料比例、濕畫法渲染及留白。',
    range: [16, 23],
    accent: 'sky',
    emoji: '💧',
  },
  mixed: {
    id: 'mixed',
    title: '第四階段 · 媒材結合與綜合挑戰',
    goal: '實踐「水彩鋪大面積底色，色鉛筆收精細線條與質感」的專業複合手繪邏輯。',
    range: [24, 30],
    accent: 'grape',
    emoji: '✨',
  },
}

const MEDIA: Record<PhaseId, string> = {
  lines: '純鉛筆與橡皮擦',
  pencil: '鉛筆打稿 + 色鉛筆上色',
  watercolor: '鉛筆打稿 + 水彩上色',
  mixed: '複合媒材（鉛筆 + 色鉛筆 + 水彩）',
}

export const CURRICULUM: DayPlan[] = [
  // ── 第一階段：基礎線條與形狀觀察 ──
  {
    day: 1, subject: '霹靂電球', subjectEn: 'Voltorb', phase: 'lines', media: MEDIA.lines,
    focus: '圓形練習',
    focusHint: '挑戰徒手畫出正圓，練習線條的流暢度與左右對稱性。',
    tools: '✏️ HB/2B鉛筆、橡皮擦、普通白紙',
  },
  {
    day: 2, subject: '胖丁', subjectEn: 'Jigglypuff', phase: 'lines', media: MEDIA.lines,
    focus: '圓形延伸',
    focusHint: '以大圓形為核心主體，練習加上小三角形、小圓形的複合組合。',
    tools: '✏️ HB/2B鉛筆、橡皮擦、普通白紙',
  },
  {
    day: 3, subject: '地鼠', subjectEn: 'Diglett', phase: 'lines', media: MEDIA.lines,
    focus: '橢圓形與比例',
    focusHint: '拿捏長橢圓形身體，精準配置眼睛與鼻子的微小五官比例。',
    tools: '✏️ HB/2B鉛筆、橡皮擦、普通白紙',
  },
  {
    day: 4, subject: '瑪力露', subjectEn: 'Marill', phase: 'lines', media: MEDIA.lines,
    focus: '水滴與弧線',
    focusHint: '挑戰圓潤身體與大圓耳，尾巴部分則引入複雜的鋸齒硬線條。',
    tools: '✏️ HB/2B鉛筆、橡皮擦、普通白紙',
  },
  {
    day: 5, subject: '百變怪', subjectEn: 'Ditto', phase: 'lines', media: MEDIA.lines,
    focus: '複合自由線條',
    focusHint: '無固定形狀，旨在放鬆手腕，練習不規則、流暢的波浪軟線條。',
    tools: '✏️ HB/2B鉛筆、橡皮擦、普通白紙',
  },
  {
    day: 6, subject: '精靈球', subjectEn: 'Poké Ball', phase: 'lines', media: MEDIA.lines,
    focus: '絕對對稱練習',
    focusHint: '幾何結構訓練，練習精準的同心圓與剛硬的水平切分線。',
    tools: '✏️ HB/2B鉛筆、橡皮擦、普通白紙',
  },
  {
    day: 7, subject: '首週成果驗收', subjectEn: 'Week 1 Review', phase: 'lines', media: MEDIA.lines,
    focus: '自我修正',
    focusHint: '重繪前 6 天最喜歡的一隻，重點在於優化線條，使其更乾淨俐落。',
    tools: '✏️ HB/2B鉛筆、橡皮擦、普通白紙',
  },

  // ── 第二階段：色鉛筆色彩與立體感 ──
  {
    day: 8, subject: '妙蛙種子的種子', subjectEn: "Bulbasaur's Bulb", phase: 'pencil', media: MEDIA.pencil,
    focus: '單色平塗練習',
    focusHint: '僅用綠色，練習順著同一方向將顏色填滿且不留紙白。',
    tools: '✏️ 鉛筆打稿 🎨 綠色系色鉛筆、普通白紙',
  },
  {
    day: 9, subject: '皮卡丘（頭部）', subjectEn: 'Pikachu (head)', phase: 'pencil', media: MEDIA.pencil,
    focus: '暖色暗面表現',
    focusHint: '大面積黃色平塗後，初次嘗試用橘色在耳下與臉頰製造陰影。',
    tools: '✏️ 鉛筆打稿 🎨 黃、橘、黑色色鉛筆',
  },
  {
    day: 10, subject: '呆呆獸', subjectEn: 'Slowpoke', phase: 'pencil', media: MEDIA.pencil,
    focus: '粉紅色漸層',
    focusHint: '控制筆觸力道，由重變輕，練習從尾巴白色過渡到身體的粉紅。',
    tools: '✏️ 鉛筆打稿 🎨 粉紅、白色色鉛筆',
  },
  {
    day: 11, subject: '小火龍', subjectEn: 'Charmander', phase: 'pencil', media: MEDIA.pencil,
    focus: '異材質聯想與混色',
    focusHint: '用橘色畫身體，尾巴火焰處練習黃色與橘色的互相交疊。',
    tools: '✏️ 鉛筆打稿 🎨 橘、黃、紅色色鉛筆',
  },
  {
    day: 12, subject: '瑪力露麗', subjectEn: 'Azumarill', phase: 'pencil', media: MEDIA.pencil,
    focus: '大面積留白',
    focusHint: '塗抹大面積藍色的同時，小心繞開並留出肚子上的白色斑紋。',
    tools: '✏️ 鉛筆打稿 🎨 藍色、黑色色鉛筆',
  },
  {
    day: 13, subject: '小磁怪', subjectEn: 'Magnemite', phase: 'pencil', media: MEDIA.pencil,
    focus: '冷色調與金屬感',
    focusHint: '運用灰色與藍色冷色調，練習表現出堅硬、冰冷的材質特徵。',
    tools: '✏️ 鉛筆打稿 🎨 灰、藍、黑、紅色色鉛筆',
  },
  {
    day: 14, subject: '謎擬Ｑ', subjectEn: 'Mimikyu', phase: 'pencil', media: MEDIA.pencil,
    focus: '特殊筆觸與質感',
    focusHint: '利用色鉛筆乾糙的特性，故意畫出毛糙、破舊的布偶裝線條。',
    tools: '✏️ 鉛筆打稿 🎨 復古黃、黑、紅褐色鉛筆',
  },
  {
    day: 15, subject: '波克比', subjectEn: 'Togepi', phase: 'pencil', media: MEDIA.pencil,
    focus: '幾何色塊整合',
    focusHint: '練習在複雜的蛋殼花紋中，將紅、藍幾何色塊塗得飽滿。',
    tools: '✏️ 鉛筆打稿 🎨 紅、藍、黃色色鉛筆',
  },

  // ── 第三階段：水彩控水與混色初體驗 ──
  {
    day: 16, subject: '蚊香蝌蚪', subjectEn: 'Poliwag', phase: 'watercolor', media: MEDIA.watercolor,
    focus: '水彩大面積平塗',
    focusHint: '用純藍色均勻刷出身體，中間的蚊香螺旋線條小心避開。',
    tools: '✏️ 鉛筆 🎨 水彩（藍色）、水彩紙',
  },
  {
    day: 17, subject: '泥泥鰍', subjectEn: 'Barboach', phase: 'watercolor', media: MEDIA.watercolor,
    focus: '基礎水份控制',
    focusHint: '練習控制調色盤上的水量，避免過度稀釋導致紙張嚴重起皺。',
    tools: '✏️ 鉛筆 🎨 水彩（灰、藍色）、水彩紙',
  },
  {
    day: 18, subject: '海星星', subjectEn: 'Staryu', phase: 'watercolor', media: MEDIA.watercolor,
    focus: '同系渲染（濕畫法）',
    focusHint: '在紙面微濕狀態下，點入黃與橘，使其自然流動融合。',
    tools: '✏️ 鉛筆 🎨 水彩（黃、橘色）、水彩紙',
  },
  {
    day: 19, subject: '耿鬼', subjectEn: 'Gengar', phase: 'watercolor', media: MEDIA.watercolor,
    focus: '對比／撞色渲染',
    focusHint: '在幽靈系身體上混合紫色、藍色與微量紅色，製造神祕層次。',
    tools: '✏️ 鉛筆 🎨 水彩（紫、藍、紅色）、水彩紙',
  },
  {
    day: 20, subject: '波皇子', subjectEn: 'Prinplup', phase: 'watercolor', media: MEDIA.watercolor,
    focus: '高階留白',
    focusHint: '練習用水彩筆細緻地繞過高光點（如眼睛），利用紙白表現光澤。',
    tools: '✏️ 鉛筆 🎨 水彩（藍、黃色）、水彩紙',
  },
  {
    day: 21, subject: '木木梟', subjectEn: 'Rowlet', phase: 'watercolor', media: MEDIA.watercolor,
    focus: '特定調色練習',
    focusHint: '練習用基礎色調配出柔和的植物綠色與溫暖的肚皮米色。',
    tools: '✏️ 鉛筆 🎨 水彩（綠、褐、米色）、水彩紙',
  },
  {
    day: 22, subject: '漂浮泡泡', subjectEn: 'Castform', phase: 'watercolor', media: MEDIA.watercolor,
    focus: '輕透感表現',
    focusHint: '大幅提高水量、降低顏料比例，表現雲朵般的輕盈與透明感。',
    tools: '✏️ 鉛筆 🎨 水彩（淡藍、灰色）、水彩紙',
  },
  {
    day: 23, subject: '烏波', subjectEn: 'Wooper', phase: 'watercolor', media: MEDIA.watercolor,
    focus: '水彩階段驗收',
    focusHint: '在結構極簡的烏波身上，專注發揮前幾天學到的渲染與控水。',
    tools: '✏️ 鉛筆 🎨 水彩（藍、紫色）、水彩紙',
  },

  // ── 第四階段：媒材結合與綜合挑戰 ──
  {
    day: 24, subject: '可達鴨', subjectEn: 'Psyduck', phase: 'mixed', media: MEDIA.mixed,
    focus: '複合媒材入門',
    focusHint: '水彩畫大面積黃色身體，晾乾後用色鉛筆精準勾勒呆滯眼神與爪子。',
    tools: '🎨 水彩鋪底 + 色鉛筆細節、水彩紙',
  },
  {
    day: 25, subject: '伊布', subjectEn: 'Eevee', phase: 'mixed', media: MEDIA.mixed,
    focus: '毛髮質感挑戰',
    focusHint: '用水彩暈染出咖啡色基底，再以色鉛筆一根根疊加蓬鬆的頸部毛髮。',
    tools: '🎨 水彩鋪底 + 色鉛筆細節、水彩紙',
  },
  {
    day: 26, subject: '燭光靈', subjectEn: 'Litwick', phase: 'mixed', media: MEDIA.mixed,
    focus: '環境光與投影',
    focusHint: '挑戰頭頂藍色水彩火焰，並用黃／藍色鉛筆在臉部補上微弱環境反光。',
    tools: '🎨 水彩鋪底 + 色鉛筆細節、水彩紙',
  },
  {
    day: 27, subject: '六尾', subjectEn: 'Vulpix', phase: 'mixed', media: MEDIA.mixed,
    focus: '多層次色彩整合',
    focusHint: '挑戰六尾標誌性的多捲尾巴，練習紅褐色系的大量色彩層次。',
    tools: '🎨 水彩鋪底 + 色鉛筆細節、水彩紙',
  },
  {
    day: 28, subject: '傑尼龜', subjectEn: 'Squirtle', phase: 'mixed', media: MEDIA.mixed,
    focus: '動態姿態捕捉',
    focusHint: '打破僵硬站姿，挑戰奔跑或玩水中的動態結構與水花特效。',
    tools: '🎨 水彩鋪底 + 色鉛筆細節、水彩紙',
  },
  {
    day: 29, subject: '本命寶可夢', subjectEn: 'Your Favorite', phase: 'mixed', media: '自由選擇你今天想用的綜合媒材',
    focus: '自由創作日',
    focusHint: '學員自主挑選一隻最喜愛的寶可夢，不限難度，全面傾注所學。',
    tools: '🎨 自由選擇你今天想用的綜合媒材',
  },
  {
    day: 30, subject: '畢業大作（重繪）', subjectEn: 'Graduation Remake', phase: 'mixed', media: MEDIA.mixed,
    focus: '歷史對比',
    focusHint: '重繪 Day 01 霹靂電球（或 Day 09 皮卡丘），加入完整光影。對比第一天，彰顯驚人進步！',
    tools: '🎨 綜合媒材（全實力驗收）',
  },
]

export function getDay(day: number): DayPlan | undefined {
  return CURRICULUM.find((d) => d.day === day)
}

export function getPhase(day: number): PhaseInfo {
  const plan = getDay(day)
  return PHASES[plan?.phase ?? 'lines']
}
