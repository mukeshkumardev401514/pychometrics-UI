"use client"
import { useEffect, useState } from "react"
import { loadAll, assignmentError, type AssignmentRecord, type CatalogRecord } from "@/lib/doctor-assignments"
import { patientResults, score, difference, type ComparisonResult, type ResultAttempt, type ResultDimension } from "@/lib/result-comparison"
export default function PatientResultComparison({ patientId }: { patientId: string }) {
  const [results, setResults] = useState<ComparisonResult[]>([])
  const [catalog, setCatalog] = useState<CatalogRecord[]>([])
  const [attempts, setAttempts] = useState<ResultAttempt[]>([])
  const [dimensions, setDimensions] = useState<ResultDimension[]>([])
  const [version, setVersion] = useState("")
  const [beforeId, setBeforeId] = useState("")
  const [afterId, setAfterId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reload, setReload] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError("")
    async function load() {
      try {
        const [all, assigned, tests, attemptRows, scores] = await Promise.all([
          loadAll<ComparisonResult>("/api/doctor/assessment-results", controller.signal),
          loadAll<AssignmentRecord>("/api/external/data/assessment-assignments", controller.signal),
          loadAll<CatalogRecord>("/api/external/assessment-catalog", controller.signal),
          loadAll<ResultAttempt>("/api/doctor/assessment-attempts", controller.signal),
          loadAll<ResultDimension>("/api/doctor/assessment-result-dimensions", controller.signal),
        ])
        if (controller.signal.aborted) return
        const rows = patientResults(all, assigned, patientId)
        const date = (r: ComparisonResult) => attemptRows.find(a => a.id === r.attempt_id)?.completed_at || r.calculated_at || r.created_at
        rows.sort((a, b) => Date.parse(date(b)) - Date.parse(date(a)) || a.id.localeCompare(b.id))
        setResults(rows); setCatalog(tests); setAttempts(attemptRows); setDimensions(scores)
        const initial = rows.find(r => rows.filter(other => other.assessment_version_id === r.assessment_version_id).length >= 2)?.assessment_version_id || rows[0]?.assessment_version_id || ""
        const pair = rows.filter(r => r.assessment_version_id === initial)
        setVersion(initial); setBeforeId(pair[1]?.id || ""); setAfterId(pair[0]?.id || "")
      } catch (error) { if (!controller.signal.aborted) setError(assignmentError(error)) }
      finally { if (!controller.signal.aborted) setLoading(false) }
    }
    void load()
    return () => controller.abort()
  }, [patientId, reload])
  const versions = [...new Set(results.map(r => r.assessment_version_id))]
  const matching = results.filter(r => r.assessment_version_id === version)
  const before = matching.find(r => r.id === beforeId)
  const after = matching.find(r => r.id === afterId)
  const date = (r: ComparisonResult) => {
    const completed = attempts.find(a => a.id === r.attempt_id)?.completed_at
    return `${new Date(completed || r.calculated_at || r.created_at).toLocaleString("en-IN")}${completed ? "" : " (result date)"}`
  }
  const codes = [...new Set(dimensions.filter(d => d.result_id === beforeId || d.result_id === afterId).map(d => d.dimension_code))]
  return <section className="bg-white border rounded-xl p-5 space-y-4">
    <div className="flex justify-between"><h2 className="font-bold text-lg">Compare Results by Date</h2><button disabled={loading} onClick={() => setReload(n => n + 1)} className="text-primary">Refresh</button></div>
    {loading && <p role="status">Loading completed results…</p>}
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {!loading && !error && (!results.length ? <p>No completed results for this patient yet. Comparison needs two completed attempts of the same test version.</p> : <>
      <label className="block text-sm">Test<select className="block border rounded-lg p-3 mt-1 w-full" value={version} onChange={e => {
        setVersion(e.target.value); const pair = results.filter(r => r.assessment_version_id === e.target.value); setBeforeId(pair[1]?.id || ""); setAfterId(pair[0]?.id || "")
      }}>{versions.map(id => { const test = catalog.find(t => t.assessment_version_id === id); return <option key={id} value={id}>{test ? `${test.name} (v${test.version_number})` : `Test version ${id}`} — {results.filter(r => r.assessment_version_id === id).length} results</option> })}</select></label>
      <p className="text-xs text-gray-500">Compare the same test version so scoring scales remain consistent. Change = comparison score minus baseline score.</p>
      {matching.length < 2 ? <p>Only one completed result is available for this test. A second completed attempt is needed to compare dates.</p> : <>
        <div className="grid md:grid-cols-2 gap-4">{[{ label: "Baseline date", value: beforeId, set: setBeforeId, other: afterId }, { label: "Comparison date", value: afterId, set: setAfterId, other: beforeId }].map(field => <label key={field.label}>{field.label}<select className="block w-full p-3 border rounded-lg mt-1" value={field.value} onChange={e => field.set(e.target.value)}>{matching.map((r, index) => <option key={r.id} value={r.id} disabled={r.id === field.other}>{date(r)} · Result {matching.length - index}</option>)}</select></label>)}</div>
        {before && after && before.id !== after.id && <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr>{["Score", "Baseline", "Comparison", "Change"].map(h => <th className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>
          <tr className="border-t font-semibold"><td className="p-3">Total score</td><td className="p-3">{score(before.total_score)}</td><td className="p-3">{score(after.total_score)}</td><td className="p-3">{difference(before.total_score, after.total_score)}</td></tr>
          {codes.flatMap(code => {
            const a = dimensions.find(d => d.result_id === before.id && d.dimension_code === code)
            const b = dimensions.find(d => d.result_id === after.id && d.dimension_code === code)
            return (["raw_score", "normalized_score", "percentile"] as const).filter(metric => a?.[metric] != null || b?.[metric] != null).map(metric => <tr key={`${code}-${metric}`} className="border-t"><td className="p-3">{a?.dimension_name || b?.dimension_name || code} — {metric.replaceAll("_", " ")}</td><td className="p-3">{score(a?.[metric])}</td><td className="p-3">{score(b?.[metric])}</td><td className="p-3">{difference(a?.[metric], b?.[metric])}</td></tr>)
          })}
        </tbody></table>{!codes.length && <p className="text-sm text-gray-500 mt-3">Dimension scores are not available for these results.</p>}</div>}
      </>}
    </>)}
  </section>
}
