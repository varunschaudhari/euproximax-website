import { FormEvent, useState } from 'react'
import { submitPatentIntake, PatentIntakePayload } from '../services/patentIntakeService'
import { ApiError } from '../utils/apiClient'

const JURISDICTIONS = ['india', 'usa', 'pct']

export default function Apply() {
  const [form, setForm] = useState<PatentIntakePayload>({
    clientName: '',
    email: '',
    phone: '',
    whatsapp: '',
    track: 'B',
    inventionTitle: '',
    inventionDomain: '',
    inventionSummary: '',
    jurisdiction: ['india'],
    hearAboutUs: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const set = (k: keyof PatentIntakePayload, v: unknown) => setForm((f) => ({ ...f, [k]: v }))
  const toggleJur = (j: string) =>
    setForm((f) => {
      const cur = f.jurisdiction || []
      return { ...f, jurisdiction: cur.includes(j) ? cur.filter((x) => x !== j) : [...cur, j] }
    })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.clientName || !form.email || !form.phone) {
      setError('Please provide your name, email and phone.')
      return
    }
    setSubmitting(true)
    try {
      const res = await submitPatentIntake(form)
      setDone(res.data.caseNumber)
    } catch (err) {
      setError((err as ApiError).message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = 'h-11 w-full rounded-xl border-2 border-gray-200 px-3 text-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
  const lbl = 'mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300'

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/40 dark:bg-emerald-900/20">
          <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Application received 🎉</h1>
          <p className="mt-2 text-emerald-700 dark:text-emerald-300">
            Your reference is <b>{done}</b>. Our team will review your idea and reach out shortly with next steps.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-100">Protect your invention</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Tell us about your idea. We'll guide you from prior-art search through filing to grant.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</div>
        )}

        <div>
          <label className={lbl}>Which best describes your invention?</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { v: 'B', t: 'Ready invention', d: 'Fully formed & documented' },
              { v: 'A', t: 'Rough idea', d: 'Needs a prototype first' }
            ].map((o) => (
              <button
                type="button"
                key={o.v}
                onClick={() => set('track', o.v)}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  form.track === o.v
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 dark:border-slate-700'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-slate-100">Track {o.v} — {o.t}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">{o.d}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl}>Full name *</label>
            <input className={field} value={form.clientName} onChange={(e) => set('clientName', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Email *</label>
            <input type="email" className={field} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Phone *</label>
            <input className={field} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>WhatsApp (optional)</label>
            <input className={field} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl}>Invention title</label>
            <input className={field} value={form.inventionTitle} onChange={(e) => set('inventionTitle', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Domain / field</label>
            <input className={field} value={form.inventionDomain} onChange={(e) => set('inventionDomain', e.target.value)} placeholder="e.g. mechanical, electronics" />
          </div>
        </div>

        <div>
          <label className={lbl}>Brief description</label>
          <textarea
            rows={4}
            className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            value={form.inventionSummary}
            onChange={(e) => set('inventionSummary', e.target.value)}
            placeholder="What problem does it solve? What makes it novel?"
          />
        </div>

        <div>
          <label className={lbl}>Where do you want protection?</label>
          <div className="flex flex-wrap gap-3">
            {JURISDICTIONS.map((j) => (
              <label key={j} className="flex items-center gap-1.5 text-sm capitalize text-gray-700 dark:text-slate-300">
                <input type="checkbox" checked={(form.jurisdiction || []).includes(j)} onChange={() => toggleJur(j)} /> {j}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={lbl}>How did you hear about us? (optional)</label>
          <input className={field} value={form.hearAboutUs} onChange={(e) => set('hearAboutUs', e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </div>
  )
}
