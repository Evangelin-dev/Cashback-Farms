import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";

// --- Individual Document Content Components ---

function RegistryContent() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-green-700 flex items-center gap-2">
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth={2} />
          <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth={2} />
        </svg>
        Registry Document
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        This is the official registry document for your plot. It contains all legal and ownership details.
      </p>
      <div className="w-full h-48 flex items-center justify-center bg-green-50 rounded-lg border text-green-700 font-semibold">
        [Registry Document Preview]
      </div>
      <Button
        variant="primary"
        className="mt-4"
        onClick={() => alert("Registry Document Downloaded!")}
      >
        Download Registry
      </Button>
    </div>
  );
}

function NocContent() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-blue-700 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth={2} />
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
        </svg>
        NOC Certificate
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Download the No Objection Certificate for your plot. This is required for legal and construction purposes.
      </p>
      <div className="w-full h-48 flex items-center justify-center bg-blue-50 rounded-lg border text-blue-700 font-semibold">
        [NOC Certificate Download Link]
      </div>
      <Button
        variant="primary"
        className="mt-4"
        onClick={() => alert("NOC Certificate Downloaded!")}
      >
        Download NOC
      </Button>
    </div>
  );
}

function SitePlanContent() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-yellow-700 flex items-center gap-2">
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" strokeWidth={2} />
        </svg>
        Site Plan
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        View the detailed site plan for your plot, including boundaries, roads, and amenities.
      </p>
      <div className="w-full h-48 flex items-center justify-center bg-yellow-50 rounded-lg border text-yellow-700 font-semibold">
        [Site Plan Preview]
      </div>
      <Button
        variant="primary"
        className="mt-4"
        onClick={() => alert("Site Plan Opened!")}
      >
        View Site Plan
      </Button>
    </div>
  );
}

function LayoutContent() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-purple-700 flex items-center gap-2">
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth={2} />
          <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth={2} />
        </svg>
        Layout Plan
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Download the official layout plan for your plot and the overall project.
      </p>
      <div className="w-full h-48 flex items-center justify-center bg-purple-50 rounded-lg border text-purple-700 font-semibold">
        [Layout Plan Download Link]
      </div>
      <Button
        variant="primary"
        className="mt-4"
        onClick={() => alert("Layout Plan Downloaded!")}
      >
        Download Layout
      </Button>
    </div>
  );
}

function GuidelinesContent() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-pink-700 flex items-center gap-2">
        <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth={2} />
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
        </svg>
        Construction Guidelines
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        View the rules, setbacks, and approvals required for construction on your plot.
      </p>
      <div className="w-full h-48 flex items-center justify-center bg-pink-50 rounded-lg border text-pink-700 font-semibold">
        [Guidelines Document Preview]
      </div>
      <Button
        variant="primary"
        className="mt-4"
        onClick={() => alert("Guidelines Opened!")}
      >
        View Guidelines
      </Button>
    </div>
  );
}

// --- Main DocumentView UI with Routing ---

const DOCS = [
  {
    key: "registry",
    label: "View Registry",
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth={2} />
        <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
    desc: "Official registry document for your plot. Contains ownership and legal details.",
    path: "registry",
    Content: RegistryContent,
  },
  {
    key: "noc",
    label: "Download NOC",
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth={2} />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
    desc: "No Objection Certificate for your plot. Required for legal and construction purposes.",
    path: "noc",
    Content: NocContent,
  },
  {
    key: "siteplan",
    label: "View Site Plan",
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
    desc: "Detailed site plan showing plot boundaries, roads, and amenities.",
    path: "siteplan",
    Content: SitePlanContent,
  },
  {
    key: "layout",
    label: "Download Layout",
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth={2} />
        <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
    desc: "Download the official layout plan for your plot and project.",
    path: "layout",
    Content: LayoutContent,
  },
  {
    key: "guidelines",
    label: "View Guidelines",
    icon: (
      <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth={2} />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
    desc: "Rules, setbacks, and approvals required for construction on your plot.",
    path: "guidelines",
    Content: GuidelinesContent,
  },
];

const DocumentMenu: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card className="max-w-2xl w-full rounded-2xl shadow-2xl p-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Plot Documents & Downloads</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {DOCS.map((doc) => (
          <button
            key={doc.key}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition shadow-sm w-full bg-white hover:bg-green-50 ${
              selected === doc.key ? "border-green-600 scale-105" : "border-green-100"
            }`}
            onClick={() => {
              setSelected(doc.key);
              navigate(doc.path);
            }}
          >
            {doc.icon}
            <span className="font-bold text-green-700 mt-2">{doc.label}</span>
            <span className="text-xs text-gray-500 mt-1 text-center">{doc.desc}</span>
          </button>
        ))}
      </div>
      <div className="text-center text-gray-500 text-sm">Select a document to view details.</div>
    </Card>
  );
};

const DocumentView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-2">
      <Routes>
        <Route index element={<DocumentMenu />} />
        {DOCS.map(doc => (
          <Route
            key={doc.key}
            path={doc.path}
            element={
              <Card className="max-w-2xl w-full rounded-2xl shadow-2xl p-8">
                <doc.Content />
                <Button
                  variant="outline"
                  className="mt-8"
                  onClick={() => window.history.back()}
                >
                  Back to Documents
                </Button>
              </Card>
            }
          />
        ))}
      </Routes>
    </div>
  );
};

export default DocumentView;
