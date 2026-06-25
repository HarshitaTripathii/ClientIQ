import { FileSpreadsheet, FileText, Upload } from "lucide-react";

function UploadBox({ title, description, icon: Icon, onChange, fileName }) {
  return (
    <label className="block rounded-md border bg-white p-5 hover:border-teal-500">
      <div className="flex items-center gap-4">
        <div className="rounded-md border bg-slate-50 p-3 text-teal-700">
          <Icon size={28} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
          {fileName && <p className="mt-2 text-sm font-medium text-teal-700">{fileName}</p>}
        </div>
        <Upload size={20} className="text-slate-500" />
      </div>
      <input type="file" className="hidden" onChange={onChange} />
    </label>
  );
}

function UploadPanel({ project, onUploadNotes, onUploadData }) {
  return (
    <section className="p-5">
      <h2 className="text-lg font-semibold">Upload Inputs</h2>
      <p className="mt-1 text-sm text-slate-500">Upload meeting notes and CSV/Excel business data.</p>

      {!project && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Create a project first, then upload files.
        </div>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <UploadBox
          title="Meeting Notes"
          description="TXT works best for this beginner version"
          icon={FileText}
          onChange={onUploadNotes}
          fileName={project?.notes_path}
        />
        <UploadBox
          title="Data File"
          description="CSV or XLSX with customer/business data"
          icon={FileSpreadsheet}
          onChange={onUploadData}
          fileName={project?.data_path}
        />
      </div>
    </section>
  );
}

export default UploadPanel;

