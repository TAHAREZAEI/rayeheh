import Spinner from './Spinner'

export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Spinner className="h-10 w-10" />
      <p className="text-sm text-mist/70">لحظه‌ای، رایحه در حال پخش است…</p>
    </div>
  )
}
