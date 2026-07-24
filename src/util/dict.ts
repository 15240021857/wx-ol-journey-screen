interface UvDict {
  color: string
  name: string
  tip: string
}
// 紫外线颜色
export const uvColorMap: Record<number, UvDict> = {
  1: {
    color: '#34D399',
    name: '最弱',
    tip: '安全，基本无需防护'
  },
  2: {
    color: '#FBBF24',
    name: '弱',
    tip: '适当防护，长时间户外建议防晒'
  },
  3: {
    color: '#FB923C',
    name: '中等',
    tip: '需涂防晒霜、戴帽子等'
  },
  4: {
    color: '#EF4444',
    name: '强',
    tip: '紫外线较强，避免中午暴晒'
  },
  5: {
    color: '#A855F7',
    name: '极强',
    tip: '极度注意防护，尽量减少暴露'
  }
}
export const getUvDict = (uvIndex: number): UvDict => {
  let uvLevel = 1
  if (uvIndex > 0 && uvIndex <= 2) {
    uvLevel = 1
  } else if (uvIndex > 3 && uvIndex <= 4) {
    uvLevel = 2
  } else if (uvIndex > 5 && uvIndex <= 6) {
    uvLevel = 3
  } else if (uvIndex > 7 && uvIndex <= 9) {
    uvLevel = 4
  } else if (uvIndex > 9) {
    uvLevel = 5
  }
  return uvColorMap[uvLevel] || {}
}
// 能见度
export const visMap = {
  1: {
    color: '#1BBCFD',
    name: '优'
  },
  2: {
    color: '#009FF0',
    name: '良'
  },
  3: {
    color: '#FFFF00',
    name: '一般'
  },
  4: {
    color: '#FA9900',
    name: '较差'
  },
  5: {
    color: '#FF6800',
    name: '差'
  },
  6: {
    color: '#FF0000',
    name: '极差'
  }
}
// 预警严重程度
// unknown：严重性未知
// minor：对生命或财产构成的威胁极小或没有已知威胁
// moderate：对生命或财产可能构成威胁
// severe：对生命或财产构成的重大威胁
// extreme：对生命或财产构成的严重威胁
export const severityMap = {
  unknown: {
    name: '严重性未知',
    color: 'gray'
  },
  minor: {
    name: '对生命或财产构成的威胁极小或没有已知威胁',
    color: '#009FF0'
  },
  moderate: {
    name: '对生命或财产可能构成威胁',
    color: '#FB923C'
  },
  severe: {
    name: '对生命或财产构成的重大威胁',
    color: '#EF4444'
  },
  extreme: {
    name: '对生命或财产构成的严重威胁',
    color: '#A855F7'
  }
}
// urgency 表示预警信息的紧迫性，包括：
// immediate：必须立刻采取行动
// expected：应尽快采取行动（通常在 1 小时内）
// future：应在近期采取行动
// past：事件已不再发生
// unknown：紧迫性未知
export const urgencyMap = {
  immediate: {
    name: '必须立刻采取行动',
    color: '#EF4444'
  },
  expected: {
    name: '应尽快采取行动（通常在 1 小时内）',
    color: '#FB923C'
  },
  future: {
    name: '应在近期采取行动',
    color: '#009FF0'
  },
  past: {
    name: '事件已不再发生',
    color: '#34D399'
  },
  unknown: {
    name: '紧迫性未知',
    color: 'gray'
  }
}
// certainty 表示预警信息的确定性或可信度，包括：
// observed：事件已经发生或正在发生
// likely：发生概率大于约 50%
// possible：有可能发生，但概率较低（≤ 50%）
// unlikely：预计不会发生（概率接近 0）
// unknown：确定性未知
export const certaintyMap = {
  observed: {
    name: '事件已经发生或正在发生',
    color: '#FB923C'
  },
  likely: {
    name: '发生概率大于约 50%',
    color: '#FFFF00'
  },
  possible: {
    name: '有可能发生，但概率较低（≤ 50%）',
    color: '#009FF0'
  },
  unlikely: {
    name: '预计不会发生（概率接近 0）',
    color: '#34D399'
  },
  unknown: {
    name: '确定性未知',
    color: 'gray'
  }
}
