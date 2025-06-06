import React, { useState } from "react";

function generateUserCode(username: string, joiningDate: Date): string {
  // Fixed prefix
  const prefix = "GHF";

  // Get first 3 letters of username (uppercase), padded with 'X' if less than 3
  const namePart = username.slice(0, 3).toUpperCase().padEnd(3, "X");

  // Format day and month to two digits
  const day = joiningDate.getDate().toString().padStart(2, '0');
  const month = (joiningDate.getMonth() + 1).toString().padStart(2, '0'); // month is 0-based

  // Combine all parts
  const code = `${prefix}${namePart}${day}${month}`;
  return code;
}

const AgentCodeGenerator: React.FC = () => {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");
  const [code, setCode] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!username || !date) {
      setCode(null);
      return;
    }
    const joiningDate = new Date(date);
    setCode(generateUserCode(username, joiningDate));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Agent Code Generator</h2>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Username</label>
        <input
          type="text"
          value={username}
          className="border rounded px-3 py-2 w-full"
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Joining Date</label>
        <input
          type="date"
          value={date}
          className="border rounded px-3 py-2 w-full"
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <button
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        onClick={handleGenerate}
      >
        Generate Code
      </button>
      {code && (
        <div className="mt-4 text-lg font-semibold text-green-700">
          Agent Code: <span className="font-mono">{code}</span>
        </div>
      )}
    </div>
  );
};

export default AgentCodeGenerator;
