
interface TagManagerProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const tags = [
  "Coding",
  "Studying",
  "Reading",
  "Break",
  "workout",
];

export function TagManager({
  selectedTag,
  onSelectTag,
}: TagManagerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={`rounded-lg border px-3 py-1.5 text-xs transition ${
            selectedTag === tag
              ? "border-sky-400/50 bg-sky-400/15 text-sky-400"
              : "border-white/10 text-gray-400 hover:bg-white/5"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
