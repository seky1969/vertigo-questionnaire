import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity, Clock, RefreshCw, Compass, Ear,
  Brain, Stethoscope, Waves, ArrowLeft,
  CheckCircle2, Copy, FileText, MessageSquare, QrCode, Share2,
  Heart, Sparkles, Eye, Footprints, MapPin, AlertCircle,
  RotateCw, Pill, CircleDot, Volume2, Moon,
  ShieldAlert, ChevronRight, X, Send
} from 'lucide-react';

// ============================================================
// 共通選択肢パーツ
// ============================================================
const HEADACHE_OPTIONS_6 = [
  { value: 'いつもある頭痛に似ている', label: 'いつもある頭痛に似ている' },
  { value: 'ズキズキする', label: 'ズキズキする' },
  { value: '光がまぶしい', label: '光がまぶしい' },
  { value: '音がつらい', label: '音がつらい' },
  { value: '目の前がチカチカする', label: '目の前がチカチカする' },
  { value: 'わからない', label: 'わからない' }
];

const HEADACHE_OPTIONS_7 = [
  { value: 'いつもある頭痛に似ている', label: 'いつもある頭痛に似ている' },
  { value: 'ズキズキする', label: 'ズキズキする' },
  { value: '光がまぶしい', label: '光がまぶしい' },
  { value: '音がつらい', label: '音がつらい' },
  { value: '吐き気がある', label: '吐き気がある' },
  { value: '目の前がチカチカする', label: '目の前がチカチカする' },
  { value: 'わからない', label: 'わからない' }
];

const MIGRAINE_HISTORY = {
  question: 'これまでに片頭痛と言われたことがありますか？',
  karteLabel: '片頭痛既往', type: 'single',
  options: [
    { value: 'ある', label: 'ある', karte: 'あり' },
    { value: 'ない', label: 'ない', karte: 'なし' },
    { value: 'わからない', label: 'わからない', karte: '不明' }
  ]
};

const HEADACHE_FREQ = {
  question: 'めまいの時に頭痛や光・音のつらさが出るのは、どのくらいの割合ですか？',
  karteLabel: '', type: 'single',
  options: [
    { value: 'だいたいいつも(半分以上)', label: 'だいたいいつも(半分以上)', karte: 'めまいの時に頭痛や光・音のつらさがだいたい起こる。' },
    { value: '時々(半分より少ない)', label: '時々(半分より少ない)', karte: 'めまいの時に頭痛や光・音のつらさはあまり起こらない。' },
    { value: 'わからない', label: 'わからない', karte: 'めまいの時に頭痛や光・音のつらさが起こるかよく分からない。' }
  ]
};

const EAR_SIDE = {
  question: '耳の症状はどちらですか？', karteLabel: '', type: 'single',
  options: [
    { value: '右', label: '右', karte: '右の' },
    { value: '左', label: '左', karte: '左の' },
    { value: '両側', label: '両側', karte: '両側の' },
    { value: '左右はわからない', label: '左右はわからない', karte: '左右は不明の' }
  ]
};

const EAR_TYPE_3 = {
  question: 'どの症状ですか？', karteLabel: '', type: 'multiple',
  options: [
    { value: '耳鳴り', label: '耳鳴り', karte: '耳鳴り、' },
    { value: '耳がつまる感じ', label: '耳がつまる感じ', karte: '耳閉感、' },
    { value: '聞こえにくい', label: '聞こえにくい', karte: '難聴、' }
  ]
};

const EAR_TYPE_4 = {
  question: 'どの症状ですか？', karteLabel: '', type: 'multiple',
  options: [
    { value: '耳鳴り', label: '耳鳴り', karte: '耳鳴り、' },
    { value: '耳がつまる感じ', label: '耳がつまる感じ', karte: '耳閉感、' },
    { value: '聞こえにくい', label: '聞こえにくい', karte: '難聴、' },
    { value: '自分の声が大きく響く・心臓の音が聞こえる', label: '自分の声が大きく響く・心臓の音が聞こえる', karte: '自声強聴・心音聴取、' }
  ]
};

const EAR_VARY = {
  question: '耳の症状は、めまいの時にいっしょに出ますか？', karteLabel: '', type: 'single',
  options: [
    { value: 'いっしょに出る', label: 'いっしょに出る', karte: '耳の症状はめまい症状といっしょに出る' },
    { value: 'いろいろ変わる', label: 'いろいろ変わる', karte: '耳の症状はめまい症状といっしょに出ることもあるし出ないこともある' },
    { value: 'いつもある', label: 'いつもある', karte: '耳の症状はめまい症状と関係なくいつもある' },
    { value: 'わからない', label: 'わからない', karte: '耳の症状はめまいといっしょに出るかわからない' }
  ]
};

