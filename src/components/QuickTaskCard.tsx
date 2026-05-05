import type { AgentTask } from '@/types/database'

interface QuickTaskCardProps {
  task: AgentTask
  agentWebsite: string | null
}

function formatPrice(price: number): string {
  return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`
}

export function QuickTaskCard({ task, agentWebsite }: QuickTaskCardProps) {
  const href = agentWebsite
    ? `${agentWebsite}?utm_source=agentfinder&utm_medium=quick_task&task=${task.id}`
    : null

  return (
    <div className="rounded-xl border border-slate-200 p-4 flex flex-col gap-2">
      <p className="font-semibold text-slate-900 text-sm">{task.title}</p>
      <p className="text-slate-500 text-sm line-clamp-2">{task.description}</p>
      <p className="text-slate-700 font-semibold text-sm">
        {formatPrice(task.price_usd)}
        {task.expected_duration_minutes !== null && ` · ~${task.expected_duration_minutes} min`}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors text-center"
        >
          Run this task
        </a>
      ) : (
        <span className="mt-1 inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-full opacity-50 cursor-not-allowed text-center">
          Run this task
        </span>
      )}
    </div>
  )
}
