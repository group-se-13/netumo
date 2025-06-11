import { useState, useEffect } from "react";
import { addTarget, updateTarget } from "../../api/targets";
import { theme } from "../../styles/theme";

interface TargetFormProps {
  onTargetSaved?: () => void;
  initialData?: { id?: number; name: string; url: string; active?: boolean };
  isEditing?: boolean;
  onCancel?: () => void;
}

const AddTargetForm = ({
  onTargetSaved,
  initialData = { name: "", url: "", active: true },
  isEditing = false,
  onCancel,
}: TargetFormProps) => {
  const [name, setName] = useState(initialData.name);
  const [url, setUrl] = useState(initialData.url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update local state only if the actual values of name or url change
  useEffect(() => {
    setName(initialData.name);
    setUrl(initialData.url);
  }, [initialData.name, initialData.url]);  // <-- fix here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !url.trim()) {
      setError("Both name and URL are required.");
      return;
    }

    setLoading(true);
    try {
      if (isEditing && initialData.id) {
        await updateTarget(initialData.id, { name, url, active: true });
        setSuccess(`Target "${name}" updated successfully!`);
      } else {
        await addTarget({ name, url });
        setSuccess(`Target "${name}" added successfully!`);
        setName("");
        setUrl("");
      }
      if (onTargetSaved) onTargetSaved();
    } catch (err) {
      setError("Failed to save target. Please check the server or input.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4 max-w-md">
      <h2 className={theme.subtitle}>{isEditing ? "✏️ Edit Target" : "➕ Add New Target"}</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          placeholder="e.g., My Website"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Target" : "Add Target"}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddTargetForm;