// ============================================================
// 質問データ
// ============================================================
const QUESTIONS = {
  Q1: { id: 'Q1', question: '今回、受診しようと思っためまいはいつ頃からありますか？', karteLabel: '発症時期', type: 'single', icon: Clock,
    options: [
      { value: '今日から', label: '今日から', karte: '今日めまいが起こって、' },
      { value: '2〜3日前から', label: '2〜3日前から', karte: '2〜3日前からめまいが起こっており、' },
      { value: '4日以上前から', label: '4日以上前から', karte: '4日以上前からめまいが起こっており、' },
      { value: '1か月以上前から', label: '1か月以上前から', karte: '1か月以上前からめまいが起こっており、' },
      { value: 'はっきりしない', label: 'はっきりしない', karte: 'いつ頃から目まいが起こっているかはっきりしない。' }
    ]},
  Q2: { id: 'Q2', question: '今、そのめまいはどうなっていますか？', karteLabel: '', type: 'single', icon: Activity,
    options: [
      { value: '今も続いている', label: '今も続いている', karte: '今も続いている。' },
      { value: '今は落ち着いている', label: '今は落ち着いている', karte: '今は落ち着いている。' },
      { value: '出たりおさまったりしている', label: '出たりおさまったりしている', karte: '出たりおさまったりしている。' },
      { value: 'わからない', label: 'わからない', karte: '今めまいがあるかどうかよく分からない。' }
    ]},
  Q3: { id: 'Q3', question: '以前にも似ためまいはありましたか？', karteLabel: 'めまいの再発歴', type: 'single', icon: RefreshCw,
    options: [
      { value: '初めて', label: '初めて', karte: '今回のめまいは初めて起こった。' },
      { value: '前にもあった', label: '前にもあった', karte: '以前にも同じようなめまいがあった。' },
      { value: 'わからない', label: 'わからない', karte: '以前にも同じようなめまいがあったかどうかよく分からない。' }
    ]},
  Q4: { id: 'Q4', question: '今回のめまいは、どれに近いですか？', karteLabel: 'めまいの経過', type: 'single', icon: Compass, isBranch: true,
    options: [
      { value: 'A', label: '急にめまいが出て、しばらく続いた', sublabel: '(数分から数日続いたが繰り返してはいない)', karte: '急に強いめまいが出て、しばらく続いた。' },
      { value: 'B', label: 'めまいを何回もくり返す', sublabel: '(同じようなめまいが複数回おこっている)', karte: 'めまいを何回もくり返した。' },
      { value: 'C', label: 'ふらつきが毎日のように続いている', sublabel: '(ふらふら感が数日から数ヶ月以上続いている)', karte: 'ふらつきが毎日のように続いている。' },
      { value: 'D', label: 'よくわからない', karte: 'めまいの経過はよく分からない。' }
    ]},

  // 分岐A
  A1: { id: 'A1', question: 'じっとしていてもめまいがありますか？', karteLabel: '', type: 'single', icon: Activity,
    options: [
      { value: 'はい', label: 'はい', karte: 'じっとしていてもめまいが続いた。' },
      { value: 'いいえ', label: 'いいえ', karte: '頭を動かした時だけめまいがした。' },
      { value: '両方の場合がある', label: '両方の場合がある', karte: 'じっとしていてもめまいが続くことも頭を動かした時だけのこともあった。' },
      { value: 'わからない', label: 'わからない', karte: 'めまいがいつ出るかわからない。' }
    ]},
  A2: { id: 'A2', question: 'めまいはどれくらいで楽になることが多いですか？', karteLabel: '持続時間', type: 'single', icon: Clock,
    options: [
      { value: '数分程度', label: '数分程度' },
      { value: '数分〜数時間程度', label: '数分〜数時間程度' },
      { value: '半日以上続く', label: '半日以上続く' },
      { value: '半日以上続いて、今もまだ続いている', label: '半日以上続いて、今もまだ続いている' },
      { value: 'わからない', label: 'わからない' }
    ]},
  A3: { id: 'A3', question: 'めまいの時に耳の症状はありますか？', karteLabel: '発作時耳症状', type: 'single', icon: Ear,
    options: [
      { value: '耳鳴り・耳がつまる感じ・聞こえにくい', label: '耳鳴り・耳がつまる感じ・聞こえにくい' },
      { value: '耳が痛い', label: '耳が痛い' },
      { value: 'どれもない', label: 'どれもない' },
      { value: 'わからない', label: 'わからない' }
    ]},
  A3_ear_side: { id: 'A3_ear_side', icon: Ear, ...EAR_SIDE },
  A3_ear_type: { id: 'A3_ear_type', icon: Ear, ...EAR_TYPE_3 },
  A3_ear_vary: { id: 'A3_ear_vary', icon: Ear, ...EAR_VARY },
  A4: { id: 'A4', question: 'めまいの時に吐き気や嘔吐はありますか？', karteLabel: '', type: 'multiple', icon: AlertCircle,
    options: [
      { value: '吐き気', label: '吐き気', karte: 'めまい時の吐き気あった。' },
      { value: '吐いた', label: '吐いた', karte: 'めまい時に吐いた。' },
      { value: 'どれもない', label: 'どれもない', karte: 'めまい時の悪心嘔吐はなし。' },
      { value: 'わからない', label: 'わからない', karte: 'めまい時の悪心嘔吐はわからない。' }
    ]},
  A5: { id: 'A5', question: 'めまいの時に頭痛はありますか？', karteLabel: '', type: 'single', icon: Brain,
    options: [
      { value: 'ある', label: 'ある', karte: 'めまいの時に頭痛があった。' },
      { value: 'ない', label: 'ない', karte: 'めまいの時に頭痛はなかった。' },
      { value: 'わからない', label: 'わからない', karte: 'めまいの時の頭痛はわからない。' }
    ]},
  A5_headache_feature: { id: 'A5_headache_feature', icon: Brain, question: '頭痛がある場合、あてはまるものを選んでください', karteLabel: '頭痛の特徴', type: 'multiple', options: HEADACHE_OPTIONS_6 },
  A5_migraine_history: { id: 'A5_migraine_history', icon: Brain, ...MIGRAINE_HISTORY },

  // 分岐B
  B1: { id: 'B1', question: 'めまいはどんな時に起こりやすいですか？', karteLabel: '反復発作の誘因', type: 'multiple', icon: RotateCw,
    options: [
      { value: '寝返りや起き上がる動作', label: '寝返りや起き上がる動作', sublabel: '寝返り・横になる・起き上がる・上や下を向くなど' },
      { value: '立っている時', label: '立っている時' },
      { value: '人混みや店の中、動くものを見た時', label: '人混みや店の中、動くものを見た時' },
      { value: '大きな音やせき・くしゃみ', label: '大きな音やせき・くしゃみ・いきみ' },
      { value: '車・船・エレベーターなどに乗った時', label: '車・船・エレベーターなどに乗った時' },
      { value: '特にきっかけない', label: '特にきっかけない' },
      { value: 'わからない', label: 'わからない' }
    ]},
  B1a_movement: { id: 'B1a_movement', icon: RotateCw, question: '起こりやすい動きを選んでください', karteLabel: '反復発作の誘因', type: 'multiple',
    options: [
      { value: '寝返り', label: '寝返り', karte: '寝返り、' },
      { value: '起き上がる', label: '起き上がる', karte: '起き上がる、' },
      { value: '横になる', label: '横になる', karte: '横になる、' },
      { value: '上を向く', label: '上を向く', karte: '上を向く、' },
      { value: '下を向く', label: '下を向く', karte: '下を向く、' },
      { value: 'わからない', label: 'わからない', karte: '不明、' }
    ]},
  B1a_recover: { id: 'B1a_recover', icon: RotateCw, question: '頭を元に戻すと楽になることが多いですか？', karteLabel: '', type: 'single',
    options: [
      { value: 'はい', label: 'はい', karte: '頭を元の位置に戻すとめまいは落ち着く。' },
      { value: 'いいえ', label: 'いいえ', karte: '頭を元の位置に戻してもめまいは落ち着かない。' },
      { value: 'わからない', label: 'わからない', karte: '頭を元の位置に戻してめまいが良くなるかは分からない。' }
    ]},
  B1b: { id: 'B1b', icon: Volume2, question: 'めまいが出やすいのはどれですか？', karteLabel: '反復発作の誘因', type: 'multiple',
    options: [
      { value: '大きな音', label: '大きな音', karte: '大きな音、' },
      { value: 'せき', label: 'せき', karte: 'せき、' },
      { value: 'くしゃみ', label: 'くしゃみ', karte: 'くしゃみ、' },
      { value: '鼻をかむ', label: '鼻をかむ', karte: '鼻をかむ、' },
      { value: 'いきむ', label: 'いきむ', karte: 'いきむ、' }
    ]},
  B1c: { id: 'B1c', icon: Waves, question: '船や飛行機を降りたあと、揺れている感じが続いたことがありますか？', karteLabel: '下船・下機後の揺れ', type: 'single',
    options: [
      { value: 'はい', label: 'はい' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない' }
    ]},
  B1c_yes: { id: 'B1c_yes', icon: Waves, question: '車の運転中や乗り物に乗っている時は、一時的に楽になりますか？', karteLabel: '運転中・乗車中の改善', type: 'single',
    options: [
      { value: 'はい', label: 'はい', karte: 'あり' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない' }
    ]},
  B2: { id: 'B2', question: 'めまいは頭を動かした時だけ起こりますか？', karteLabel: '', type: 'single', icon: Compass,
    options: [
      { value: '頭を動かした時だけ起こる', label: '頭を動かした時だけ起こる', karte: '頭を動かした時だけめまいが起こる。' },
      { value: 'じっとしていても起こる', label: 'じっとしていても起こる', karte: 'じっとしていてもめまいが起こることがある。' },
      { value: '両方である', label: '両方である', karte: '頭を動かした時にもじっとしていてもめまいが起こることがある。' },
      { value: 'わからない', label: 'わからない', karte: 'めまいがいつ出るかわからない。' }
    ]},
  B3: { id: 'B3', question: 'めまいはどれくらいで楽になることが多いですか？', karteLabel: '持続時間', type: 'single', icon: Clock,
    options: [
      { value: '数秒から数十秒程度でおさまる', label: '数秒から数十秒程度でおさまる' },
      { value: '数分程度でおさまる', label: '数分程度でおさまる' },
      { value: '数分〜数時間程度続く', label: '数分〜数時間程度続く' },
      { value: '半日以上続く', label: '半日以上続く' },
      { value: 'わからない', label: 'わからない' }
    ]},
  B4: { id: 'B4', question: 'めまいはどのくらいの頻度で起こりますか？', karteLabel: '発作頻度', type: 'single', icon: RotateCw,
    options: [
      { value: '1日に何回も', label: '1日に何回も' },
      { value: '1週間に何回か', label: '1週間に何回か' },
      { value: '1か月に何回か', label: '1か月に何回か' },
      { value: '1年に数回', label: '1年に数回' },
      { value: 'わからない', label: 'わからない' }
    ]},
  B5: { id: 'B5', question: '毎回同じパターンで起こる感じがしますか？', karteLabel: '', type: 'single', icon: CircleDot,
    options: [
      { value: 'はい', label: 'はい', karte: 'めまいは毎回だいたい同じパターンで起こる。' },
      { value: 'いいえ', label: 'いいえ', karte: 'めまいのパターンは回によって違う。' },
      { value: 'わからない', label: 'わからない', karte: 'めまいのパターンが同じかわからない。' }
    ]},
  B6: { id: 'B6', question: 'めまいの時に耳の症状はありますか？', karteLabel: '発作時耳症状', type: 'single', icon: Ear,
    options: [
      { value: '耳鳴り・耳がつまる感じ・聞こえにくい', label: '耳鳴り・耳がつまる感じ・聞こえにくい' },
      { value: '耳が痛い', label: '耳が痛い' },
      { value: 'どれもない', label: 'どれもない' },
      { value: 'わからない', label: 'わからない' }
    ]},
  B6_ear_side: { id: 'B6_ear_side', icon: Ear, ...EAR_SIDE },
  B6_ear_type: { id: 'B6_ear_type', icon: Ear, ...EAR_TYPE_4 },
  B6_ear_vary: { id: 'B6_ear_vary', icon: Ear, ...EAR_VARY },
  B7: { id: 'B7', question: 'めまいの時に頭痛はありますか？', karteLabel: '', type: 'single', icon: Brain,
    options: [
      { value: 'ある', label: 'ある' },
      { value: 'ない', label: 'ない', karte: 'めまいの時に頭痛はなかった' },
      { value: 'わからない', label: 'わからない', karte: 'めまいの時の頭痛はわからない' }
    ]},
  B7_headache_feature: { id: 'B7_headache_feature', icon: Brain, question: '頭痛がある場合、あてはまるものを選んでください', karteLabel: '頭痛の特徴', type: 'multiple', options: HEADACHE_OPTIONS_7 },
  B7_migraine_history: { id: 'B7_migraine_history', icon: Brain, ...MIGRAINE_HISTORY },
  B7_headache_freq: { id: 'B7_headache_freq', icon: Brain, ...HEADACHE_FREQ },
  B8: { id: 'B8', question: '立ち上がった時に悪くなりますか？', karteLabel: '立位誘発', type: 'single', icon: Footprints,
    options: [
      { value: 'はい', label: 'はい' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない', karte: 'わからない' }
    ]},
  B8_recover: { id: 'B8_recover', icon: Footprints, question: '座る、横になると楽になりますか？', karteLabel: '座位・臥位で改善', type: 'single',
    options: [
      { value: 'はい', label: 'はい', karte: 'あり' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない', karte: 'わからない' }
    ]},
  B8_symptom: { id: 'B8_symptom', icon: Heart, question: 'めまいの時に次の症状がありますか？', karteLabel: '起立性随伴症状', type: 'multiple',
    options: [
      { value: '動悸', label: '動悸' },
      { value: '目の前が暗くなる', label: '目の前が暗くなる' },
      { value: '冷や汗', label: '冷や汗' },
      { value: 'どれもない', label: 'どれもない' },
      { value: 'わからない', label: 'わからない' }
    ]},

  // 分岐C
  C1: { id: 'C1', icon: Clock, question: 'このふらつきは、3か月以上ほぼ毎日ありますか？', karteLabel: '', type: 'single',
    options: [
      { value: 'はい', label: 'はい', karte: 'ふらつきは3か月以上続いている。' },
      { value: 'いいえ', label: 'いいえ', karte: 'ふらつきは3か月以上は続いていない。' },
      { value: 'わからない', label: 'わからない', karte: 'ふらつきは3か月以上続いているかよく分からない。' }
    ]},
  C2: { id: 'C2', icon: Ear, question: 'めまいの時に耳の症状はありますか？', karteLabel: '発作時耳症状', type: 'single',
    options: [
      { value: '耳鳴り・耳がつまる感じ・聞こえにくい', label: '耳鳴り・耳がつまる感じ・聞こえにくい' },
      { value: '耳が痛い', label: '耳が痛い' },
      { value: 'どれもない', label: 'どれもない' },
      { value: 'わからない', label: 'わからない' }
    ]},
  C2_ear_side: { id: 'C2_ear_side', icon: Ear, ...EAR_SIDE },
  C2_ear_type: { id: 'C2_ear_type', icon: Ear, ...EAR_TYPE_3 },
  C2_ear_vary: { id: 'C2_ear_vary', icon: Ear, ...EAR_VARY },
  C3: { id: 'C3', icon: Brain, question: 'めまいの時に頭痛はありますか？', karteLabel: '', type: 'single',
    options: [
      { value: 'ある', label: 'ある' },
      { value: 'ない', label: 'ない', karte: 'めまいの時に頭痛はなかった' },
      { value: 'わからない', label: 'わからない', karte: 'めまいの時の頭痛はわからない' }
    ]},
  C3_headache_feature: { id: 'C3_headache_feature', icon: Brain, question: '頭痛がある場合、あてはまるものを選んでください', karteLabel: '頭痛の特徴', type: 'multiple', options: HEADACHE_OPTIONS_7 },
  C3_migraine_history: { id: 'C3_migraine_history', icon: Brain, ...MIGRAINE_HISTORY },
  C3_headache_freq: { id: 'C3_headache_freq', icon: Brain, ...HEADACHE_FREQ },
  C4: { id: 'C4', icon: Eye, question: '次の時に悪くなりますか？', karteLabel: '慢性増悪因子', type: 'multiple',
    options: [
      { value: '立っている時', label: '立っている時' },
      { value: '歩いている時', label: '歩いている時' },
      { value: '人混み', label: '人混み' },
      { value: '店の中', label: '店の中' },
      { value: 'テレビや動画を見た時', label: 'テレビや動画を見た時' },
      { value: 'どれもない', label: 'どれもない' },
      { value: 'わからない', label: 'わからない' }
    ]},
  C5: { id: 'C5', icon: Moon, question: '暗い所でふらつきやすいですか？', karteLabel: '暗所で悪化', type: 'single',
    options: [
      { value: 'はい', label: 'はい', karte: 'あり' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない', karte: 'わからない' }
    ]},
  C6: { id: 'C6', icon: MapPin, question: 'でこぼこ道や階段でふらつきやすいですか？', karteLabel: '不整地で悪化', type: 'single',
    options: [
      { value: 'はい', label: 'はい', karte: 'あり' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない', karte: 'わからない' }
    ]},
  C7: { id: 'C7', icon: Eye, question: '歩いている時に、景色が揺れて見えることがありますか？', karteLabel: '歩行時の動揺視', type: 'single',
    options: [
      { value: 'はい', label: 'はい', karte: 'あり' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない', karte: 'わからない' }
    ]},
  C8: { id: 'C8', icon: AlertCircle, question: 'この1年で転んだことはありますか？', karteLabel: '', type: 'single',
    options: [
      { value: '2回以上ある', label: '2回以上ある', karte: 'この1年で2回以上転んだことがある。' },
      { value: '1回ある', label: '1回ある', karte: 'この1年で1回転んだことがある。' },
      { value: 'ない', label: 'ない', karte: 'この1年で転んだことはない。' },
      { value: 'わからない', label: 'わからない', karte: 'この1年で転んだかどうか分からない。' }
    ]},
  C9: { id: 'C9', icon: Waves, question: '船に乗っているように揺れる感じがありますか？', karteLabel: '船に乗っているように揺れる感じ', type: 'single',
    options: [
      { value: 'はい', label: 'はい' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない', karte: 'わからない' }
    ]},
  C9_recover: { id: 'C9_recover', icon: Waves, question: '車の運転中や乗り物に乗っている時は、一時的に楽になりますか？', karteLabel: '運転中・乗車中の改善', type: 'single',
    options: [
      { value: 'はい', label: 'はい', karte: 'あり' },
      { value: 'いいえ', label: 'いいえ', karte: 'なし' },
      { value: 'わからない', label: 'わからない' }
    ]},
  C10: { id: 'C10', icon: Sparkles, question: '今のふらつきが始まる前に、きっかけになったことはありますか？', karteLabel: '慢性化のきっかけ', type: 'multiple',
    options: [
      { value: '強いめまい発作', label: '強いめまい発作' },
      { value: '体調をくずした', label: '体調をくずした' },
      { value: '強いストレス', label: '強いストレス' },
      { value: '船や飛行機など長時間の乗り物', label: '船や飛行機など長時間の乗り物' },
      { value: '特に思い当たらない', label: '特に思い当たらない' },
      { value: 'わからない', label: 'わからない' }
    ]},

  // 分岐D
  D1: { id: 'D1', icon: Compass, question: 'いちばん近いのはどれですか？', karteLabel: 'いちばん近いめまいの経過', type: 'single',
    options: [
      { value: '頭を動かした時に起こることが多い', label: '頭を動かした時に起こることが多い', karte: '頭を動かした時に起こることが多い。' },
      { value: 'じっとしていても続くことが多い', label: 'じっとしていても続くことが多い', karte: 'じっとしていても続くことが多い。' },
      { value: '毎日のようにふらつく', label: '毎日のようにふらつく', karte: '毎日のようにふらつく。' },
      { value: 'まだよくわからない', label: 'まだよくわからない', karte: 'まだよくわからない。' }
    ]},
  D2: { id: 'D2', icon: Clock, question: 'めまいはどれくらいで楽になることが多いですか？', karteLabel: '持続時間', type: 'single',
    options: [
      { value: 'すぐおさまる', label: 'すぐおさまる' },
      { value: '数分でおさまる', label: '数分でおさまる' },
      { value: 'しばらく続く', label: 'しばらく続く' },
      { value: '半日以上続く', label: '半日以上続く' },
      { value: 'ずっと続いている', label: 'ずっと続いている' },
      { value: 'わからない', label: 'わからない' }
    ]},
  D3: { id: 'D3', icon: Ear, question: 'めまいの時に耳の症状はありますか？', karteLabel: '発作時耳症状', type: 'single',
    options: [
      { value: '耳鳴り・耳がつまる感じ・聞こえにくい', label: '耳鳴り・耳がつまる感じ・聞こえにくい' },
      { value: '耳が痛い', label: '耳が痛い' },
      { value: 'どれもない', label: 'どれもない' },
      { value: 'わからない', label: 'わからない' }
    ]},
  D3_ear_side: { id: 'D3_ear_side', icon: Ear, ...EAR_SIDE },
  D3_ear_type: { id: 'D3_ear_type', icon: Ear, ...EAR_TYPE_3 },
  D3_ear_vary: { id: 'D3_ear_vary', icon: Ear, ...EAR_VARY },
  D4: { id: 'D4', icon: AlertCircle, question: 'めまいの時に吐き気や嘔吐はありますか？', karteLabel: '', type: 'multiple',
    options: [
      { value: '吐き気', label: '吐き気', karte: 'めまい時の吐き気あった。' },
      { value: '吐いた', label: '吐いた', karte: 'めまい時に吐いた。' },
      { value: 'どれもない', label: 'どれもない', karte: 'めまい時の悪心嘔吐はなし。' },
      { value: 'わからない', label: 'わからない', karte: 'めまい時の悪心嘔吐はわからない。' }
    ]},
  D5: { id: 'D5', icon: Brain, question: 'めまいの時に頭痛はありますか？', karteLabel: '', type: 'single',
    options: [
      { value: 'ある', label: 'ある' },
      { value: 'ない', label: 'ない', karte: 'めまいの時に頭痛はなかった' },
      { value: 'わからない', label: 'わからない', karte: 'めまいの時の頭痛はわからない' }
    ]},
  D5_headache_feature: { id: 'D5_headache_feature', icon: Brain, question: '頭痛がある場合、あてはまるものを選んでください', karteLabel: '頭痛の特徴', type: 'multiple', options: HEADACHE_OPTIONS_7 },
  D5_migraine_history: { id: 'D5_migraine_history', icon: Brain, ...MIGRAINE_HISTORY },
  D5_headache_freq: { id: 'D5_headache_freq', icon: Brain, ...HEADACHE_FREQ },

  // 共通
  Q5: { id: 'Q5', icon: Waves, question: 'どんな感じのめまいですか？', karteLabel: 'めまいの型', type: 'multiple',
    options: [
      { value: 'ぐるぐる回る感じ', label: 'ぐるぐる回る感じ' },
      { value: 'ふらふらふらつく感じ', label: 'ふらふらふらつく感じ' },
      { value: 'くらっとなる感じ', label: 'くらっとなる感じ' },
      { value: 'ゆらゆらからだが安定しない感じ', label: 'ゆらゆらからだが安定しない感じ' },
      { value: '歩くとふらつく感じ', label: '歩くとふらつく感じ' },
      { value: '視界が揺れる感じ', label: '視界が揺れる感じ' },
      { value: '船に乗っているように揺れる感じ', label: '船に乗っているように揺れる感じ' },
      { value: 'うまく言えない', label: 'うまく言えない' }
    ]},
  Q6: { id: 'Q6', icon: ShieldAlert, question: 'めまいと一緒に、次の症状はありますか？', karteLabel: '危険徴候', type: 'multiple', isDangerSign: true,
    options: [
      { value: 'まっすぐ歩けない・立てない', label: 'まっすぐ歩けない・立てない' },
      { value: '手や足が動かしにくい', label: '手や足が動かしにくい' },
      { value: '手足がしびれる', label: '手足がしびれる' },
      { value: 'しゃべりにくい', label: 'しゃべりにくい' },
      { value: 'ものが二重に見える', label: 'ものが二重に見える' },
      { value: '強い頭痛', label: '強い頭痛' },
      { value: '吐いてばかりで水分がとれない', label: '吐いてばかりで水分がとれない' },
      { value: '意識を失った', label: '意識を失った' },
      { value: 'どれもない', label: 'どれもない' },
      { value: 'わからない', label: 'わからない' }
    ]},
  Q7: { id: 'Q7', icon: Activity, question: 'めまいのせいで困っていることはありますか？', karteLabel: 'めまいの程度', type: 'single',
    options: [
      { value: 'ふだんの生活はだいたいできている', label: 'ふだんの生活はだいたいできている' },
      { value: '仕事や運転など一部のことが難しい', label: '仕事や運転など一部のことが難しい' },
      { value: '外出や家事もつらくなっている', label: '外出や家事もつらくなっている' },
      { value: 'ほとんど何もできない', label: 'ほとんど何もできない' },
      { value: 'わからない', label: 'わからない' }
    ]},
  Q8: { id: 'Q8', icon: Pill, question: 'これまでに言われたことがある病気はありますか？', karteLabel: 'めまい関連疾患の既往', type: 'multiple',
    options: [
      { value: 'めまいの病気', label: 'めまいの病気' },
      { value: 'メニエール病', label: 'メニエール病' },
      { value: '片頭痛', label: '片頭痛' },
      { value: '脳梗塞', label: '脳梗塞' },
      { value: '不整脈', label: '不整脈' },
      { value: '高血圧', label: '高血圧' },
      { value: '糖尿病', label: '糖尿病' },
      { value: '不安症・パニック', label: '不安症・パニック' },
      { value: '特にない', label: '特にない' },
      { value: 'わからない', label: 'わからない' }
    ]}
};

// ============================================================
// 動的フロー
// ============================================================
function getQuestionFlow(answers) {
  const flow = ['Q1', 'Q2', 'Q3', 'Q4'];
  const branch = answers.Q4?.value;

  if (branch === 'A') {
    flow.push('A1', 'A2', 'A3');
    if (answers.A3?.value === '耳鳴り・耳がつまる感じ・聞こえにくい') flow.push('A3_ear_side', 'A3_ear_type', 'A3_ear_vary');
    flow.push('A4', 'A5');
    if (answers.A5?.value === 'ある') flow.push('A5_headache_feature', 'A5_migraine_history');
  } else if (branch === 'B') {
    flow.push('B1');
    const b1List = Array.isArray(answers.B1?.value) ? answers.B1.value : [];
    if (b1List.includes('寝返りや起き上がる動作')) flow.push('B1a_movement', 'B1a_recover');
    if (b1List.includes('大きな音やせき・くしゃみ')) flow.push('B1b');
    if (b1List.includes('車・船・エレベーターなどに乗った時')) {
      flow.push('B1c');
      if (answers.B1c?.value === 'はい') flow.push('B1c_yes');
    }
    flow.push('B2', 'B3', 'B4', 'B5', 'B6');
    if (answers.B6?.value === '耳鳴り・耳がつまる感じ・聞こえにくい') flow.push('B6_ear_side', 'B6_ear_type', 'B6_ear_vary');
    flow.push('B7');
    if (answers.B7?.value === 'ある') flow.push('B7_headache_feature', 'B7_migraine_history', 'B7_headache_freq');
    flow.push('B8');
    if (answers.B8?.value === 'はい') flow.push('B8_recover', 'B8_symptom');
  } else if (branch === 'C') {
    flow.push('C1', 'C2');
    if (answers.C2?.value === '耳鳴り・耳がつまる感じ・聞こえにくい') flow.push('C2_ear_side', 'C2_ear_type', 'C2_ear_vary');
    flow.push('C3');
    if (answers.C3?.value === 'ある') flow.push('C3_headache_feature', 'C3_migraine_history', 'C3_headache_freq');
    flow.push('C4', 'C5', 'C6', 'C7', 'C8', 'C9');
    if (answers.C9?.value === 'はい') flow.push('C9_recover');
    flow.push('C10');
  } else if (branch === 'D') {
    flow.push('D1', 'D2', 'D3');
    if (answers.D3?.value === '耳鳴り・耳がつまる感じ・聞こえにくい') flow.push('D3_ear_side', 'D3_ear_type', 'D3_ear_vary');
    flow.push('D4', 'D5');
    if (answers.D5?.value === 'ある') flow.push('D5_headache_feature', 'D5_migraine_history', 'D5_headache_freq');
  }
  flow.push('Q5', 'Q6', 'Q7', 'Q8');
  return flow;
}

function generateKarte(answers) {
  const flow = getQuestionFlow(answers);
  const sections = [];
  for (const qid of flow) {
    const q = QUESTIONS[qid];
    if (!q || !answers[qid]) continue;
    const ans = answers[qid];
    const label = q.karteLabel || '';
    let values = q.type === 'multiple'
      ? (Array.isArray(ans.value) ? ans.value : [ans.value])
      : [ans.value];
    if (values.length === 0 || values[0] === undefined) continue;
    let karteTexts = [];
    for (const v of values) {
      const opt = q.options?.find(o => o.value === v);
      if (!opt) continue;
      karteTexts.push(opt.karte !== undefined ? opt.karte : v);
    }
    const text = karteTexts.join('');
    if (!text.trim()) continue;
    sections.push({ label, text, qid });
  }
  return sections;
}

// ============================================================
// 共通コンポーネント
// ============================================================
function QRCodeDisplay({ url, size = 200 }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=2A4365&bgcolor=FFFFFF&margin=2`;
  return <img src={qrUrl} alt="QR" width={size} height={size} className="rounded-xl border-4 border-white shadow-lg"/>;
}

function VertigoIllustration({ className = "w-32 h-32" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FED7AA" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#halo)"/>
      <path d="M 100 100 m -50 0 a 50 50 0 1 1 100 0 a 40 40 0 1 0 -80 0 a 30 30 0 1 1 60 0 a 20 20 0 1 0 -40 0 a 10 10 0 1 1 20 0" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
      <circle cx="100" cy="100" r="32" fill="#FFEDD5" stroke="#92400E" strokeWidth="2"/>
      <g transform="translate(89, 95)">
        <circle r="5" fill="white" stroke="#92400E" strokeWidth="1.5"/>
        <path d="M 0 0 m -2 0 a 2 2 0 1 1 4 0 a 1.5 1.5 0 1 0 -3 0" fill="none" stroke="#92400E" strokeWidth="1"/>
      </g>
      <g transform="translate(111, 95)">
        <circle r="5" fill="white" stroke="#92400E" strokeWidth="1.5"/>
        <path d="M 0 0 m -2 0 a 2 2 0 1 1 4 0 a 1.5 1.5 0 1 0 -3 0" fill="none" stroke="#92400E" strokeWidth="1"/>
      </g>
      <path d="M 92 113 Q 100 108 108 113" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round"/>
      <g fill="#FCD34D" opacity="0.8">
        <circle cx="40" cy="60" r="3"/><circle cx="160" cy="50" r="2.5"/>
        <circle cx="50" cy="150" r="2"/><circle cx="155" cy="155" r="3"/>
        <circle cx="170" cy="100" r="2"/><circle cx="30" cy="105" r="2"/>
      </g>
    </svg>
  );
}

function CopyButton({ text, label = 'コピー', fullWidth = false, dark = false }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const colorClass = copied
    ? 'bg-emerald-100 text-emerald-700'
    : dark
    ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
    : 'bg-white/20 text-white hover:bg-white/30';
  return (
    <button onClick={handleCopy} className={`px-4 py-2 ${fullWidth ? 'w-full justify-center' : ''} ${colorClass} rounded-xl font-bold text-sm transition-all flex items-center gap-2`}>
      {copied ? <CheckCircle2 className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
      {copied ? 'コピーしました' : label}
    </button>
  );
}

function QRModal({ onClose }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        <div className="text-center">
          <div className="inline-flex p-3 bg-amber-100 rounded-2xl mb-4"><QrCode className="w-8 h-8 text-amber-700"/></div>
          <h3 className="text-2xl font-bold text-stone-800 mb-2" style={{fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif'}}>QRコード</h3>
          <p className="text-stone-600 text-sm mb-6">このコードを読み取って<br/>共有してください</p>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl mb-6 inline-block">
            <QRCodeDisplay url={url} size={220}/>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 break-all text-xs text-stone-600 mb-4 font-mono">{url}</div>
          <CopyButton text={url} label="URLをコピー" fullWidth dark/>
        </div>
      </div>
    </div>
  );
}

// Googleフォーム URL(ご意見・ご感想用)
const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeWqyPLKJOvCAW7oYzZh6SesF2I3uC-R-YDXANWcdQXhVw35g/viewform";

function FeedbackView({ onBack }) {
  const handleOpenForm = () => {
    window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={onBack} className="flex items-center gap-1 text-stone-600 hover:text-stone-900 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4"/> 戻る
        </button>
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-stone-800 to-stone-900 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl"><MessageSquare className="w-6 h-6"/></div>
              <div>
                <h1 className="text-xl font-bold" style={{fontFamily: '"Hiragino Mincho ProN", serif'}}>ご意見をお寄せください</h1>
                <p className="text-xs text-stone-300 mt-0.5">この問診について、改善のためにご意見を頂戴いたします</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* 案内メッセージ */}
            <div className="text-center">
              <div className="inline-flex p-4 bg-amber-100 rounded-2xl mb-4">
                <MessageSquare className="w-10 h-10 text-amber-700"/>
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-3" style={{fontFamily: '"Hiragino Mincho ProN", serif'}}>
                Googleフォームで<br/>ご意見をお聞かせください
              </h2>
              <p className="text-stone-600 leading-relaxed">
                先生方の貴重なご意見・ご感想を<br/>
                今後の研究の参考にさせていただきます。<br/>
                <span className="text-sm text-stone-500">所要時間: 約1〜2分</span>
              </p>
            </div>

            {/* フォーム内容のプレビュー */}
            <div className="bg-amber-50 rounded-2xl p-5 space-y-2.5">
              <div className="text-sm font-bold text-amber-900 mb-2">📋 アンケート項目</div>
              {[
                { label: '総合評価', desc: '5段階評価', required: true },
                { label: 'コメント・改善提案', desc: 'ご自由にお書きください', required: true },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0"/>
                  <div className="flex-1">
                    <span className="font-medium text-stone-800">{item.label}</span>
                    {item.required && <span className="ml-1.5 text-[10px] text-rose-600 font-bold">必須</span>}
                    <span className="ml-2 text-stone-500 text-xs">({item.desc})</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 送信ボタン */}
            <button
              onClick={handleOpenForm}
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] text-lg"
            >
              <Send className="w-5 h-5"/>
              アンケートに回答する
            </button>

            <p className="text-xs text-stone-500 text-center leading-relaxed">
              ※ ボタンを押すとGoogleフォームが新しいタブで開きます<br/>
              ※ ご回答内容は本研究の改善のためのみに使用されます
            </p>
          </div>
        </div>

        {/* QRコード案内(オプション) */}
        <div className="mt-6 bg-white/60 backdrop-blur rounded-2xl border border-white p-5 text-center">
          <p className="text-sm text-stone-600">
            スマートフォンから直接フォームを開きたい場合は<br/>
            学会ポスターのQRコードをご利用ください
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// チャットメッセージコンポーネント
// ============================================================
function DoctorMessage({ children, time, withAvatar = true }) {
  return (
    <div className="flex gap-2 mb-1.5 animate-fadeIn">
      <div className="w-9 shrink-0">
        {withAvatar && (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.5}/>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start max-w-[82%]">
        {withAvatar && <div className="text-[11px] text-stone-500 mb-0.5 ml-1">めまい外来</div>}
        <div className="flex items-end gap-1.5">
          <div className="bg-white rounded-2xl rounded-tl-md shadow-sm border border-stone-100 px-4 py-2.5 text-stone-800 text-[15px] leading-relaxed">
            {children}
          </div>
          {time && <div className="text-[10px] text-stone-400 pb-0.5 whitespace-nowrap">{time}</div>}
        </div>
      </div>
    </div>
  );
}

function PatientMessage({ children, time }) {
  return (
    <div className="flex gap-2 mb-1.5 justify-end animate-fadeIn">
      <div className="flex flex-col items-end max-w-[82%]">
        <div className="flex items-end gap-1.5">
          {time && <div className="text-[10px] text-stone-400 pb-0.5 whitespace-nowrap">{time}</div>}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl rounded-tr-md shadow-sm px-4 py-2.5 text-[15px] leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-1.5 animate-fadeIn">
      <div className="w-9 shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
          <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.5}/>
        </div>
      </div>
      <div className="bg-white rounded-2xl rounded-tl-md shadow-sm border border-stone-100 px-4 py-3.5">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{animationDelay: '0ms'}}/>
          <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{animationDelay: '150ms'}}/>
          <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{animationDelay: '300ms'}}/>
        </div>
      </div>
    </div>
  );
}

function getCurrentTime() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ============================================================
// メインアプリ
// ============================================================
export default function VertigoQuestionnaireApp() {
  const [view, setView] = useState('start');
  const [answers, setAnswers] = useState({});
  const [currentQid, setCurrentQid] = useState('Q1');
  const [askedQids, setAskedQids] = useState(['Q1']);
  const [showQR, setShowQR] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingMultiple, setPendingMultiple] = useState({});
  const messagesEndRef = useRef(null);

  const flow = useMemo(() => getQuestionFlow(answers), [answers]);
  const currentIdx = flow.indexOf(currentQid);
  const progress = currentIdx >= 0 ? Math.min(100, Math.round(((currentIdx + 1) / Math.max(flow.length, 18)) * 100)) : 0;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [askedQids, isTyping, currentQid, pendingMultiple]);

  const handleSingleSelect = (option) => {
    const newAnswers = { ...answers, [currentQid]: { value: option.value, option } };
    setAnswers(newAnswers);
    proceedToNext(newAnswers);
  };

  const handleMultipleToggle = (option) => {
    const cur = pendingMultiple[currentQid] || [];
    const next = cur.includes(option.value) ? cur.filter(v => v !== option.value) : [...cur, option.value];
    setPendingMultiple({ ...pendingMultiple, [currentQid]: next });
  };

  const handleMultipleConfirm = () => {
    const values = pendingMultiple[currentQid] || [];
    if (values.length === 0) return;
    const newAnswers = { ...answers, [currentQid]: { value: values } };
    setAnswers(newAnswers);
    proceedToNext(newAnswers);
  };

  const proceedToNext = (newAnswers) => {
    const newFlow = getQuestionFlow(newAnswers);
    const idx = newFlow.indexOf(currentQid);
    if (idx >= 0 && idx < newFlow.length - 1) {
      const nextQid = newFlow[idx + 1];
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentQid(nextQid);
        setAskedQids(prev => [...prev, nextQid]);
      }, 700);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setView('result');
      }, 800);
    }
  };

  const handleStart = () => {
    setAnswers({}); setCurrentQid('Q1'); setAskedQids(['Q1']); setPendingMultiple({});
    setView('quiz');
  };

  const handleReset = () => {
    setAnswers({}); setCurrentQid('Q1'); setAskedQids(['Q1']); setPendingMultiple({});
    setView('start');
  };

  const karteSections = useMemo(() => generateKarte(answers), [answers]);
  const karteText = useMemo(() => karteSections.map(s => s.label ? `【${s.label}】${s.text}` : s.text).join('\n'), [karteSections]);

  // === START SCREEN ===
  if (view === 'start') {
    return (
      <>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.4s ease-out; }`}</style>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl"/>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-rose-200 rounded-full blur-3xl"/>
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-orange-200 rounded-full blur-3xl"/>
          </div>
          <div className="relative max-w-2xl mx-auto px-6 py-12">
            <header className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/70 backdrop-blur rounded-full border border-amber-200">
                <Sparkles className="w-4 h-4 text-amber-600"/>
                <span className="text-sm text-amber-900 font-medium tracking-wide">学会デモ用 — めまい診療AI支援研究</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-3 leading-tight" style={{fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif'}}>めまい問診</h1>
              <p className="text-stone-600 tracking-wide">Web Questionnaire for Vertigo & Dizziness</p>
            </header>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-8 md:p-10 mb-6">
              <div className="flex justify-center mb-6"><VertigoIllustration className="w-40 h-40"/></div>
              <h2 className="text-2xl font-bold text-stone-800 text-center mb-3" style={{fontFamily: '"Hiragino Mincho ProN", serif'}}>めまいについて教えてください</h2>
              <p className="text-stone-600 text-center mb-8 leading-relaxed">
                ICVD国際前庭疾患分類に基づいた問診です。<br/>
                所要時間は<strong className="text-amber-700">3〜5分</strong>程度です。
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Stethoscope, label: 'ICVD準拠', desc: '14疾患を網羅' },
                  { icon: Brain, label: 'AI連携', desc: '鑑別診断支援' },
                  { icon: FileText, label: 'カルテ出力', desc: '構造化テキスト' }
                ].map((f, i) => (
                  <div key={i} className="text-center p-3 bg-amber-50 rounded-2xl">
                    <f.icon className="w-6 h-6 mx-auto mb-1.5 text-amber-700"/>
                    <div className="text-xs font-bold text-stone-700">{f.label}</div>
                    <div className="text-[10px] text-stone-500">{f.desc}</div>
                  </div>
                ))}
              </div>
              <button onClick={handleStart} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-lg">
                はじめる<ChevronRight className="w-5 h-5"/>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <button onClick={() => setShowQR(true)} className="p-5 bg-white/70 backdrop-blur rounded-2xl border border-white hover:bg-white/90 transition-all text-left group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-stone-800 rounded-xl group-hover:bg-amber-600 transition-colors"><QrCode className="w-5 h-5 text-white"/></div>
                  <div>
                    <div className="font-bold text-stone-800 mb-0.5">QRコードで共有</div>
                    <div className="text-sm text-stone-600">他の先生にも試してもらう</div>
                  </div>
                </div>
              </button>
              <button onClick={() => setView('feedback')} className="p-5 bg-white/70 backdrop-blur rounded-2xl border border-white hover:bg-white/90 transition-all text-left group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-stone-800 rounded-xl group-hover:bg-amber-600 transition-colors"><MessageSquare className="w-5 h-5 text-white"/></div>
                  <div>
                    <div className="font-bold text-stone-800 mb-0.5">ご意見をお寄せください</div>
                    <div className="text-sm text-stone-600">先生方のご意見・改善提案</div>
                  </div>
                </div>
              </button>
            </div>
            <footer className="text-center text-xs text-stone-500 mt-8 leading-relaxed">
              <p className="font-medium">せきね耳鼻咽喉科医院 × 徳島大学耳鼻咽喉科</p>
              <p>関根和教 ・ 佐藤豪 ・ 高岡奨 ・ 戸村美紀 ・ 北村嘉章</p>
            </footer>
          </div>
          {showQR && <QRModal onClose={() => setShowQR(false)}/>}
        </div>
      </>
    );
  }

  if (view === 'feedback') return <FeedbackView onBack={() => setView('start')}/>;

  // === RESULT SCREEN ===
  if (view === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-100 rounded-xl"><CheckCircle2 className="w-7 h-7 text-emerald-600"/></div>
              <div>
                <h1 className="text-3xl font-bold text-stone-800" style={{fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif'}}>問診完了</h1>
                <p className="text-stone-600 text-sm">ご回答ありがとうございました</p>
              </div>
            </div>
          </header>
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden mb-6">
            <div className="px-6 py-4 bg-stone-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5"/>
                <h2 className="font-bold">カルテ出力プレビュー</h2>
              </div>
              <CopyButton text={karteText}/>
            </div>
            <div className="p-6 bg-stone-50">
              <div className="bg-white rounded-2xl p-6 border border-stone-200 text-sm leading-relaxed text-stone-800 whitespace-pre-wrap" style={{fontFamily: '"Yu Gothic", "Hiragino Sans", sans-serif'}}>
                {karteSections.length === 0 ? <span className="text-stone-400">回答がありません</span> :
                  karteSections.map((s, i) => (
                    <div key={i} className="mb-1.5">
                      {s.label && <span className="text-amber-700 font-bold">【{s.label}】</span>}
                      <span>{s.text}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={handleReset} className="px-5 py-3.5 bg-white border-2 border-stone-200 text-stone-700 font-bold rounded-2xl hover:bg-stone-50 transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4"/> 最初から
            </button>
            <button onClick={() => setShowQR(true)} className="px-5 py-3.5 bg-white border-2 border-stone-200 text-stone-700 font-bold rounded-2xl hover:bg-stone-50 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4"/> QRコード
            </button>
            <button onClick={() => setView('feedback')} className="px-5 py-3.5 bg-stone-800 text-white font-bold rounded-2xl hover:bg-stone-900 transition-all flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4"/> ご意見を送る
            </button>
          </div>
        </div>
        {showQR && <QRModal onClose={() => setShowQR(false)}/>}
      </div>
    );
  }

  // === QUIZ SCREEN (CHAT STYLE) ===
  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50/50 to-stone-50">
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={handleReset} className="p-1.5 -ml-1.5 hover:bg-stone-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-stone-600"/>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
              <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.5}/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-stone-800 text-[15px]" style={{fontFamily: '"Hiragino Mincho ProN", serif'}}>めまい外来 受付</div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                オンライン
              </div>
            </div>
            <div className="text-xs font-bold text-amber-700 tracking-wider px-3 py-1 bg-amber-50 rounded-full">
              {currentIdx + 1} / {flow.length}
            </div>
          </div>
          <div className="h-1 bg-stone-200">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${progress}%` }}/>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-5 pb-32">
            <DoctorMessage time={getCurrentTime()}>
              <div className="space-y-1">
                <div className="font-bold text-amber-700 text-sm mb-1">こんにちは 👋</div>
                <div>これからめまいについて、いくつか質問させていただきます。</div>
                <div className="text-sm text-stone-600 mt-2">分からない場合は「わからない」を選んでください。</div>
              </div>
            </DoctorMessage>

            {askedQids.map((qid) => {
              const q = QUESTIONS[qid];
              if (!q) return null;
              const isCurrent = qid === currentQid;
              const ans = answers[qid];
              const isAnswered = ans !== undefined;
              const Icon = q.icon || CircleDot;
              const isDangerSign = q.isDangerSign;

              return (
                <React.Fragment key={qid}>
                  <DoctorMessage time={getCurrentTime()}>
                    <div className="flex items-start gap-2 mb-1.5">
                      <div className={`p-1 rounded-md mt-0.5 shrink-0 ${isDangerSign ? 'bg-rose-100' : 'bg-amber-100'}`}>
                        <Icon className={`w-3.5 h-3.5 ${isDangerSign ? 'text-rose-700' : 'text-amber-700'}`} strokeWidth={2.5}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold tracking-wider mb-0.5 ${isDangerSign ? 'text-rose-700' : 'text-amber-700'}`}>
                          {qid}{q.karteLabel ? ` ・ ${q.karteLabel}` : ''}
                        </div>
                        <div className="font-medium leading-relaxed">
                          {q.question}
                          {q.type === 'multiple' && (
                            <span className="ml-1.5 inline-block text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md align-middle">【複数選択可】</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </DoctorMessage>

                  {isAnswered ? (
                    <PatientMessage time={getCurrentTime()}>
                      {q.type === 'multiple' ? (
                        <div className="space-y-0.5">
                          {(Array.isArray(ans.value) ? ans.value : [ans.value]).map((v, i) => {
                            const opt = q.options.find(o => o.value === v);
                            return (
                              <div key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-90"/>
                                <span>{opt?.label || v}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div>{q.options.find(o => o.value === ans.value)?.label || ans.value}</div>
                      )}
                    </PatientMessage>
                  ) : isCurrent ? (
                    <div className="ml-11 mt-2 mb-3 space-y-2 animate-fadeIn">
                      {q.type === 'single' ? (
                        q.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSingleSelect(opt)}
                            className={`block w-full max-w-[88%] px-4 py-2.5 text-left rounded-2xl border-2 transition-all ${
                              isDangerSign 
                                ? 'border-rose-200 bg-white hover:border-rose-400 hover:bg-rose-50 hover:shadow-md'
                                : 'border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50 hover:shadow-md'
                            } group`}
                          >
                            <div className="font-medium text-stone-800 group-hover:text-amber-700 transition-colors">{opt.label}</div>
                            {opt.sublabel && <div className="text-xs text-stone-500 mt-0.5">{opt.sublabel}</div>}
                          </button>
                        ))
                      ) : (
                        <>
                          <div className="bg-white rounded-2xl border-2 border-amber-200 p-3 max-w-[92%] shadow-sm">
                            <div className="space-y-1.5">
                              {q.options.map((opt, i) => {
                                const cur = pendingMultiple[currentQid] || [];
                                const checked = cur.includes(opt.value);
                                return (
                                  <button
                                    key={i}
                                    onClick={() => handleMultipleToggle(opt)}
                                    className={`w-full px-3 py-2 rounded-xl border-2 transition-all text-left flex items-center gap-2.5 ${
                                      checked
                                        ? (isDangerSign ? 'border-rose-400 bg-rose-50' : 'border-amber-400 bg-amber-50')
                                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                                    }`}
                                  >
                                    <div className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                      checked
                                        ? (isDangerSign ? 'border-rose-500 bg-rose-500' : 'border-amber-500 bg-amber-500')
                                        : 'border-stone-300'
                                    }`}>
                                      {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-stone-800 text-[14px]">{opt.label}</div>
                                      {opt.sublabel && <div className="text-[11px] text-stone-500 mt-0.5">{opt.sublabel}</div>}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <button
                            onClick={handleMultipleConfirm}
                            disabled={!pendingMultiple[currentQid] || pendingMultiple[currentQid].length === 0}
                            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                              pendingMultiple[currentQid] && pendingMultiple[currentQid].length > 0
                                ? (isDangerSign 
                                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200 hover:scale-[1.02]'
                                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200 hover:scale-[1.02]')
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            }`}
                          >
                            <Send className="w-3.5 h-3.5"/>
                            送信 {pendingMultiple[currentQid]?.length > 0 && `(${pendingMultiple[currentQid].length})`}
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}

            {isTyping && <TypingIndicator/>}
            <div ref={messagesEndRef} className="h-2"/>
          </div>
        </div>
      </div>
    </>
  );
}
