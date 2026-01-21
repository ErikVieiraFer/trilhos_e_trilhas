import { Check, X, Backpack } from 'lucide-react'

const ICONS = {
  incluso: <Check className="text-green-400" size={20} />,
  'nao-incluso': <X className="text-red-400" size={20} />,
  'o-que-levar': <Backpack className="text-cyan-400" size={20} />,
}

const BORDER_COLORS = {
  incluso: 'hover:shadow-green-500/10',
  'nao-incluso': 'hover:shadow-red-500/10',
  'o-que-levar': 'hover:shadow-cyan-500/10',
}

const ICON_BG_COLORS = {
  incluso: 'bg-green-500/20',
  'nao-incluso': 'bg-red-500/20',
  'o-que-levar': 'bg-cyan-500/20',
}

const ITEM_ICON_BG_COLORS = {
    incluso: 'bg-green-500/10 group-hover/item:bg-green-500/20',
    'nao-incluso': 'bg-red-500/10 group-hover/item:bg-red-500/20',
    'o-que-levar': 'bg-cyan-500/10 group-hover/item:bg-cyan-500/20',
}

const ITEM_ICON = {
    incluso: <Check size={16} className="text-green-400" />,
    'nao-incluso': <X size={16} className="text-red-400" />,
    'o-que-levar': <Backpack size={16} className="text-cyan-400" />,
}

const InfoCard = ({ title, items, type = 'incluso' }) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 h-full transition-all duration-500 hover:bg-white/10 hover:shadow-xl ${BORDER_COLORS[type]} group`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${ICON_BG_COLORS[type]}`}
        >
          {ICONS[type]}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${ITEM_ICON_BG_COLORS[type]}`}
            >
              {ITEM_ICON[type]}
            </div>
            <span className="text-white/80 group-hover/item:text-white transition-colors font-medium">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoCard
