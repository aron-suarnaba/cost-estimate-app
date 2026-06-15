export function AppFooter() {
  return (
    <footer className="h-10 border-t border-slate-100 bg-white flex items-center justify-between px-8 text-xs text-slate-400 shrink-0">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        System Online
      </div>
      <div>
        &copy; {new Date().getFullYear()} Printwell Inc.
      </div>
    </footer>
  );
}