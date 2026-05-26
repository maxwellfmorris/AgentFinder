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
    <div className="rounded-xl border border-grape/10 bg-white p-4 flex flex-col gap-2">
      <p className="font-semibold text-ink text-sm">{task.title}</p>
      <p className="text-muted text-sm line-clamp-2">{task.description}</p>
      <p className="text-ink/80 font-semibold text-sm">
        {formatPrice(task.price_usd)}
        {task.expected_duration_minutes !== null && ` · ~${task.expected_duration_minutes} min`}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block bg-grape text-white text-sm px-4 py-2 rounded-full hover:brightness-110 transition text-center"
        >
          Run this task
        </a>
      ) : (
        <span className="mt-1 inline-block bg-grape text-white text-sm px-4 py-2 rounded-full opacity-50 cursor-not-allowed text-center">
          Run this task
        </span>
      )}
    </div>
  )
}
